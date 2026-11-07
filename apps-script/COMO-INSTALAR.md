# COMO INSTALAR O SERVIÇO DE CANDIDATURAS

**Tempo:** ~5 minutos · **Custo:** 0 € · **Conta:** Google (de preferência a da Andreza)

O formulário do site envia as candidaturas para um pequeno script do Google.
Esse script guarda os ficheiros numa pasta **privada** do Drive, regista tudo numa
folha de cálculo e envia um email de aviso.

```
Site (formulário)
      │  JSON com nome, email, CV em base64…
      ▼
Google Apps Script  ──►  Pasta privada no Drive (CV + carta)
                    ──►  Folha de cálculo (registo)
                    ──►  Email de aviso
```

---

## 1. Criar o projeto

1. Abre [script.google.com](https://script.google.com) com a conta Google correta
2. **Novo projeto** (New project)
3. Clica em "Projeto sem título" e renomeia para **`Candidaturas — Entre Dois Mundos`**

## 2. Colar o código

1. Apaga o conteúdo do editor (`function myFunction() { }`)
2. Abre `apps-script/Code.gs`, copia **tudo** e cola no editor
3. No topo, altera:

```js
NOTIFY_EMAIL: "o-email-que-recebe-avisos@exemplo.com",
```

4. Guarda: **Ctrl + S**

## 3. Autorizar e criar a pasta

1. Na lista de funções (barra superior), escolhe **`setup`**
2. Clica **Run / Executar**
3. Aparece um aviso do Google:
   - **Review permissions** → escolhe a conta
   - **Advanced** → **Go to Candidaturas — Entre Dois Mundos (unsafe)**
   - **Allow**
4. Abre **View → Logs** (ou Ctrl + Enter). Deves ver:

```
Pasta de candidaturas: https://drive.google.com/drive/folders/...
Folha de cálculo: https://docs.google.com/spreadsheets/d/...
```

> O aviso "unverified app" é normal: o script é teu, o Google apenas não o avaliou.

A partir de agora existe no teu Drive:

- a pasta **`Entre Dois Mundos — Candidaturas`**
- a folha **`Entre Dois Mundos — Candidaturas (registo)`**

## 4. Publicar como Web App

1. **Deploy** (canto superior direito) → **New deployment**
2. Clica na roda dentada ⚙ → escolhe **Web app**
3. Preenche:
   - **Description:** `v1`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. **Deploy**
5. Copia o **Web app URL** — termina em **`/exec`**:

```
https://script.google.com/macros/s/AKfycb.../exec
```

> **"Anyone" é obrigatório.** Se escolheres "Anyone with a Google account", os
> visitantes do site não conseguem enviar candidaturas.

## 5. Ligar ao site

1. Abre `data/site.js`
2. Substitui:

```js
applyEndpoint: "REPLACE_WITH_APPS_SCRIPT_URL",
```

por:

```js
applyEndpoint: "https://script.google.com/macros/s/AKfycb.../exec",
```

3. Guarda e publica (commit no GitHub → a Netlify atualiza sozinha)

## 6. Testar

1. Abre o site publicado
2. Preenche o formulário com dados de teste e anexa um PDF pequeno
3. Envia
4. Confirma:
   - [ ] mensagem verde de sucesso no site
   - [ ] pasta nova no Drive com o PDF
   - [ ] linha nova na folha de cálculo
   - [ ] email de aviso recebido

> Se o site disser "ainda não está ligado", o `applyEndpoint` ainda começa por `REPLACE`.
> Se disser "não foi possível enviar", vê a secção 8.

---

## 7. Atualizar o código mais tarde

Depois de alterares o `Code.gs`:

1. **Deploy** → **Manage deployments**
2. No deployment ativo, clica no lápis ✏️
3. **Version:** escolhe **New version**
4. **Deploy**

O URL **mantém-se o mesmo** — não precisas de mexer no site.

> Se usares "New deployment" em vez de "Manage deployments", é criado um URL novo
> e tens de o colar outra vez em `data/site.js`.

---

## 8. Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| "Script function not found: doPost" | O código não foi colado completo | Voltar a colar o `Code.gs` |
| Erro de autorização | `setup()` não foi autorizado | Correr `setup()` e aceitar |
| O site diz sucesso mas nada chega | Deployment não é **Anyone**, ou é versão antiga | Gerir deployments → nova versão |
| `Exception: Service invoked too many times` | Limite diário de emails | Esperar 24 h; ver limites abaixo |
| "Formato não permitido" | Ficheiro não é PDF/DOC/DOCX | Pedir PDF ao candidato |
| "Ficheiro demasiado grande" | > 5 MB | Comprimir o PDF |
| Acentuação estranha no Excel | CSV mal interpretado | Usar o Google Sheets diretamente |

### Ver o que se passou

Apps Script → menu **Executions** (Execuções). Cada envio aparece com
`Completed` ou `Failed` e a mensagem de erro.

---

## 9. Limites e segurança

| Limite | Valor |
|---|---|
| Tamanho por ficheiro | 5 MB (definido em `CONFIG.MAX_FILE_MB`) |
| Formatos | PDF, DOC, DOCX |
| Emails/dia (Gmail pessoal) | ~100 |
| Armazenamento | 15 GB partilhados com o Gmail |

**Quem tem acesso aos documentos?**
Só a conta Google que criou o script. As pastas são privadas por omissão.

**E se receber spam?**
O formulário tem um campo-armadilha invisível que bloqueia bots simples. Se ainda
assim receberes spam:
1. Apps Script → **Deploy → Manage deployments** → cria uma **nova versão**
2. Se o URL mudar, atualiza `data/site.js`
3. Opcional: adiciona uma palavra-passe partilhada no `Code.gs` e no `site.js`

**Retenção:** apaga as candidaturas não selecionadas após 12 meses (está descrito
na Política de Privacidade do site).

---

## 10. Alternativas (se um dia quiseres mudar)

| Serviço | Vantagem | Limitação |
|---|---|---|
| **Netlify Forms** | Integrado no alojamento | Upload de ficheiros limitado no plano gratuito |
| **Formspree** | Configuração muito simples | Upload só em planos pagos |
| **Supabase** | Base de dados + storage robustos | Exige conta e configuração |

O Apps Script foi escolhido por ser **gratuito, privado e sem servidor para manter**.
