# cv-formateur — versions ciblées du CV

Quatre CV dédiés d'**Amor El hamrouni**, un par type d'établissement, dérivés du
[CV formateur général](https://github.com/Amoradvisory/CV_Formateur_Adultes_Polyvalent)
(qui garde son sélecteur adaptatif et reste inchangé).

| Version | URL |
|---|---|
| Promotion sociale | https://amoradvisory.github.io/cv-formateur/promotion-sociale/ |
| Insertion & reconversion | https://amoradvisory.github.io/cv-formateur/insertion/ |
| Formation continue & entreprise | https://amoradvisory.github.io/cv-formateur/formation-continue/ |
| Alternance & apprentissage (IFAPME/EFP) | https://amoradvisory.github.io/cv-formateur/alternance/ |

La racine (`index.html`) est une page d'aiguillage sobre, marquée `noindex`.

## Ce qui change entre les versions

- Titre, métadonnées, accroche et **pitch intégré** (plus de sélecteur : le recruteur atterrit directement sur son CV).
- FAQ adaptée (première question = l'objection propre à chaque secteur).
- Vocabulaire du secteur : étudiants / stagiaires / équipes / apprenants.
- **Coordonnées rappelées dans la FAQ** (téléphone et email cliquables) et dans l'encadré de synthèse.
- Sujet des emails pré-rempli différent par version (pour savoir quel CV a déclenché le contact).
- QR code, PDF et vCard propres à chaque version.

Le contenu factuel (parcours, titres, domaines) est **identique** au CV général : aucune expérience inventée.

## Build

Les 4 pages sont générées depuis `../CV_Formateur_Adultes_Polyvalent/index.html` :

```
node build.js
```

Chaque remplacement est vérifié : si le CV général change, le build échoue plutôt que de
produire une page incomplète. Après un build : régénérer les PDF (Chrome headless, FAQ dépliée)
et vérifier les QR/vCard si les URL ont changé.
