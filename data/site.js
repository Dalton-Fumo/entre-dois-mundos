/* ============================================================
   CONFIGURAÇÃO DO SITE + TEXTOS (PT / EN)
   ------------------------------------------------------------
   Este é o único ficheiro que precisas de editar para mudar
   contactos, ligações ou textos fixos do site.
   ============================================================ */

const SITE = {
  project: "Uma Voz Entre Dois Mundos",
  author: "Andreza Caldeira",
  bookTitle: "Assinado: uma experiência vivida",

  /* Email público (rodapé, privacidade, mensagens de erro) */
  contactEmail: "andreza.caldeira12@gmail.com",

  /* ------------------------------------------------------------
     CANDIDATURAS
     Cola aqui o URL do Google Apps Script (termina em /exec).
     Passo a passo: apps-script/COMO-INSTALAR.md
     Enquanto começar por "REPLACE", o formulário avisa que
     ainda não está ligado e não envia nada.
     ------------------------------------------------------------ */
  applyEndpoint: "https://script.google.com/macros/s/AKfycbzkhv0eRRD2qWG7wj3JkAG_cM0ZdWpbN_aPAdaAH5Eml_3V9F_9KJoFckv0xSb7wZsDjA/exec",

  /* Limites dos anexos (têm de coincidir com o Code.gs) */
  maxFileMB: 5,
  allowedExtensions: ["pdf", "doc", "docx"],

  /* COMENTÁRIOS — guardados na base de dados da Netlify (/api/comments) */
  commentsEnabled: true,

};

/* ============================================================
   TEXTOS DO SITE
   ============================================================ */

const I18N = {
  pt: {
    meta_title: "Uma Voz Entre Dois Mundos — Andreza Caldeira",
    meta_desc:
      "Plataforma internacional de participação cívica juvenil. Um espaço onde jovens com experiências entre culturas transformam vivências em ideias, reflexão e participação.",

    brand_line1: "UMA VOZ ENTRE",
    brand_line2: "DOIS MUNDOS",

    nav_project: "O projeto",
    nav_articles: "Artigos",
    nav_apply: "Candidaturas",
    nav_founder: "Fundadora",
    lang_toggle_label: "— Mudar idioma / Switch language",

    hero_eyebrow: "Plataforma internacional de participação cívica juvenil",
    hero_line1: "UMA VOZ ENTRE",
    hero_line2: "DOIS MUNDOS",
    hero_lead:
      "A distância geográfica não significa distância cívica. Um espaço onde jovens transformam experiências entre culturas em ideias, reflexão e participação.",
    hero_btn_apply: "Quero participar",
    hero_btn_articles: "Explorar artigos",

    project_eyebrow: "O manifesto",
    project_title: "Duas pertenças.<br>Uma voz sem fronteiras.",
    project_lead:
      "Uma iniciativa editorial e de participação cívica dirigida a jovens com dupla nacionalidade, experiências migratórias ou vivências multiculturais. Queremos reunir perspetivas sobre os países de onde vimos, os lugares onde vivemos e o futuro que podemos construir em conjunto.",
    metric1_title: "Participação",
    metric1_desc: "Dar espaço a novas vozes no debate público.",
    metric2_title: "Conhecimento",
    metric2_desc:
      "Promover artigos sobre educação, cidadania, cultura, economia e ambiente.",
    metric3_title: "Ligação",
    metric3_desc: "Criar pontes entre jovens, países e gerações.",

    articles_eyebrow: "Revista digital",
    articles_title: "Ideias que atravessam fronteiras.",
    articles_lead:
      "Explora artigos e participa na conversa. Cada texto nasce de uma voz entre culturas — e cada leitura é um convite a pensar de outro lugar.",
    filter_all: "Todos",
    read_article: "Ler artigo",
    article_by: "Por",
    articles_empty: "Ainda não há artigos publicados. Volta em breve.",
    articles_error:
      "Não foi possível carregar os artigos. Se estiveres a abrir o site diretamente do computador, usa o servidor local incluído (start.ps1) ou vê o site publicado.",

    apply_eyebrow: "Faz parte da primeira edição",
    apply_title: "A tua voz também conta.",
    apply_lead:
      "Vives entre países ou culturas? Tens vontade de escrever sobre os desafios e as oportunidades das sociedades às quais pertences? Este espaço foi pensado para ti.",
    apply_pill1: "Jovens adultos",
    apply_pill2: "Escrita e opinião",
    apply_pill3: "Perspetivas internacionais",
    apply_point1: "Candidatura gratuita e confidencial.",
    apply_point2: "Anexa o teu currículo e/ou carta de motivação.",
    apply_point3:
      "Os textos selecionados são publicados com o teu consentimento.",
    apply_deadline: "Candidaturas abertas para a primeira edição.",

    form_kicker: "Manifestação de interesse",
    form_intro: "Preenche os campos abaixo. Leva menos de 5 minutos.",
    f_name: "Nome completo *",
    f_email: "Email *",
    f_phone: "Telefone (opcional)",
    f_linkedin: "LinkedIn (opcional)",
    f_country_from: "País de origem / ligação cultural *",
    f_country_live: "País onde vives *",
    f_topic: "Tema de interesse *",
    f_topic_placeholder: "Seleciona uma área",
    topic_education: "Educação",
    topic_citizenship: "Cidadania e direitos",
    topic_identity: "Identidade e diáspora",
    topic_environment: "Ambiente e sustentabilidade",
    topic_economy: "Economia e inovação",
    f_message: "Porque gostarias de participar? (opcional)",
    f_message_ph: "Conta-nos brevemente a tua motivação…",
    f_cv: "Currículo (PDF, DOC, DOCX)",
    f_cv_choose: "Anexar currículo",
    f_letter: "Carta de motivação (opcional)",
    f_letter_choose: "Anexar carta",
    f_no_file: "Nenhum ficheiro selecionado",
    f_files_hint:
      "Anexa o currículo e/ou a carta de motivação. Formatos PDF, DOC ou DOCX, até 5 MB por ficheiro.",
    f_consent:
      'Autorizo o tratamento dos meus dados e documentos para avaliação desta candidatura, nos termos da <a href="#" data-privacy>Política de Privacidade</a>. *',
    f_submit: "Enviar candidatura",
    f_privacy_note:
      'Os teus dados são recebidos de forma confidencial e usados apenas para este projeto. Consulta a <a href="#" data-privacy>Política de Privacidade</a>.',

    f_sending: "A enviar…",
    f_success:
      "Candidatura enviada. Obrigado pela tua voz! Vamos entrar em contacto por email.",
    f_error:
      "Não foi possível enviar a candidatura. Verifica a ligação e tenta novamente.",
    f_required: "Preenche os campos obrigatórios assinalados.",
    f_need_docs: "Anexa o currículo e/ou a carta de motivação.",
    f_bad_type: "Formato não aceite. Usa PDF, DOC ou DOCX.",
    f_too_big: "O ficheiro é demasiado grande (máximo 5 MB).",
    f_endpoint_missing:
      "O formulário ainda não está ligado ao serviço de candidaturas. (Ver apps-script/COMO-INSTALAR.md.)",
    f_consent_required: "É necessário aceitar a Política de Privacidade.",

    founder_eyebrow: "A origem da iniciativa",
    founder_title: "A voz por detrás do projeto.",
    founder_caption: "Andreza Caldeira · Fundadora",
    founder_bio:
      '<p><b>Andreza Caldeira</b> é jurista, autora e colunista luso-moçambicana. O seu percurso entre Portugal e Moçambique, a escrita e a participação cívica inspiraram a criação de um espaço onde outras vozes possam ser ouvidas.</p><p>É autora do livro <em>«Assinado: uma experiência vivida»</em>, um testemunho na primeira pessoa sobre crescer entre dois países — e a vontade de transformar essa experiência em pontes para outros jovens.</p>',
    founder_quote:
      "«Não quero ser apenas uma voz entre dois mundos. Quero abrir espaço para que outras vozes também sejam ouvidas.»",
    founder_role: "Autora de «Assinado: uma experiência vivida»",

    footer_tagline:
      "Um projeto de Andreza Caldeira · «Assinado: uma experiência vivida»",
    footer_contact_label: "Contacto",
    footer_legal_label: "Informação",
    footer_privacy: "Política de Privacidade",
    footer_admin: "Área de administração",
    footer_rights:
      "© 2026 Uma Voz Entre Dois Mundos. Todos os direitos reservados.",
    footer_credit: "Feito entre dois mundos.",

    comments_title: "Comentários",
    comments_sub: "Partilha a tua reflexão sobre este artigo.",
    comments_empty: "Ainda não há comentários. Sê a primeira pessoa a comentar.",
    comments_name: "Nome",
    comments_body: "Comentário",
    comments_submit: "Publicar comentário",
    comments_sending: "A publicar…",
    comments_ok: "Obrigado! O teu comentário foi publicado.",
    comments_err: "Não foi possível publicar o comentário. Tenta novamente.",
    comments_err_load: "Não foi possível carregar os comentários.",
    comments_err_name: "Indica o teu nome (2 a 60 caracteres).",
    comments_err_body: "Escreve um comentário (2 a 2000 caracteres).",
    comments_err_dup: "Este comentário já foi publicado.",

    privacy_kicker: "Informação legal",
    privacy_title: "Política de Privacidade",
    privacy_body: `
      <p>Esta política explica que dados recolhemos através do formulário de candidatura, para que servem e como são guardados.</p>
      <h3>1. Responsável pelo tratamento</h3>
      <p>O projeto <strong>Uma Voz Entre Dois Mundos</strong>, de Andreza Caldeira. Para qualquer questão sobre os teus dados, contacta <a href="mailto:geral@entre-dois-mundos.com">geral@entre-dois-mundos.com</a>.</p>
      <h3>2. Que dados recolhemos</h3>
      <ul>
        <li>Nome, email, telefone e LinkedIn (opcionais);</li>
        <li>País de origem e país onde vives;</li>
        <li>Tema de interesse e mensagem de motivação;</li>
        <li>Currículo e/ou carta de motivação (ficheiros que anexas).</li>
      </ul>
      <h3>3. Para que usamos os dados</h3>
      <p>Exclusivamente para avaliar a tua candidatura, selecionar participantes e comunicar contigo sobre o projeto. Os dados não são vendidos nem usados para publicidade.</p>
      <h3>4. Base legal</h3>
      <p>O teu <strong>consentimento</strong>, prestado no momento em que envias o formulário. Podes retirá-lo a qualquer momento por email.</p>
      <h3>5. Onde são guardados</h3>
      <p>As candidaturas são recebidas através de um formulário próprio deste site e guardadas numa pasta privada do Google Drive e numa folha de cálculo associada. O acesso é restrito à responsável do projeto. O site é alojado na Netlify e o código é guardado no GitHub — nenhum documento de candidatura é publicado nesses serviços.</p>
      <h3>6. Durante quanto tempo</h3>
      <p>As candidaturas não selecionadas são eliminadas no prazo máximo de <strong>12 meses</strong> após a receção. As candidaturas selecionadas são conservadas enquanto durar a colaboração.</p>
      <h3>7. Os teus direitos</h3>
      <p>Podes pedir acesso, correção, eliminação ou portabilidade dos teus dados, bem como opor-te ao tratamento, escrevendo para <a href="mailto:geral@entre-dois-mundos.com">geral@entre-dois-mundos.com</a>. Tens também o direito de apresentar reclamação à autoridade de proteção de dados do teu país.</p>
      <h3>8. Cookies</h3>
      <p>Este site não usa cookies de publicidade ou de rastreio. Guardamos apenas a tua preferência de idioma (PT/EN) no armazenamento local do navegador.</p>
      <h3>9. Alterações</h3>
      <p>Esta política pode ser atualizada. A data da última revisão aparece no final da página do site.</p>
    `,
  },

  en: {
    meta_title: "A Voice Between Two Worlds — Andreza Caldeira",
    meta_desc:
      "An international platform for youth civic participation. A space where young people with cross-cultural experiences turn lived experience into ideas, reflection and participation.",

    brand_line1: "A VOICE BETWEEN",
    brand_line2: "TWO WORLDS",

    nav_project: "The project",
    nav_articles: "Articles",
    nav_apply: "Apply",
    nav_founder: "Founder",
    lang_toggle_label: "— Switch language / Mudar idioma",

    hero_eyebrow: "An international platform for youth civic participation",
    hero_line1: "A VOICE BETWEEN",
    hero_line2: "TWO WORLDS",
    hero_lead:
      "Geographic distance does not mean civic distance. A space where young people turn cross-cultural experience into ideas, reflection and participation.",
    hero_btn_apply: "Join us",
    hero_btn_articles: "Explore articles",

    project_eyebrow: "The manifesto",
    project_title: "Two belongings.<br>A voice without borders.",
    project_lead:
      "An editorial and civic-participation initiative for young people with dual nationality, migration experience or multicultural lives. We bring together perspectives on the countries we come from, the places we live in, and the future we can build together.",
    metric1_title: "Participation",
    metric1_desc: "Making room for new voices in public debate.",
    metric2_title: "Knowledge",
    metric2_desc:
      "Publishing articles on education, citizenship, culture, economy and the environment.",
    metric3_title: "Connection",
    metric3_desc: "Building bridges between young people, countries and generations.",

    articles_eyebrow: "Digital magazine",
    articles_title: "Ideas that cross borders.",
    articles_lead:
      "Read the articles and join the conversation. Every text begins with a voice between cultures — and every reading is an invitation to think from somewhere else.",
    filter_all: "All",
    read_article: "Read article",
    article_by: "By",
    articles_empty: "No articles published yet. Check back soon.",
    articles_error:
      "The articles could not be loaded. If you are opening the site from your computer, use the included local server (start.ps1) or view the published site.",

    apply_eyebrow: "Be part of the first edition",
    apply_title: "Your voice matters too.",
    apply_lead:
      "Do you live between countries or cultures? Do you want to write about the challenges and opportunities of the societies you belong to? This space was made for you.",
    apply_pill1: "Young adults",
    apply_pill2: "Writing and opinion",
    apply_pill3: "International perspectives",
    apply_point1: "Free and confidential application.",
    apply_point2: "Attach your CV and/or motivation letter.",
    apply_point3:
      "Selected texts are published with your consent.",
    apply_deadline: "Applications open for the first edition.",

    form_kicker: "Expression of interest",
    form_intro: "Fill in the fields below. It takes less than 5 minutes.",
    f_name: "Full name *",
    f_email: "Email *",
    f_phone: "Phone (optional)",
    f_linkedin: "LinkedIn (optional)",
    f_country_from: "Country of origin / cultural link *",
    f_country_live: "Country you live in *",
    f_topic: "Topic of interest *",
    f_topic_placeholder: "Select an area",
    topic_education: "Education",
    topic_citizenship: "Citizenship and rights",
    topic_identity: "Identity and diaspora",
    topic_environment: "Environment and sustainability",
    topic_economy: "Economy and innovation",
    f_message: "Why would you like to take part? (optional)",
    f_message_ph: "Tell us briefly what motivates you…",
    f_cv: "CV (PDF, DOC, DOCX)",
    f_cv_choose: "Attach CV",
    f_letter: "Motivation letter (optional)",
    f_letter_choose: "Attach letter",
    f_no_file: "No file selected",
    f_files_hint:
      "Attach your CV and/or motivation letter. PDF, DOC or DOCX, up to 5 MB per file.",
    f_consent:
      'I consent to the processing of my data and documents to assess this application, under the <a href="#" data-privacy>Privacy Policy</a>. *',
    f_submit: "Send application",
    f_privacy_note:
      'Your data is received confidentially and used only for this project. See the <a href="#" data-privacy>Privacy Policy</a>.',

    f_sending: "Sending…",
    f_success:
      "Application sent. Thank you for your voice! We will be in touch by email.",
    f_error:
      "The application could not be sent. Please check your connection and try again.",
    f_required: "Please fill in the required fields.",
    f_need_docs: "Please attach your CV and/or motivation letter.",
    f_bad_type: "Unsupported format. Please use PDF, DOC or DOCX.",
    f_too_big: "The file is too large (maximum 5 MB).",
    f_endpoint_missing:
      "The form is not connected to the application service yet. (See apps-script/COMO-INSTALAR.md.)",
    f_consent_required: "You must accept the Privacy Policy.",

    founder_eyebrow: "Where the initiative began",
    founder_title: "The voice behind the project.",
    founder_caption: "Andreza Caldeira · Founder",
    founder_bio:
      '<p><b>Andreza Caldeira</b> is a Portuguese-Mozambican lawyer, author and columnist. Her path between Portugal and Mozambique, her writing and her civic engagement inspired the creation of a space where other voices can be heard.</p><p>She is the author of <em>«Assinado: uma experiência vivida»</em> (Signed: a lived experience), a first-person account of growing up between two countries — and of the wish to turn that experience into bridges for other young people.</p>',
    founder_quote:
      "“I don't want to be just one voice between two worlds. I want to make room for other voices to be heard as well.”",
    founder_role: "Author of «Assinado: uma experiência vivida»",

    footer_tagline:
      "A project by Andreza Caldeira · «Assinado: uma experiência vivida»",
    footer_contact_label: "Contact",
    footer_legal_label: "Information",
    footer_privacy: "Privacy Policy",
    footer_admin: "Administration area",
    footer_rights: "© 2026 A Voice Between Two Worlds. All rights reserved.",
    footer_credit: "Made between two worlds.",

    comments_title: "Comments",
    comments_sub: "Share your thoughts on this article.",
    comments_empty: "No comments yet. Be the first to comment.",
    comments_name: "Name",
    comments_body: "Comment",
    comments_submit: "Post comment",
    comments_sending: "Posting…",
    comments_ok: "Thank you! Your comment has been posted.",
    comments_err: "Your comment could not be posted. Please try again.",
    comments_err_load: "Comments could not be loaded.",
    comments_err_name: "Please enter your name (2 to 60 characters).",
    comments_err_body: "Please write a comment (2 to 2000 characters).",
    comments_err_dup: "This comment has already been posted.",

    privacy_kicker: "Legal information",
    privacy_title: "Privacy Policy",
    privacy_body: `
      <p>This policy explains what data we collect through the application form, what it is used for and how it is stored.</p>
      <h3>1. Data controller</h3>
      <p>The project <strong>A Voice Between Two Worlds</strong>, by Andreza Caldeira. For any question about your data, contact <a href="mailto:geral@entre-dois-mundos.com">geral@entre-dois-mundos.com</a>.</p>
      <h3>2. What we collect</h3>
      <ul>
        <li>Name, email, phone and LinkedIn (optional);</li>
        <li>Country of origin and country you live in;</li>
        <li>Topic of interest and motivation message;</li>
        <li>CV and/or motivation letter (files you attach).</li>
      </ul>
      <h3>3. Why we use it</h3>
      <p>Solely to assess your application, select participants and communicate with you about the project. Data is never sold or used for advertising.</p>
      <h3>4. Legal basis</h3>
      <p>Your <strong>consent</strong>, given when you submit the form. You may withdraw it at any time by email.</p>
      <h3>5. Where it is stored</h3>
      <p>Applications are received through a form on this site and stored in a private Google Drive folder and an associated spreadsheet. Access is restricted to the project lead. The website is hosted on Netlify and the code is stored on GitHub — no application documents are published there.</p>
      <h3>6. How long we keep it</h3>
      <p>Applications that are not selected are deleted within <strong>12 months</strong> of receipt. Selected applications are kept for the duration of the collaboration.</p>
      <h3>7. Your rights</h3>
      <p>You may request access, correction, deletion or portability of your data, and object to processing, by writing to <a href="mailto:geral@entre-dois-mundos.com">geral@entre-dois-mundos.com</a>. You also have the right to lodge a complaint with your national data protection authority.</p>
      <h3>8. Cookies</h3>
      <p>This site uses no advertising or tracking cookies. We only store your language preference (PT/EN) in your browser's local storage.</p>
      <h3>9. Changes</h3>
      <p>This policy may be updated. The last revision date appears at the bottom of the site.</p>
    `,
  },
};
