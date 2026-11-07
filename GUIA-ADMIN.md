# GUIA DA ADMINISTRAÇÃO — para a Andreza

Este guia explica como publicar artigos e onde ver as candidaturas.
Não é preciso saber programar.

---

## 1. Entrar no painel

1. Abre: **`https://entre-dois-mundos.netlify.app/admin/`**
2. Clica **Sign in with GitHub**
3. Autoriza (só na primeira vez)

Ficas com dois menus:

- **Artigos** — criar, editar e apagar artigos
- **Fundadora e contacto** — biografia, citação e email

> Guarda o link do painel nos favoritos. Não é preciso voltar a instalar nada.

---

## 2. Publicar um artigo novo

1. No menu, abre **Artigos** → **Lista de artigos**
2. Clica **Add Artigo** (ou **+**)
3. Preenche:

| Campo | O que escrever | Obrigatório |
|---|---|---|
| **Identificador (URL)** | Nome curto, minúsculas, sem acentos nem espaços. Ex.: `a-minha-primeira-fronteira` | Sim |
| **Data** | Data de publicação | Sim |
| **Categoria (PT)** | Ex.: Identidade, Educação, Cidadania | Não |
| **Category (EN)** | Ex.: Identity, Education, Citizenship | Não |
| **Título (PT)** | Título em português | Sim |
| **Title (EN)** | Título em inglês | Não |
| **Resumo (PT)** | 1–2 frases que aparecem no cartão | Não |
| **Summary (EN)** | Resumo em inglês | Não |
| **Autor/a** | Nome a apresentar | Não |
| **Imagem de capa** | Fotografia ou ilustração (opcional) | Não |
| **Texto (PT)** | O artigo completo | Sim |
| **Text (EN)** | Tradução (se ficar vazio, mostra o português) | Não |

4. Clica **Save** / **Publish** (canto superior direito)
5. Espera ~1 minuto. O artigo aparece no site.

### Regras do identificador

- Só **minúsculas**, números e hífenes: `entre-dois-paises`
- **Sem** acentos, espaços, pontos ou barras
- Tem de ser **único** (não repetir noutro artigo)
- É o endereço do artigo: `…/#artigo/entre-dois-paises`

### Formatação do texto

O editor aceita formatação normal:

- **negrito**, *itálico*
- títulos (`## Título`)
- listas
- citações (`> texto`)
- links e imagens

Podes colar texto do Word; depois confirma os parágrafos e os títulos.

### Imagem de capa

- Formato: JPG ou PNG
- Tamanho recomendado: **1200 × 750 px**
- A imagem é guardada em `assets/artigos/` no GitHub
- Sem imagem, o cartão usa um fundo com um número — também fica bonito

---

## 3. Editar ou apagar um artigo

**Editar:** abre o artigo na lista → altera → **Save**.

**Apagar:** abre o artigo → menu **⋮** / **Delete** → confirma.

> O GitHub guarda o histórico. Se apagares algo por engano, é possível recuperar
> (eu posso ajudar).

---

## 4. Editar a secção Fundadora

1. Menu **Fundadora e contacto**
2. Altera **Biografia** (PT e EN), **Citação** e **Email de contacto**
3. **Save**

A fotografia é um ficheiro separado: para a trocar, é preciso substituir
`assets/fundadora.jpg` no GitHub (posso fazer isso por ti).

---

## 5. Onde ver as candidaturas

Cada candidatura gera **três coisas**:

1. **Email de aviso** para o endereço configurado
2. **Pasta no Google Drive** com o CV e a carta:
   `Entre Dois Mundos — Candidaturas / 2026-11-07 14-32 — Nome da pessoa`
3. **Linha numa folha de cálculo** com todos os campos

Para consultar:

- **Drive:** [drive.google.com](https://drive.google.com) → pasta `Entre Dois Mundos — Candidaturas`
- **Folha:** abre `Entre Dois Mundos — Candidaturas (registo)` no Drive

A pasta é **privada**: só a conta que instalou o Apps Script lhe consegue aceder.

---

## 6. Privacidade — o essencial

- Os documentos **nunca** são publicados no site nem no GitHub.
- Só deves guardar o que precisas para avaliar a candidatura.
- **Candidaturas não selecionadas:** apagar após 12 meses.
- Se alguém pedir para apagar os seus dados, apaga a pasta e a linha da folha e
  responde por email.
- Não partilhes o link da pasta do Drive publicamente.

---

## 7. O que **não** fazer no painel

- Não alterar o campo **Identificador** de um artigo já publicado (quebra o link
  antigo que possa ter sido partilhado).
- Não colar HTML complexo no texto — usa a formatação do editor.
- Não apagar a coleção **Artigos** nem o ficheiro `data/posts.json`.

---

## 8. Se algo falhar

| Problema | O que fazer |
|---|---|
| O painel não abre | Confirma que estás em `/admin/` (com barra no fim) |
| "Sign in" não funciona | Fecha e volta a abrir; confirma que estás ligada à conta GitHub certa |
| Artigo não aparece | Espera 1 min; confirma que clicaste **Save/Publish**; verifica se o `id` não está repetido |
| Imagem não carrega | Confirma que o upload terminou antes de gravar |
| Candidatura não chegou | Verifica o email de aviso; se não houver, contacta o responsável técnico |

---

## 9. Resumo em 4 passos

1. `/admin/` → **Artigos** → **Add Artigo**
2. Escreve título, resumo e texto (PT; EN se quiseres)
3. **Save** → espera 1 minuto
4. Partilha o link do site

É tudo. Boa escrita. ✍️
