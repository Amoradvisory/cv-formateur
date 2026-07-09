// Génère les 4 CV ciblés à partir du CV général (CV_Formateur_Adultes_Polyvalent).
// Chaque remplacement est vérifié : si le texte source a changé, le build échoue
// au lieu de produire une page incomplète. Relancer après toute modif du général.
"use strict";
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..", "CV_Formateur_Adultes_Polyvalent", "index.html");
const GENERAL_URL = "https://amoradvisory.github.io/CV_Formateur_Adultes_Polyvalent/";

// --- Blocs du fichier source (doivent correspondre exactement) ---

const SRC_COMMENT = `<!-- CV Formateur Adultes Polyvalent — V2 — 2026-07-08 — refonte "conversion recruteur" : pitch adaptatif par type de structure, livrables concrets, méthode interactive en 5 étapes, FAQ recruteur, vCard, QR print. Contenu factuel inchangé : aucune expérience inventée. Sans dates (choix délibéré). -->`;

const SRC_TITLE = `<title>Amor El hamrouni — Formateur &amp; enseignant certifié (CAP)</title>`;

const SRC_DESC = `<meta name="description" content="Formateur &amp; enseignant certifié (Certificat d'Aptitudes Pédagogiques — CAP), bachelier en marketing. Pédagogie active, différenciation, évaluation des acquis — pour la promotion sociale, l'insertion socioprofessionnelle et la formation continue. 8 terrains de formation, 7 domaines mobilisables.">`;

const SRC_OG_TITLE = `<meta property="og:title" content="Amor El hamrouni — Formateur &amp; enseignant certifié (CAP)">`;

const SRC_OG_DESC = `<meta property="og:description" content="Faire apprendre est un métier. Pédagogie active, différenciation, évaluation des acquis — promotion sociale, insertion, formation continue. CAP + Bachelier en Marketing.">`;

const SRC_JOBTITLE = `"jobTitle": "Formateur et enseignant certifié",`;

const SRC_KICKER = `<p class="kicker">Curriculum vitæ — Formation d'adultes &amp; transmission</p>`;

const SRC_ROLE = `<p class="role">Formateur &amp; enseignant certifié — CAP · Bachelier en marketing</p>`;

const SRC_SUBJECT = `Contact%20-%20CV%20Formateur%20Amor%20El%20hamrouni`;

const SRC_SELECTOR = `        <div class="selector" id="selector">
          <p class="selector-label" id="seg-label">Vous recrutez pour&nbsp;:</p>
          <div class="seg" role="group" aria-labelledby="seg-label">
            <button type="button" data-p="promo" aria-pressed="false">Promotion sociale</button>
            <button type="button" data-p="insertion" aria-pressed="false">Insertion · reconversion</button>
            <button type="button" data-p="continue" aria-pressed="false">Formation continue</button>
          </div>
          <div class="pitch" id="pitch" aria-live="polite">
            <p><strong>Sélectionnez votre structure ci-dessus</strong> — ce paragraphe s'adaptera à votre réalité. Par défaut&nbsp;: je forme des publics variés avec une même exigence, faire de chaque séance un progrès mesurable.</p>
          </div>
          <p class="selector-meta">Ce texte s'adapte à son lecteur. La différenciation pédagogique commence ici.</p>
        </div>`;

const SRC_SELECTOR_JS = `(function(){
  // Pitch adaptatif selon le type de structure qui recrute.
  var pitches = {
    promo: "<p><strong>Promotion sociale.</strong> Vos apprenants concilient travail, famille et cours du soir : chaque heure doit valoir le déplacement. Ma réponse : positionnement initial dès l'entrée, séances utiles dès le premier soir, évaluation des acquis conforme à vos dossiers pédagogiques — et un formateur habitué aux horaires décalés.</p>",
    insertion: "<p><strong>Insertion &amp; reconversion.</strong> Un public en reconversion a besoin de reprendre confiance autant que d'apprendre. Ma pratique du raccrochage (CEFA, enseignement spécialisé) : remettre en mouvement par le concret, valoriser chaque progrès, viser l'emploi — pas seulement l'attestation.</p>",
    continue: "<p><strong>Formation continue &amp; entreprise.</strong> Bachelier en marketing et passé par l'entreprise, je parle la langue de vos équipes : objectifs, résultats, temps compté. Des modules courts, actionnables, ancrés dans les situations de travail réelles de vos participants.</p>"
  };
  var box = document.getElementById("pitch");
  document.querySelectorAll(".seg button").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".seg button").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
      b.setAttribute("aria-pressed","true");
      box.classList.remove("swap");
      void box.offsetWidth; // relance l'animation
      box.innerHTML = pitches[b.getAttribute("data-p")];
      box.classList.add("swap");
    });
  });
})();

`;

const SRC_TRANSFER = `      <div class="transfer">
        <h3>Et les adultes en reprise d'études ou en reconversion&nbsp;?</h3>
        <p>Les compétences construites sur ces terrains — <strong>évaluation du niveau de départ, différenciation, ancrage dans la réalité professionnelle, accompagnement individualisé</strong> — sont précisément celles que mobilise la formation d'adultes. Elles ont été forgées dans des contextes exigeants&nbsp;; elles sont <strong>immédiatement transférables</strong> à la promotion sociale, à la formation continue et à l'insertion socioprofessionnelle.</p>
      </div>`;

const SRC_FAQ1 = `        <details class="faq-item">
          <summary>« Vous n'avez encore jamais enseigné en promotion sociale. Pourquoi vous recevoir&nbsp;? »</summary>
          <div class="faq-a"><p>Parce que tout ce que la promotion sociale exige, je le pratique déjà&nbsp;: <strong>positionnement initial, différenciation, évaluation des acquis sur référentiel</strong>, publics qui concilient formation et vie active. Huit terrains différents m'ont appris à devenir opérationnel vite — c'est précisément la compétence qui ne s'improvise pas. Et je ne demande pas d'être cru sur parole&nbsp;: chaque expérience de ce CV est reliée à la compétence qu'elle prouve.</p></div>
        </details>`;

const SRC_DISPO = `        <details class="faq-item">
          <summary>« Quelle est votre disponibilité&nbsp;? »</summary>
          <div class="faq-a"><p>Contactez-moi&nbsp;: je réponds rapidement, généralement le jour même. Habitué au travail multi-établissements et aux horaires variés, <strong>je m'adapte à votre organisation, y compris en horaire décalé</strong> — une réalité que je connais et que j'accepte volontiers.</p></div>
        </details>`;

const SRC_OUTRO_H2 = `<h2>Parlons de vos apprenants</h2>`;

const SRC_FOOTER_URL = `amoradvisory.github.io/CV_Formateur_Adultes_Polyvalent`;

// Cartes "publics" (pour le réordonnancement de la version insertion)
const CARD_ALTERNANCE = `        <article class="card">
          <h3>Jeunes adultes en alternance</h3>
          <p class="where">CEFA de Tournai</p>
          <p>Apprenants déjà engagés dans le monde du travail&nbsp;: formation articulée sur leur réalité professionnelle, en lien direct avec les attentes des employeurs.</p>
        </article>`;
const CARD_REMOB = `        <article class="card">
          <h3>Publics en remobilisation</h3>
          <p class="where">CEFA · filières qualifiantes</p>
          <p>Redonner du sens par le concret et l'utilité immédiate des apprentissages — la même mécanique qui fait réussir une reconversion.</p>
        </article>`;

// --- Gabarits communs ---

function dispoBlock(dispoStrong) {
  return `        <details class="faq-item">
          <summary>« Quelle est votre disponibilité&nbsp;? »</summary>
          <div class="faq-a"><p>Appelez-moi au <a href="tel:+32487898793">0487&nbsp;89&nbsp;87&nbsp;93</a> ou écrivez-moi à <a href="mailto:AmorElhamrouni@gmail.com">AmorElhamrouni@gmail.com</a> — je réponds rapidement, généralement le jour même. Habitué au travail multi-établissements et aux horaires variés, <strong>${dispoStrong}</strong>.</p></div>
        </details>`;
}

function pitchBlock(pitchHtml) {
  return `        <div class="pitch" style="margin-top:26px">
          ${pitchHtml}
        </div>`;
}

function transferBlock(h3, p) {
  return `      <div class="transfer">
        <h3>${h3}</h3>
        <p>${p}</p>
      </div>`;
}

function faq1Block(summary, answer) {
  return `        <details class="faq-item">
          <summary>${summary}</summary>
          <div class="faq-a">${answer}</div>
        </details>`;
}

// --- Les 4 versions ---

const VERSIONS = [
  {
    slug: "promotion-sociale",
    comment: `<!-- CV dédié PROMOTION SOCIALE — dérivé du CV formateur général (V2, 2026-07-08) via build.js. Contenu factuel identique. Sans dates (choix délibéré). -->`,
    title: `<title>Amor El hamrouni — Chargé de cours &amp; formateur (CAP) · Promotion sociale</title>`,
    desc: `<meta name="description" content="Chargé de cours et formateur certifié (Certificat d'Aptitudes Pédagogiques — CAP), bachelier en marketing — pour l'enseignement de promotion sociale : commerce, marketing, gestion, économie, outils numériques. Disponible en horaire décalé.">`,
    ogTitle: `<meta property="og:title" content="Amor El hamrouni — Chargé de cours &amp; formateur (CAP) · Promotion sociale">`,
    ogDesc: `<meta property="og:description" content="Chaque heure de cours doit valoir le déplacement. CAP + Bachelier en Marketing — commerce, gestion, économie, outils numériques. Disponible en soirée.">`,
    jobTitle: `"jobTitle": "Chargé de cours et formateur certifié",`,
    kicker: `<p class="kicker">Curriculum vitæ — Enseignement de promotion sociale</p>`,
    role: `<p class="role">Chargé de cours &amp; formateur certifié — CAP · Bachelier en marketing</p>`,
    subject: `Contact%20-%20CV%20Promotion%20sociale%20-%20Amor%20El%20hamrouni`,
    pitch: `<p><strong>Vos étudiants concilient travail, famille et cours du soir&nbsp;:</strong> chaque heure doit valoir le déplacement. Ma réponse&nbsp;: positionnement initial dès l'entrée, séances utiles dès le premier soir, évaluation des acquis conforme à vos dossiers pédagogiques — et un chargé de cours disponible en horaire décalé.</p>`,
    transferH3: `Pourquoi je serai vite opérationnel dans votre établissement`,
    transferP: `Positionnement initial, différenciation, ancrage professionnel, évaluation des acquis sur référentiel&nbsp;: les compétences construites sur ces terrains sont précisément celles qu'exige l'enseignement de promotion sociale — avec des étudiants adultes qui attendent du concret, au bon niveau, dès le premier soir. Parlons-en&nbsp;: <a href="tel:+32487898793">0487&nbsp;89&nbsp;87&nbsp;93</a>.`,
    faq1: null, // la question de base vise déjà la promotion sociale
    dispoStrong: `je suis disponible en soirée et en horaire décalé — la réalité de la promotion sociale, je la connais et je l'accepte volontiers`,
    outroH2: `<h2>Parlons de vos étudiants</h2>`,
    reorderPublics: false
  },
  {
    slug: "insertion",
    comment: `<!-- CV dédié INSERTION / RECONVERSION — dérivé du CV formateur général (V2, 2026-07-08) via build.js. Contenu factuel identique. Sans dates (choix délibéré). -->`,
    title: `<title>Amor El hamrouni — Formateur (CAP) · Insertion &amp; reconversion</title>`,
    desc: `<meta name="description" content="Formateur certifié (Certificat d'Aptitudes Pédagogiques — CAP), bachelier en marketing — pour l'insertion socioprofessionnelle et la reconversion : remobilisation par le concret, différenciation, compétences orientées emploi.">`,
    ogTitle: `<meta property="og:title" content="Amor El hamrouni — Formateur (CAP) · Insertion &amp; reconversion">`,
    ogDesc: `<meta property="og:description" content="Remettre en mouvement par le concret, valoriser chaque progrès, viser l'emploi. CAP + Bachelier en Marketing.">`,
    jobTitle: `"jobTitle": "Formateur certifié",`,
    kicker: `<p class="kicker">Curriculum vitæ — Insertion socioprofessionnelle &amp; reconversion</p>`,
    role: `<p class="role">Formateur certifié — CAP · Bachelier en marketing</p>`,
    subject: `Contact%20-%20CV%20Insertion%20-%20Amor%20El%20hamrouni`,
    pitch: `<p><strong>Un public en reconversion a besoin de reprendre confiance autant que d'apprendre.</strong> C'est le travail que je connais&nbsp;: au CEFA et en enseignement spécialisé, j'ai remis en mouvement des apprenants que l'école avait découragés — par le concret, la valorisation de chaque progrès et un cap clair&nbsp;: l'emploi.</p>`,
    transferH3: `Pourquoi ces compétences comptent pour vos stagiaires`,
    transferP: `Raccrochage, remobilisation, différenciation, ancrage dans la réalité professionnelle&nbsp;: c'est la mécanique exacte d'une reconversion réussie. Ces compétences ont été forgées auprès de publics exigeants&nbsp;; elles sont prêtes à servir vos stagiaires dès la première séance. Parlons-en&nbsp;: <a href="tel:+32487898793">0487&nbsp;89&nbsp;87&nbsp;93</a>.`,
    faq1: {
      summary: `« Vous venez de l'école. L'insertion, c'est un autre monde. »`,
      answer: `<p>Moins qu'on ne le croit — le cœur est le même. Au CEFA et en enseignement spécialisé, mon travail était déjà celui de l'insertion&nbsp;: <strong>raccrocher des personnes que l'école avait découragées, reconstruire la confiance, redonner du sens par le concret et viser l'emploi</strong>. Ce qui change, c'est le cadre&nbsp;; la relation de formation, elle, je la maîtrise. Et chaque expérience de ce CV est reliée à la compétence qu'elle prouve.</p>`
    },
    dispoStrong: `je m'adapte à votre organisation et à vos horaires, y compris en horaire décalé`,
    outroH2: `<h2>Parlons de vos stagiaires</h2>`,
    reorderPublics: true
  },
  {
    slug: "formation-continue",
    comment: `<!-- CV dédié FORMATION CONTINUE / ENTREPRISE — dérivé du CV formateur général (V2, 2026-07-08) via build.js. Contenu factuel identique. Sans dates (choix délibéré). -->`,
    title: `<title>Amor El hamrouni — Formateur (CAP) · Formation continue &amp; entreprise</title>`,
    desc: `<meta name="description" content="Formateur certifié (Certificat d'Aptitudes Pédagogiques — CAP), bachelier en marketing — modules courts et actionnables pour vos équipes : vente, relation client, communication, gestion. Ancrés dans les situations de travail réelles.">`,
    ogTitle: `<meta property="og:title" content="Amor El hamrouni — Formateur (CAP) · Formation continue &amp; entreprise">`,
    ogDesc: `<meta property="og:description" content="Des modules courts, actionnables, ancrés dans les situations de travail réelles. CAP + Bachelier en Marketing.">`,
    jobTitle: `"jobTitle": "Formateur certifié",`,
    kicker: `<p class="kicker">Curriculum vitæ — Formation continue &amp; entreprise</p>`,
    role: `<p class="role">Formateur certifié — CAP · Bachelier en marketing</p>`,
    subject: `Contact%20-%20CV%20Formation%20continue%20-%20Amor%20El%20hamrouni`,
    pitch: `<p><strong>Vos participants n'ont pas de temps à perdre.</strong> Bachelier en marketing et passé par l'entreprise, je parle leur langue&nbsp;: objectifs, résultats, temps compté. Mes modules sont courts, actionnables, ancrés dans leurs situations de travail réelles — ce qu'on apprend le matin sert l'après-midi.</p>`,
    transferH3: `Pourquoi un pédagogue certifié pour vos équipes`,
    transferP: `Un expert qui improvise une formation fait perdre du temps à tout le monde. Un pédagogue certifié construit&nbsp;: objectifs clairs, situations d'entraînement réalistes, évaluation de ce qui est réellement acquis. Ajoutez la culture d'entreprise d'un bachelier en marketing, et la formation devient un investissement mesurable. Parlons-en&nbsp;: <a href="tel:+32487898793">0487&nbsp;89&nbsp;87&nbsp;93</a>.`,
    faq1: {
      summary: `« Pourquoi un enseignant pour former nos équipes&nbsp;? »`,
      answer: `<p>Parce que savoir faire et savoir faire apprendre sont deux métiers différents. Le CAP garantit le second&nbsp;: <strong>concevoir un module, animer un groupe, évaluer les acquis</strong> — pas seulement présenter des slides. Et mon bachelier en marketing fait le pont avec votre réalité&nbsp;: je construis des formations orientées objectifs, pensées pour des professionnels dont le temps coûte.</p>`
    },
    dispoStrong: `je m'adapte à vos contraintes de planning — sur site, en journée ou en horaire décalé`,
    outroH2: `<h2>Parlons de vos équipes</h2>`,
    reorderPublics: false
  },
  {
    slug: "alternance",
    comment: `<!-- CV dédié ALTERNANCE / APPRENTISSAGE (IFAPME, EFP…) — dérivé du CV formateur général (V2, 2026-07-08) via build.js. Contenu factuel identique. Sans dates (choix délibéré). -->`,
    title: `<title>Amor El hamrouni — Formateur (CAP) · Alternance &amp; apprentissage</title>`,
    desc: `<meta name="description" content="Formateur certifié (Certificat d'Aptitudes Pédagogiques — CAP), bachelier en marketing, expérience directe de l'alternance (CEFA) : cours articulés sur l'entreprise, compétences métier, lien employeurs. Vente, commerce, gestion.">`,
    ogTitle: `<meta property="og:title" content="Amor El hamrouni — Formateur (CAP) · Alternance &amp; apprentissage">`,
    ogDesc: `<meta property="og:description" content="L'alternance, je la pratique déjà : cours articulés sur l'entreprise, compétences métier, lien employeurs. CAP + Bachelier en Marketing.">`,
    jobTitle: `"jobTitle": "Formateur certifié",`,
    kicker: `<p class="kicker">Curriculum vitæ — Alternance &amp; apprentissage</p>`,
    role: `<p class="role">Formateur certifié — CAP · Bachelier en marketing</p>`,
    subject: `Contact%20-%20CV%20Alternance%20-%20Amor%20El%20hamrouni`,
    pitch: `<p><strong>L'alternance, je la pratique déjà.</strong> Au CEFA de Tournai, mes apprenants partageaient leur semaine entre cours et entreprise&nbsp;: séances articulées sur leur réalité de terrain, compétences métier alignées sur les attentes des patrons, remobilisation par le sens. C'est exactement la mécanique de l'apprentissage adulte.</p>`,
    transferH3: `Du CEFA à la formation en alternance des adultes`,
    transferP: `Ici, pas de transfert à démontrer&nbsp;: <strong>l'articulation cours-entreprise est déjà mon terrain</strong>. Ce que j'y ajoute pour un public adulte&nbsp;: le positionnement initial, la différenciation et une culture d'entreprise réelle (bachelier en marketing) qui rend chaque séance crédible aux yeux d'apprenants qui, eux, sont déjà au travail. Parlons-en&nbsp;: <a href="tel:+32487898793">0487&nbsp;89&nbsp;87&nbsp;93</a>.`,
    faq1: {
      summary: `« Connaissez-vous vraiment la formation en alternance&nbsp;? »`,
      answer: `<p>Oui — de l'intérieur. Au CEFA de Tournai, j'ai formé en logistique et en vente des apprenants qui partageaient leur semaine entre cours et entreprise&nbsp;: <strong>séances construites sur leurs situations de travail, compétences métier en lien direct avec les attentes des employeurs</strong>, et le travail de remobilisation propre à l'alternance. C'est l'expérience la plus proche qui existe de la formation d'apprentissage pour adultes.</p>`
    },
    dispoStrong: `je m'adapte à votre organisation, y compris en horaire décalé`,
    outroH2: `<h2>Parlons de vos apprenants en alternance</h2>`,
    reorderPublics: false
  }
];

// --- Build ---

function replaceOnce(html, find, rep, slug, label) {
  if (!html.includes(find)) throw new Error(`[${slug}] bloc introuvable (${label})`);
  return html.split(find).join(rep);
}

const base = fs.readFileSync(BASE, "utf8");
let ok = 0;

for (const v of VERSIONS) {
  const url = `https://amoradvisory.github.io/cv-formateur/${v.slug}/`;
  let html = base;
  html = replaceOnce(html, SRC_COMMENT, v.comment, v.slug, "commentaire");
  html = replaceOnce(html, SRC_TITLE, v.title, v.slug, "title");
  html = replaceOnce(html, SRC_DESC, v.desc, v.slug, "meta description");
  html = replaceOnce(html, SRC_OG_TITLE, v.ogTitle, v.slug, "og:title");
  html = replaceOnce(html, SRC_OG_DESC, v.ogDesc, v.slug, "og:description");
  html = replaceOnce(html, GENERAL_URL, url, v.slug, "URL canonique/og/JSON-LD");
  html = replaceOnce(html, SRC_JOBTITLE, v.jobTitle, v.slug, "jobTitle");
  html = replaceOnce(html, SRC_KICKER, v.kicker, v.slug, "kicker");
  html = replaceOnce(html, SRC_ROLE, v.role, v.slug, "role");
  html = replaceOnce(html, SRC_SUBJECT, v.subject, v.slug, "sujet mailto");
  html = replaceOnce(html, SRC_SELECTOR, pitchBlock(v.pitch), v.slug, "sélecteur → pitch statique");
  html = replaceOnce(html, SRC_SELECTOR_JS, "", v.slug, "JS du sélecteur");
  html = replaceOnce(html, SRC_TRANSFER, transferBlock(v.transferH3, v.transferP), v.slug, "encadré transfert");
  if (v.faq1) html = replaceOnce(html, SRC_FAQ1, faq1Block(v.faq1.summary, v.faq1.answer), v.slug, "FAQ question 1");
  html = replaceOnce(html, SRC_DISPO, dispoBlock(v.dispoStrong), v.slug, "FAQ disponibilité");
  html = replaceOnce(html, SRC_OUTRO_H2, v.outroH2, v.slug, "titre outro");
  html = replaceOnce(html, SRC_FOOTER_URL, `amoradvisory.github.io/cv-formateur/${v.slug}`, v.slug, "URL pied de page");
  if (v.reorderPublics) {
    html = replaceOnce(html, CARD_ALTERNANCE, "%%TMP_CARD%%", v.slug, "carte alternance");
    html = replaceOnce(html, CARD_REMOB, CARD_ALTERNANCE, v.slug, "carte remobilisation");
    html = replaceOnce(html, "%%TMP_CARD%%", CARD_REMOB, v.slug, "échange des cartes");
  }
  // Garde-fous : plus aucune trace du sélecteur ni de l'ancienne URL.
  if (html.includes("selector") && html.includes('class="seg"')) throw new Error(`[${v.slug}] sélecteur résiduel`);
  if (html.includes("CV_Formateur_Adultes_Polyvalent")) throw new Error(`[${v.slug}] URL générale résiduelle`);
  const out = path.join(__dirname, v.slug, "index.html");
  fs.writeFileSync(out, html, "utf8");
  console.log(`OK ${v.slug} (${(html.length / 1024).toFixed(1)} Ko)`);
  ok++;
}
console.log(`${ok}/${VERSIONS.length} versions générées.`);
