# GUIA DE LANÇAMENTO — do zero ao site online

Tempo estimado: **45–60 minutos** na primeira vez.
Não é preciso instalar nada no computador (exceto se quiseres usar Git).

---

## 0. O que é o quê (para não haver confusão)

| Peça | Para que serve | Analogia |
|---|---|---|
| **GitHub** | Guarda os ficheiros do site e o histórico de alterações | O arquivo onde está o manuscrito |
| **Netlify** | Pega nesses ficheiros e publica-os na internet | A gráfica que imprime e põe à venda |
| **Sveltia CMS** (`/admin`) | Formulário onde se escrevem os artigos; grava no GitHub | O editor de texto |
| **Google Apps Script + Drive** | Recebe as candidaturas e guarda os CVs em privado | O arquivo de candidaturas |
| **Domínio** (opcional) | O endereço bonito (ex.: `umavoZentredoisMundos.com`) | A morada |

O site **não vive no GitHub**. O GitHub é o armazém; a Netlify é que o mostra ao
mundo. Quando algo muda no GitHub, a Netlify republica sozinha em ~1 minuto.

> **Porque não guardar os CVs no GitHub?**
> Num repositório público, os ficheiros ficam visíveis para qualquer pessoa.
> Num repositório privado, o site precisaria de um *token* secreto no browser —
> que qualquer visitante poderia copiar. Por isso as candidaturas vão para o
> Google Drive, que é privado por omissão.

---

## 1. Contas necessárias (todas gratuitas)

- [GitHub](https://github.com/signup)
- [Netlify](https://app.netlify.com/signup) (podes entrar com a conta GitHub)
- Conta Google (para o Drive/Apps Script) — de preferência a da Andreza

---

## 2. Pôr o código no GitHub

### Opção A — pelo browser (mais simples)

1. GitHub → botão **+** → **New repository**
2. Nome: **`entre-dois-mundos`**
3. Visibilidade: **Public** (necessário para o plano gratuito e para o painel)
4. **Create repository**
5. Na página seguinte: **uploading an existing file**
6. Arrasta **todo o conteúdo** da pasta `entre-dois-mundos-site` (não a pasta em si:
   abre-a e arrasta o que está lá dentro, incluindo as subpastas `css`, `js`, `data`,
   `assets`, `admin`, `apps-script`).
7. Em baixo, **Commit changes**.

> O `index.html` tem de ficar na raiz do repositório.

### Opção B — com Git (linha de comando)

```powershell
cd "C:\Users\dalto\Desktop\Automation\entre-dois-mundos-site"
git init
git add .
git commit -m "Site inicial"
git branch -M main
git remote add origin https://github.com/Dalton-Fumo/entre-dois-mundos.git
git push -u origin main
```

---

## 3. Publicar na Netlify

1. Netlify → **Add new project** → **Import an existing project**
2. Escolhe **GitHub** → autoriza → seleciona o repositório `entre-dois-mundos`
3. Configuração:
   - **Build command:** deixar vazio
   - **Publish directory:** `.` (um ponto)
4. **Deploy**

Em ~30 segundos o site fica em algo como
`https://entre-dois-mundos.netlify.app`.

> O ficheiro `netlify.toml` já define a pasta de publicação e os cabeçalhos de
> segurança — não precisas de mudar nada.
>
> **Alternativa manual:** `app.netlify.com/drop` → arrastar a pasta. Funciona, mas
> obriga a repetir o gesto em cada alteração. A ligação ao GitHub é melhor.

### Mudar o nome do site

Netlify → **Project configuration** → **Site details** → **Change site name**.

---

## 4. Ativar o painel de artigos (`/admin`)

O painel usa **Sveltia CMS** (o sucessor ativo do Decap CMS) e grava diretamente
no GitHub. O login é feito com GitHub, através da Netlify.

### 4.1 Criar a app OAuth no GitHub

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Preenche:
   - **Application name:** `Uma Voz Entre Dois Mundos — CMS`
   - **Homepage URL:** `https://entre-dois-mundos.netlify.app`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
3. **Register application**
4. Copia o **Client ID**
5. Clica **Generate a new client secret** e copia o **Client Secret** (só aparece uma vez)

> ⚠️ Cria uma **OAuth App**, não uma *GitHub App*. Se vires a opção
> "Expire user access tokens", estás no sítio errado.

### 4.2 Instalar o provedor na Netlify

1. Netlify → o teu site → **Project configuration**
2. **Access & security** → **OAuth** → **Install provider**
3. Escolhe **GitHub**, cola o **Client ID** e o **Client Secret** → **Install**

> Isto **não** é a secção *Identity* (essa está descontinuada). É *Access & security → OAuth*.

### 4.3 Confirmar o repositório no painel

Abre `admin/config.yml` e confirma:

```yaml
backend:
  name: github
  repo: Dalton-Fumo/entre-dois-mundos   # utilizador/repositório
  branch: main
```

Se o teu repositório tiver outro nome, altera aqui (no GitHub, lápis → editar → commit).

### 4.4 Entrar

1. Abre `https://entre-dois-mundos.netlify.app/admin/`
2. **Sign in with GitHub** → **Authorize**
3. Já está: podes criar e editar artigos.

> O endereço `/admin/` está marcado como `noindex` — não aparece no Google.

---

## 5. Ligar o formulário de candidaturas

Segue **`apps-script/COMO-INSTALAR.md`** (5 minutos).

No fim vais obter um URL terminado em **`/exec`**. Cola-o em `data/site.js`:

```js
applyEndpoint: "https://script.google.com/macros/s/AKfy.../exec",
```

Depois faz commit (pelo GitHub ou pelo editor). A Netlify republica sozinha.

**Teste obrigatório:** envia uma candidatura real de teste com um PDF pequeno.
Confirma que:
- [ ] aparece uma pasta nova no Drive
- [ ] a linha aparece na folha de cálculo
- [ ] chega o email de aviso
- [ ] o site mostra a mensagem de sucesso

---

## 6. Comentários nos artigos

Cada artigo tem uma secção de comentários: o leitor escreve o nome e o comentário,
sem precisar de conta. Os comentários ficam guardados na base de dados da Netlify
(tabela `comments`) e aparecem logo no artigo.

- Para desligar os comentários: em `data/site.js`, muda `commentsEnabled` para `false`.
- Para apagar um comentário: Netlify → projeto → **Database** → tabela `comments`.

---

## 7. Conteúdo a substituir antes do lançamento

- [ ] **3 artigos de demonstração** em `data/posts.json` → apagar ou substituir no `/admin`
- [ ] **Fotografia da Fundadora** → guardar como `assets/fundadora.jpg` (retrato, ideal 800×1000 px)
- [ ] **Email de contacto** → `data/site.js` (`contactEmail`) e `apps-script/Code.gs` (`NOTIFY_EMAIL`)
- [ ] **Política de Privacidade** → `data/site.js`, chave `privacy_body` (PT e EN): confirmar responsável, prazo de conservação e contacto
- [ ] **Nome do repositório** em `admin/config.yml`
- [ ] **Domínio** em `index.html` (meta `og:url`, `og:image`), `robots.txt`, `sitemap.xml` e `admin/config.yml`
- [ ] **Data de abertura / critérios** → `apply_deadline` e `apply_lead` em `data/site.js`
- [ ] **Livro / biografia** → `data/settings.json` (pelo `/admin`)

---

## 8. Domínio próprio (opcional, ~10–15 €/ano)

1. Compra o domínio (Namecheap, Cloudflare Registrar, etc.).
2. Netlify → **Domain management** → **Add a domain**.
3. Segue as instruções de DNS (normalmente um registo `CNAME` para
   `o-teu-site.netlify.app`, ou os *nameservers* da Netlify).
4. A Netlify emite o certificado HTTPS automaticamente (Let's Encrypt).
5. Atualiza os URLs em `index.html`, `robots.txt`, `sitemap.xml` e `admin/config.yml`.

> Se mudares de domínio, volta a entrar em `/admin` uma vez para confirmar o login.

---

## 9. Checklist final

- [ ] Site abre em `https://…netlify.app` e em `http://localhost:5500`
- [ ] Botão **PT | EN** troca todos os textos (incluindo artigos)
- [ ] Artigos abrem no modal e o link `#artigo/…` é partilhável
- [ ] Formulário valida campos obrigatórios
- [ ] Formulário recusa ficheiros > 5 MB ou formatos errados
- [ ] Candidatura de teste chega ao Drive + folha + email
- [ ] `/admin` abre e permite criar um artigo de teste
- [ ] Artigo de teste aparece no site após ~1 min
- [ ] Telemóvel: menu, formulário e modais funcionam
- [ ] Política de Privacidade revista por alguém responsável
- [ ] Backup: o repositório GitHub é o backup; o Drive tem as candidaturas

---

## 10. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| "Não foi possível carregar os artigos" | Abriste o `index.html` com duplo clique | Usa `preview.cmd` ou o site publicado |
| `/admin` não abre / fica em branco | OAuth não instalado ou repo errado | Repetir secção 4; confirmar `repo` em `admin/config.yml` |
| Login GitHub: `redirect_uri_mismatch` | Callback errado | Tem de ser exatamente `https://api.netlify.com/auth/done` |
| Formulário diz "ainda não está ligado" | `applyEndpoint` ainda começa por `REPLACE` | Colar o URL `/exec` em `data/site.js` |
| Formulário "envia" mas não chega nada | Deployment não está como **Anyone**, ou é uma versão antiga | Apps Script → *Deploy* → *Manage deployments* → editar → **New version** |
| Erro 401/403 no Apps Script | Falta autorização | Correr `setup()` e autorizar |
| Acentuação estranha no Excel | Importação CSV | Importar como UTF-8, ou usar diretamente o Google Sheets |
| Alterei o site e não mudou | Deploy ainda a correr / cache | Esperar 1 min; Ctrl+F5 |
| Artigo não aparece | `id` repetido ou data inválida | IDs únicos, minúsculas, sem acentos |

---

## 11. Custos e limites

| Serviço | Limite gratuito | Suficiente? |
|---|---|---|
| Netlify | 100 GB tráfego/mês, 300 min de build | Sim (site estático) |
| GitHub | Repositórios públicos ilimitados | Sim |
| Google Drive | 15 GB partilhados com o Gmail | Sim (CVs são pequenos) |
| Apps Script | ~100 emails/dia, execuções generosas | Sim |
| Giscus | Gratuito | Sim |

**Total: 0 €/mês** (exceto domínio, se comprado).

---

## 12. Alternativas de alojamento

Se um dia quiseres mudar, o código é o mesmo:

- **Cloudflare Pages** — `nome.pages.dev`, banda ilimitada. O `/admin` precisa de
  um *worker* de autenticação (Sveltia CMS Authenticator, gratuito).
- **GitHub Pages** — `utilizador.github.io`, servido do próprio repositório. Também
  precisa de OAuth externo para o `/admin`.
- **Vercel** — simples, mas o plano Hobby é só para uso não comercial.

Em qualquer deles, o formulário de candidaturas continua a funcionar (é externo).
