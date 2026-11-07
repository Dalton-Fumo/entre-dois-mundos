/* ============================================================
   UMA VOZ ENTRE DOIS MUNDOS — lógica do site
   Sem dependências externas. Não precisas de editar este ficheiro
   para mudar textos (data/site.js) nem artigos (data/posts.json).
   ============================================================ */

(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var STORAGE_KEY = "edmm_lang";
  var lang = "pt";
  try { if (localStorage.getItem(STORAGE_KEY) === "en") lang = "en"; } catch (e) {}

  var POSTS = [];
  var SETTINGS = null;
  var postsFailed = false;
  var activeFilter = "all";
  var currentArticle = null;
  var lastFocused = null;

  /* ------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------ */
  function t(key) {
    if (I18N[lang] && typeof I18N[lang][key] !== "undefined") return I18N[lang][key];
    if (I18N.pt && typeof I18N.pt[key] !== "undefined") return I18N.pt[key];
    return key;
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function safeUrl(url) {
    var clean = String(url || "").replace(/["'<>]/g, "");
    return /^(https?:\/\/|mailto:|\/|#)/i.test(clean) ? clean : "#";
  }

  function inlineMd(text) {
    var out = esc(text);
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt, url) {
      return '<img src="' + safeUrl(url) + '" alt="' + alt + '" loading="lazy">';
    });
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
      return '<a href="' + safeUrl(url) + '" target="_blank" rel="noopener noreferrer">' + label + "</a>";
    });
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    out = out.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    return out;
  }

  function mdToHtml(markdown) {
    var lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
    var html = "";
    var list = null;
    var para = [];

    function flushPara() {
      if (para.length) { html += "<p>" + inlineMd(para.join(" ")) + "</p>"; para = []; }
    }
    function closeList() {
      if (list) { html += "</" + list + ">"; list = null; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) { flushPara(); closeList(); continue; }

      var m;
      if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
        flushPara(); closeList();
        var lvl = Math.min(m[1].length + 1, 5);
        html += "<h" + lvl + ">" + inlineMd(m[2]) + "</h" + lvl + ">";
        continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) { flushPara(); closeList(); html += "<hr>"; continue; }
      if ((m = line.match(/^>\s?(.*)$/))) {
        flushPara(); closeList();
        html += "<blockquote>" + inlineMd(m[1]) + "</blockquote>";
        continue;
      }
      if ((m = line.match(/^[-*+]\s+(.*)$/))) {
        flushPara();
        if (list !== "ul") { closeList(); html += "<ul>"; list = "ul"; }
        html += "<li>" + inlineMd(m[1]) + "</li>";
        continue;
      }
      if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
        flushPara();
        if (list !== "ol") { closeList(); html += "<ol>"; list = "ol"; }
        html += "<li>" + inlineMd(m[1]) + "</li>";
        continue;
      }
      para.push(line);
    }
    flushPara(); closeList();
    return html;
  }

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(String(iso).slice(0, 10) + "T12:00:00");
    if (isNaN(d.getTime())) return iso;
    try {
      return new Intl.DateTimeFormat(lang === "pt" ? "pt-PT" : "en-GB", {
        day: "numeric", month: "long", year: "numeric"
      }).format(d);
    } catch (e) {
      return iso;
    }
  }

  /* ------------------------------------------------------------
     Idiomas
     ------------------------------------------------------------ */
  function applyI18n() {
    document.documentElement.lang = lang;
    document.title = t("meta_title");

    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta_desc"));

    $$("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    $$("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    $$("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });

    refreshFileLabels();
  }

  function applySettings() {
    var email = (SETTINGS && SETTINGS.contactEmail) || SITE.contactEmail;
    SITE.contactEmail = email;

    var footerEmail = $("#footerEmail");
    if (footerEmail) {
      footerEmail.href = "mailto:" + email;
      footerEmail.textContent = email;
    }

    var privacyBody = $("#privacyBody");
    if (privacyBody) {
      privacyBody.innerHTML = String(t("privacy_body"))
        .replace(/geral@entre-dois-mundos\.com/g, esc(email));
    }

    if (!SETTINGS || !SETTINGS.founder) return;
    var founder = SETTINGS.founder[lang] || SETTINGS.founder.pt;
    if (!founder) return;

    var bio = $("#founderBio");
    if (bio && founder.bio) bio.innerHTML = mdToHtml(founder.bio);

    var quote = $("#founderQuote");
    if (quote && founder.quote) quote.textContent = founder.quote;
  }

  function setLanguage(next) {
    lang = next === "en" ? "en" : "pt";
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    activeFilter = "all";
    applyI18n();
    applySettings();
    renderFilters();
    renderCards();
    if (currentArticle) {
      renderArticleContent(currentArticle);
    }
  }

  /* ------------------------------------------------------------
     Dados
     ------------------------------------------------------------ */
  function fetchJson(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  function loadData() {
    var settingsPromise = fetchJson("data/settings.json").then(function (data) {
      SETTINGS = data;
    }).catch(function () { /* opcional */ });

    var postsPromise = fetchJson("data/posts.json").then(function (data) {
      POSTS = Array.isArray(data.posts) ? data.posts : [];
      POSTS.sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
    }).catch(function () {
      postsFailed = true;
      POSTS = [];
    });

    return Promise.all([settingsPromise, postsPromise]);
  }

  /* ------------------------------------------------------------
     Artigos
     ------------------------------------------------------------ */
  function renderFilters() {
    var bar = $("#filterBar");
    if (!bar) return;
    bar.innerHTML = "";

    var tags = [];
    POSTS.forEach(function (post) {
      var tag = post["tag_" + lang] || post.tag_pt;
      if (tag && tags.indexOf(tag) === -1) tags.push(tag);
    });

    var items = [{ value: "all", label: t("filter_all") }].concat(
      tags.map(function (tag) { return { value: tag, label: tag }; })
    );

    items.forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = item.label;
      button.className = activeFilter === item.value ? "active" : "";
      button.setAttribute("aria-pressed", activeFilter === item.value ? "true" : "false");
      button.addEventListener("click", function () {
        activeFilter = item.value;
        renderFilters();
        renderCards();
      });
      bar.appendChild(button);
    });
  }

  function renderCards() {
    var grid = $("#articleCards");
    var note = $("#articlesNote");
    if (!grid) return;

    grid.innerHTML = "";
    if (note) { note.hidden = true; note.textContent = ""; }

    if (postsFailed) {
      if (note) { note.hidden = false; note.textContent = t("articles_error"); }
      return;
    }

    if (!POSTS.length) {
      if (note) { note.hidden = false; note.textContent = t("articles_empty"); }
      return;
    }

    var visible = POSTS.filter(function (post) {
      return activeFilter === "all" || (post["tag_" + lang] || post.tag_pt) === activeFilter;
    });

    if (!visible.length) {
      if (note) { note.hidden = false; note.textContent = t("articles_empty"); }
      return;
    }

    visible.forEach(function (post) {
      var index = POSTS.indexOf(post) + 1;
      var tag = post["tag_" + lang] || post.tag_pt || "";
      var title = post["title_" + lang] || post.title_pt || "";
      var excerpt = post["excerpt_" + lang] || post.excerpt_pt || "";

      var card = document.createElement("article");
      card.className = "card";

      var visual = document.createElement("div");
      visual.className = "card-visual";
      if (post.cover) {
        var img = document.createElement("img");
        img.src = post.cover;
        img.alt = "";
        img.loading = "lazy";
        visual.appendChild(img);
      } else {
        var symbol = document.createElement("span");
        symbol.className = "card-symbol";
        symbol.textContent = String(index).padStart(2, "0");
        visual.appendChild(symbol);
      }

      var content = document.createElement("div");
      content.className = "card-content";
      content.innerHTML =
        (tag ? '<p class="tag">' + esc(tag) + "</p>" : "") +
        "<h3>" + esc(title) + "</h3>" +
        "<p>" + esc(excerpt) + "</p>" +
        '<p class="card-meta">' + esc(post.author || SITE.author) + " · " + esc(formatDate(post.date)) + "</p>";

      var button = document.createElement("button");
      button.type = "button";
      button.className = "card-btn";
      button.innerHTML = esc(t("read_article")) + ' <span aria-hidden="true">→</span>';
      button.addEventListener("click", function () { openArticle(post.id, button); });

      content.appendChild(button);
      card.appendChild(visual);
      card.appendChild(content);
      grid.appendChild(card);
    });
  }

  function renderArticleContent(post) {
    $("#modalTag").textContent = post["tag_" + lang] || post.tag_pt || "";
    $("#modalTitle").textContent = post["title_" + lang] || post.title_pt || "";
    $("#modalMeta").textContent =
      t("article_by") + " " + (post.author || SITE.author) + " · " + formatDate(post.date);
    $("#modalBody").innerHTML = mdToHtml(post["body_" + lang] || post.body_pt || "");
    setupComments(post);
  }

  function openArticle(id, trigger) {
    var post = POSTS.filter(function (p) { return p.id === id; })[0];
    if (!post) return;

    currentArticle = post;
    lastFocused = trigger || document.activeElement;
    renderArticleContent(post);
    showModal($("#articleModal"));

    try {
      history.replaceState(null, "", "#artigo/" + encodeURIComponent(post.id));
    } catch (e) {
      location.hash = "#artigo/" + encodeURIComponent(post.id);
    }
  }

  function closeArticle() {
    hideModal($("#articleModal"));
    currentArticle = null;
    if (location.hash.indexOf("#artigo/") === 0) {
      try { history.replaceState(null, "", "#artigos"); } catch (e) {}
    }
  }

  function setupComments(post) {
    var section = $("#commentsSection");
    var box = $("#giscus");
    var off = $("#commentsOff");
    if (!section || !box) return;

    box.innerHTML = "";
    var giscus = SITE.giscus || {};

    if (!giscus.enabled || !giscus.repoId || !giscus.categoryId) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    if (off) off.hidden = true;

    var script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    var attrs = {
      "data-repo": giscus.repo,
      "data-repo-id": giscus.repoId,
      "data-category": giscus.category,
      "data-category-id": giscus.categoryId,
      "data-mapping": "specific",
      "data-term": "artigo-" + post.id,
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": "light",
      "data-lang": lang,
      "data-loading": "lazy"
    };

    Object.keys(attrs).forEach(function (key) {
      script.setAttribute(key, attrs[key]);
    });

    box.appendChild(script);
  }

  /* ------------------------------------------------------------
     Modais
     ------------------------------------------------------------ */
  function showModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    var close = modal.querySelector(".modal-close");
    if (close) close.focus();
  }

  function hideModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    if (!$(".modal:not([hidden])")) document.body.classList.remove("no-scroll");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function setupModals() {
    $("#closeModal").addEventListener("click", closeArticle);
    $$("[data-close-article]").forEach(function (el) {
      el.addEventListener("click", closeArticle);
    });

    $("#closePrivacy").addEventListener("click", function () {
      hideModal($("#privacyModal"));
    });
    $$("[data-close-privacy]").forEach(function (el) {
      el.addEventListener("click", function () { hideModal($("#privacyModal")); });
    });

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-privacy]");
      if (trigger) {
        event.preventDefault();
        lastFocused = trigger;
        showModal($("#privacyModal"));
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!$("#articleModal").hidden) closeArticle();
      else if (!$("#privacyModal").hidden) hideModal($("#privacyModal"));
    });
  }

  /* ------------------------------------------------------------
     Navegação
     ------------------------------------------------------------ */
  function setupNav() {
    var header = $(".site-header");
    var toggle = $("#navToggle");
    var nav = $("#siteNav");
    if (!header || !toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    $$("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------
     Formulário
     ------------------------------------------------------------ */
  function fileToPayload(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || "");
        var comma = result.indexOf(",");
        resolve({
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          data: comma >= 0 ? result.slice(comma + 1) : ""
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function refreshFileLabels() {
    $$(".file-input").forEach(function (input) {
      var drop = input.nextElementSibling;
      if (!drop) return;
      var nameEl = drop.querySelector(".file-name");
      if (!nameEl) return;
      var file = input.files && input.files[0];
      nameEl.textContent = file ? file.name : t("f_no_file");
      input.classList.toggle("has-file", !!file);
    });
  }

  function setupFileInputs() {
    $$(".file-input").forEach(function (input) {
      input.addEventListener("change", refreshFileLabels);
    });
  }

  function showFormMessage(type, text) {
    var box = $("#formMessage");
    if (!box) return;
    box.className = "form-message show " + type;
    box.textContent = text;
  }

  function clearFormMessage() {
    var box = $("#formMessage");
    if (!box) return;
    box.className = "form-message";
    box.textContent = "";
  }

  function markInvalidFields(form) {
    $$("input, select, textarea", form).forEach(function (field) {
      field.classList.toggle("invalid", !field.checkValidity());
    });
  }

  function setLoading(loading) {
    var button = $("#submitBtn");
    if (!button) return;
    var label = button.querySelector(".btn-label");
    button.disabled = loading;
    button.classList.toggle("loading", loading);
    if (label) label.textContent = loading ? t("f_sending") : t("f_submit");
  }

  function validateFiles(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file) continue;
      var ext = String(file.name).split(".").pop().toLowerCase();
      if (SITE.allowedExtensions.indexOf(ext) === -1) {
        return t("f_bad_type");
      }
      if (file.size > SITE.maxFileMB * 1024 * 1024) {
        return t("f_too_big");
      }
    }
    return "";
  }

  function setupForm() {
    var form = $("#applyForm");
    if (!form) return;

    $$("input, select, textarea", form).forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.checkValidity()) field.classList.remove("invalid");
      });
      field.addEventListener("change", function () {
        if (field.checkValidity()) field.classList.remove("invalid");
      });
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearFormMessage();
      markInvalidFields(form);

      if (!form.checkValidity()) {
        showFormMessage("error", t("f_required"));
        var firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var consent = $("#consent");
      if (consent && !consent.checked) {
        showFormMessage("error", t("f_consent_required"));
        consent.focus();
        return;
      }

      var cvInput = $("#cv");
      var letterInput = $("#letter");
      var cv = cvInput && cvInput.files ? cvInput.files[0] : null;
      var letter = letterInput && letterInput.files ? letterInput.files[0] : null;

      if (!cv && !letter) {
        showFormMessage("error", t("f_need_docs"));
        if (cvInput) cvInput.focus();
        return;
      }

      var fileError = validateFiles([cv, letter]);
      if (fileError) {
        showFormMessage("error", fileError);
        return;
      }

      if (!SITE.applyEndpoint || SITE.applyEndpoint.indexOf("REPLACE") === 0) {
        showFormMessage("error", t("f_endpoint_missing"));
        return;
      }

      var data = new FormData(form);
      if (data.get("website")) return; /* honeypot */

      setLoading(true);
      try {
        var payload = {
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          linkedin: data.get("linkedin"),
          countryFrom: data.get("countryFrom"),
          countryLive: data.get("countryLive"),
          topic: data.get("topic"),
          message: data.get("message"),
          consent: true,
          lang: lang,
          page: location.href,
          submittedAt: new Date().toISOString(),
          cv: cv ? await fileToPayload(cv) : null,
          letter: letter ? await fileToPayload(letter) : null
        };

        await fetch(SITE.applyEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });

        form.reset();
        refreshFileLabels();
        showFormMessage("success", t("f_success"));
        var message = $("#formMessage");
        if (message && message.scrollIntoView) {
          message.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } catch (error) {
        console.error(error);
        showFormMessage("error", t("f_error"));
      } finally {
        setLoading(false);
      }
    });
  }

  /* ------------------------------------------------------------
     Arranque
     ------------------------------------------------------------ */
  function handleHash() {
    var match = location.hash.match(/^#artigo\/(.+)$/);
    if (!match) return;
    var id = decodeURIComponent(match[1]);
    var exists = POSTS.some(function (post) { return post.id === id; });
    if (exists) openArticle(id, null);
  }

  function init() {
    applyI18n();
    setupNav();
    setupFileInputs();
    setupForm();
    setupModals();

    $("#langToggle").addEventListener("click", function () {
      setLanguage(lang === "pt" ? "en" : "pt");
    });

    window.addEventListener("hashchange", function () {
      if (location.hash.indexOf("#artigo/") === 0) {
        handleHash();
      } else if (!$("#articleModal").hidden) {
        hideModal($("#articleModal"));
        currentArticle = null;
      }
    });

    loadData().then(function () {
      applySettings();
      renderFilters();
      renderCards();
      handleHash();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
