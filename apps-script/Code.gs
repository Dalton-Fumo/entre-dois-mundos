/**
 * ============================================================
 *  UMA VOZ ENTRE DOIS MUNDOS — receção de candidaturas
 *  Google Apps Script (gratuito)
 * ------------------------------------------------------------
 *  O que faz:
 *   1. Recebe o formulário do site (JSON, ficheiros em base64)
 *   2. Cria uma pasta por candidatura no Google Drive (privada)
 *   3. Guarda CV e carta de motivação dentro dessa pasta
 *   4. Regista a candidatura numa folha de cálculo
 *   5. Envia um email de aviso
 *
 *  Instalação: ver COMO-INSTALAR.md (5 minutos)
 * ============================================================
 */

const CONFIG = {
  /* Email que recebe o aviso de cada candidatura */
  NOTIFY_EMAIL: "andreza.caldeira12@gmail.com",

  /* Nome da pasta no Drive (criada automaticamente) */
  ROOT_FOLDER_NAME: "Entre Dois Mundos — Candidaturas",

  /* Nome da folha de cálculo (criada automaticamente) */
  SPREADSHEET_NAME: "Entre Dois Mundos — Candidaturas (registo)",

  /* Limites — têm de coincidir com data/site.js */
  MAX_FILE_MB: 5,
  ALLOWED_EXT: ["pdf", "doc", "docx"],

  /* Fuso horário para datas no registo */
  TIMEZONE: "Europe/Lisbon",
};

const MIME_BY_EXT = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/* ============================================================
   ENDPOINTS
   ============================================================ */

function doGet() {
  return jsonResponse({
    ok: true,
    service: "entre-dois-mundos-candidaturas",
    time: new Date().toISOString(),
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);
  } catch (err) {
    return jsonResponse({ ok: false, error: "O serviço está ocupado. Tenta novamente." });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Pedido vazio.");
    }

    const data = JSON.parse(e.postData.contents);

    /* Honeypot: se o campo escondido vier preenchido, é um bot. */
    if (data.website) {
      return jsonResponse({ ok: true, skipped: true });
    }

    validate(data);

    const folder = createSubmissionFolder(data);
    const savedFiles = [];

    if (data.cv && data.cv.data) {
      savedFiles.push(saveFile(folder, data.cv, "CV"));
    }
    if (data.letter && data.letter.data) {
      savedFiles.push(saveFile(folder, data.letter, "Carta de motivacao"));
    }

    appendToSheet(data, folder, savedFiles);
    notifyByEmail(data, folder, savedFiles);

    return jsonResponse({ ok: true, folderId: folder.getId() });
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: String((err && err.message) || err) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validate(data) {
  const required = ["name", "email", "countryFrom", "countryLive", "topic"];
  const missing = required.filter(function (key) {
    return !data[key] || String(data[key]).trim() === "";
  });

  if (missing.length) {
    throw new Error("Campos obrigatórios em falta: " + missing.join(", "));
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    throw new Error("Email inválido.");
  }

  if (!data.cv && !data.letter) {
    throw new Error("É necessário anexar o currículo e/ou a carta de motivação.");
  }

  if (!data.consent) {
    throw new Error("Consentimento de privacidade não aceite.");
  }
}

/* ============================================================
   DRIVE
   ============================================================ */

function getRootFolder() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty("ROOT_FOLDER_ID");

  if (savedId) {
    try {
      return DriveApp.getFolderById(savedId);
    } catch (err) {
      /* pasta apagada — recria abaixo */
    }
  }

  const folders = DriveApp.getFoldersByName(CONFIG.ROOT_FOLDER_NAME);
  const folder = folders.hasNext()
    ? folders.next()
    : DriveApp.createFolder(CONFIG.ROOT_FOLDER_NAME);

  props.setProperty("ROOT_FOLDER_ID", folder.getId());
  return folder;
}

function createSubmissionFolder(data) {
  const root = getRootFolder();
  const now = new Date();
  const date = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd");
  const time = Utilities.formatDate(now, CONFIG.TIMEZONE, "HH-mm");
  const name = sanitize(data.name, 60);

  return root.createFolder(date + " " + time + " — " + name);
}

function saveFile(folder, file, label) {
  if (!file.data) return null;

  const originalName = sanitize(file.name || "documento", 80);
  const ext = String(originalName).split(".").pop().toLowerCase();

  if (CONFIG.ALLOWED_EXT.indexOf(ext) === -1) {
    throw new Error("Formato não permitido: " + ext);
  }

  const bytes = Utilities.base64Decode(file.data);
  const sizeMB = bytes.length / (1024 * 1024);

  if (sizeMB > CONFIG.MAX_FILE_MB) {
    throw new Error("Ficheiro demasiado grande: " + originalName);
  }

  const mime = MIME_BY_EXT[ext] || file.type || "application/octet-stream";
  const finalName = label + " — " + originalName;
  const blob = Utilities.newBlob(bytes, mime, finalName);
  const created = folder.createFile(blob);

  return { label: label, name: originalName, url: created.getUrl(), size: bytes.length };
}

/* ============================================================
   FOLHA DE CÁLCULO
   ============================================================ */

function getSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty("SPREADSHEET_ID");

  if (savedId) {
    try {
      return SpreadsheetApp.openById(savedId);
    } catch (err) {
      /* folha apagada — recria abaixo */
    }
  }

  const root = getRootFolder();
  const files = DriveApp.getFilesByName(CONFIG.SPREADSHEET_NAME);

  let spreadsheet;
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    DriveApp.getFileById(spreadsheet.getId()).moveTo(root);

    const sheet = spreadsheet.getActiveSheet();
    sheet.appendRow([
      "Data",
      "Nome",
      "Email",
      "Telefone",
      "LinkedIn",
      "País de origem",
      "País onde vive",
      "Tema",
      "Mensagem",
      "Idioma",
      "CV",
      "Carta",
      "Pasta",
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange("A1:M1").setFontWeight("bold");
  }

  props.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  return spreadsheet;
}

function appendToSheet(data, folder, savedFiles) {
  const sheet = getSpreadsheet().getActiveSheet();

  const byLabel = {};
  savedFiles.forEach(function (file) {
    if (file) byLabel[file.label] = file.url;
  });

  sheet.appendRow([
    Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss"),
    String(data.name || ""),
    String(data.email || ""),
    String(data.phone || ""),
    String(data.linkedin || ""),
    String(data.countryFrom || ""),
    String(data.countryLive || ""),
    String(data.topic || ""),
    String(data.message || ""),
    String(data.lang || ""),
    byLabel["CV"] || "",
    byLabel["Carta de motivacao"] || "",
    folder.getUrl(),
  ]);
}

/* ============================================================
   EMAIL
   ============================================================ */

function notifyByEmail(data, folder, savedFiles) {
  const subject = "Nova candidatura — " + String(data.name || "sem nome");

  const lines = [
    "Nova candidatura recebida no site Uma Voz Entre Dois Mundos.",
    "",
    "Nome: " + (data.name || ""),
    "Email: " + (data.email || ""),
    "Telefone: " + (data.phone || "—"),
    "LinkedIn: " + (data.linkedin || "—"),
    "País de origem: " + (data.countryFrom || ""),
    "País onde vive: " + (data.countryLive || ""),
    "Tema: " + (data.topic || ""),
    "Idioma: " + (data.lang || ""),
    "",
    "Mensagem:",
    data.message || "—",
    "",
    "Ficheiros:",
  ];

  if (savedFiles.length) {
    savedFiles.forEach(function (file) {
      lines.push("• " + file.label + ": " + file.url);
    });
  } else {
    lines.push("• (nenhum)");
  }

  lines.push("");
  lines.push("Pasta da candidatura: " + folder.getUrl());
  lines.push("");
  lines.push("Consentimento de privacidade: sim");

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: subject,
    body: lines.join("\n"),
  });
}

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function jsonResponse(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitize(value, maxLength) {
  return String(value || "")
    .replace(/[\\/:*?"<>|#%{}~&]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength || 80) || "sem-nome";
}

/**
 * Corre esta função UMA VEZ depois de colar o código.
 * Cria a pasta e a folha de cálculo e mostra os links no registo.
 */
function setup() {
  const folder = getRootFolder();
  const spreadsheet = getSpreadsheet();

  console.log("Pasta de candidaturas: " + folder.getUrl());
  console.log("Folha de cálculo: " + spreadsheet.getUrl());
  console.log("Pastas e folha criadas com sucesso. Já podes publicar o Web App.");
}
