# UMA VOZ ENTRE DOIS MUNDOS — site oficial

Site estático (HTML + CSS + JavaScript, sem build) construído a partir do protótipo
`index_v2.html`, com a estrutura de dois idiomas e de artigos da versão `index.html`.

- **Design:** vinho `#470513` + dourado `#e9c07a` (cores retiradas do logótipo)
- **Tipografia:** *Bodoni Moda* (a mesma família do logótipo) + *DM Sans*
- **Idiomas:** Português (predefinido) e Inglês, com botão PT | EN
- **Artigos:** geridos pelo painel `/admin` (Sveltia CMS + GitHub)
- **Candidaturas:** formulário próprio, com CV e carta de motivação → Google Drive
- **Alojamento previsto:** Netlify (gratuito)

---

## 1. Ver o site no computador

Não abras o `index.html` com duplo clique (o browser bloqueia o carregamento dos
artigos). Usa um dos dois métodos:

**Windows (recomendado)**
1. Duplo clique em **`preview.cmd`**
2. Abre em `http://localhost:5500`

**Qualquer editor**
- VS Code → extensão *Live Server* → botão direito no `index.html` → *Open with Live Server*

> O `preview.cmd` usa um pequeno servidor em PowerShell. Não instala nada.

---

## 2. Estrutura da pasta

```
entre-dois-mundos-site/
├── index.html            → página única (todas as secções)
├── 404.html              → página de erro (endereço inexistente)
├── css/style.css         → cores, tipografia, layout
├── js/app.js             → idiomas, artigos, modais, formulário
├── data/
│   ├── site.js           → configuração + todos os textos PT/EN
│   ├── posts.json        → artigos (editado pelo painel /admin)
│   └── settings.json     → biografia da Fundadora + email de contacto
├── admin/
│   ├── index.html        → painel de administração
│   └── config.yml        → configuração do painel
├── assets/               → logótipo, favicon, imagem de partilha, fotos
│   └── artigos/          → imagens dos artigos (enviadas pelo painel)
├── apps-script/          → backend gratuito das candidaturas (Google)
├── start.ps1 / preview.cmd
├── netlify.toml
├── robots.txt / sitemap.xml
├── GUIA-LANCAMENTO.md    → publicar o site (passo a passo)
├── GUIA-ADMIN.md         → como publicar artigos e ver candidaturas
└── README.md             → este ficheiro
```

---

## 3. O que editar (e onde)

| Quero mudar… | Ficheiro | Como |
|---|---|---|
| Textos do site, contactos, ligações | `data/site.js` | Editor de texto ou GitHub (lápis) |
| Artigos | `data/posts.json` | Painel `/admin` (recomendado) |
| Biografia / citação da Fundadora | `data/settings.json` | Painel `/admin` |
| Cores e tipos de letra | `css/style.css` | Bloco `:root` no topo |
| Email que recebe candidaturas | `apps-script/Code.gs` | `CONFIG.NOTIFY_EMAIL` |
| URL do serviço de candidaturas | `data/site.js` | `applyEndpoint` |

**Nunca é preciso mexer em `index.html` nem em `js/app.js`** para tarefas normais.

---

## 4. Publicar

Resumo (detalhe em **`GUIA-LANCAMENTO.md`**):

1. Criar repositório no GitHub e enviar esta pasta.
2. Netlify → *Import from GitHub* → publicar (sem build).
3. Ativar o painel `/admin` (OAuth do GitHub na Netlify).
4. Instalar o Apps Script das candidaturas e colar o URL em `data/site.js`.
5. Substituir os 3 artigos de demonstração e a fotografia da Fundadora.
6. Testar no telemóvel e no computador.

---

## 5. Custos

| Serviço | Plano | Custo |
|---|---|---|
| GitHub | Free | 0 € |
| Netlify | Free | 0 € |
| Google Drive + Apps Script | Conta Google | 0 € |
| Domínio próprio (opcional) | — | ~10–15 €/ano |

---

## 6. Privacidade — resumo

- Os CVs **não passam pelo GitHub**. Vão diretamente do formulário para uma pasta
  privada do Google Drive.
- O repositório do site é público (necessário para o plano gratuito), mas contém
  apenas o código e os artigos — nunca dados de candidatos.
- A Política de Privacidade está incluída no site (modal no rodapé) e deve ser
  revista antes do lançamento.
