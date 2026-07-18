import type { TranslationKey } from './strings.en';

const fr: Partial<Record<TranslationKey, string>> = {
  'app.tagline': 'Créez un programme de musculation aligné sur les recommandations 2026 de l\'ACSM.',
  'app.eyebrow': 'Programmation alignée sur l\'ACSM 2026',
  'app.heading': 'Votre programme',

  'localeSwitcher.label': 'Langue',

  'tour.startButton': 'Faire la visite guidée',
  'tour.next': 'Suivant',
  'tour.previous': 'Précédent',
  'tour.done': 'Terminé',
  'tour.progress': '{{current}} sur {{total}}',
  'tour.intro.title': 'Votre programme',
  'tour.intro.description':
    'Voici votre programme d\'entraînement, construit entièrement dans votre navigateur — rien n\'est envoyé nulle part.',
  'tour.goalSelector.title': 'Objectif d\'entraînement',
  'tour.goalSelector.description':
    'Choisissez force, hypertrophie, puissance ou santé générale. Cela définit les cibles de volume et de fréquence vérifiées plus bas.',
  'tour.sessions.title': 'Séances',
  'tour.sessions.description':
    'Ajoutez des séances et des exercices ici. Chacune contribue aux vérifications de volume ci-dessous.',
  'tour.muscleGroupVolume.title': 'Volume par groupe musculaire',
  'tour.muscleGroupVolume.description':
    'Vos séries hebdomadaires par groupe musculaire, comparées en direct au minimum recommandé pour votre objectif.',
  'tour.compliance.title': 'Conformité au volume recommandé',
  'tour.compliance.description':
    'Un résumé de réussite/échec pour chaque règle de volume de l\'ACSM applicable à votre objectif.',
  'tour.exportImport.title': 'Export / import',
  'tour.exportImport.description':
    'Enregistrez votre programme en fichier JSON, ou rechargez-en un — aucun compte nécessaire.',

  'footer.about': 'À propos',
  'footer.legal': 'Mentions légales',

  'goalSelector.heading': 'Objectif d\'entraînement',
  'goalSelector.label': 'Objectif d\'entraînement',

  'sessions.heading': 'Séances',
  'sessions.empty': 'Aucune séance pour le moment.',
  'sessions.add': 'Ajouter une séance',
  'sessions.defaultName': 'Séance {index}',
  'sessions.marginLabel': 'Marge de temps par séance (minutes)',
  'sessions.totalTime': 'Temps total estimé pour toutes les séances : {duration}',

  'session.nameLabel': 'Nom de la séance',
  'session.deleteAria': 'Supprimer la séance « {name} »',
  'session.delete': 'Supprimer la séance',
  'session.tableCaption': 'Exercices de la séance « {name} »',
  'session.tableExercise': 'Exercice',
  'session.tableSets': 'Séries',
  'session.tableReps': 'Répétitions',
  'session.tableRest': 'Repos (s)',
  'session.tableTime': 'Temps estimé',
  'session.tableActions': 'Actions',
  'session.estimatedTime': 'Temps estimé pour cette séance : {duration} (dont {margin} de marge)',
  'session.muscleSummary': 'Séries par muscle pour cette séance',
  'session.muscleContribution.heading': 'Séries par exercice',
  'session.muscleContribution.exercise': 'Exercice',
  'session.muscleContribution.primaryMuscles': 'Muscle(s) primaire(s)',
  'session.muscleContribution.direct': 'Directes',
  'session.muscleContribution.secondaryMuscles': 'Muscle(s) secondaire(s)',
  'session.muscleContribution.secondary': 'Secondaires (×0,5)',

  'exerciseRow.setsLabel': 'Séries',
  'exerciseRow.repsLabel': 'Répétitions',
  'exerciseRow.restLabel': 'Repos (secondes)',
  'exerciseRow.timeBreakdown': '{duration} (dont {changeTime} de changement/réglage de machine)',
  'exerciseRow.deleteAria': 'Supprimer « {name} »',
  'exerciseRow.delete': 'Supprimer',

  'exercisePicker.label': 'Ajouter un exercice',
  'exercisePicker.placeholder': 'Rechercher un exercice…',
  'exercisePicker.add': 'Ajouter',
  'exercisePicker.noMatch': 'Aucun exercice ne correspond à « {value} ».',

  'muscleVolume.empty': 'Aucun exercice ajouté à cette séance pour le moment.',
  'muscleVolume.caption': 'Séries par muscle pour la séance « {name} »',
  'muscleVolume.muscle': 'Muscle',
  'muscleVolume.primary': 'Séries (primaire)',
  'muscleVolume.secondary': 'Séries (secondaire)',

  'muscleGroupVolume.heading': 'Volume par groupe musculaire',
  'muscleGroupVolume.caption': 'Séries hebdomadaires par groupe musculaire comparées au minimum recommandé',
  'muscleGroupVolume.direct': 'Directes',
  'muscleGroupVolume.secondary': 'Secondaires (×0,5)',
  'muscleGroupVolume.weighted': 'Total pondéré',
  'muscleGroupVolume.minimum': 'Minimum',
  'muscleGroupVolume.status': 'Statut',
  'muscleGroupVolume.note':
    'Une série sur un muscle secondaire/synergiste compte pour une demi-série directe (total pondéré = directes + secondaires × 0,5).',
  'muscleGroupVolume.chart.heading': "Séries par muscle, en un coup d'œil",
  'muscleGroupVolume.chart.legend.actual': 'Séries pondérées',
  'muscleGroupVolume.chart.legend.min': 'Minimum recommandé',
  'muscleGroupVolume.table.summary': 'Détail du volume par groupe musculaire',

  'compliance.heading': 'Conformité au volume recommandé',
  'compliance.noRuleDefined': 'Aucune règle de volume définie pour cet objectif.',
  'compliance.addToEvaluate': 'Ajoutez des séances et des exercices pour évaluer la conformité aux règles de volume.',
  'compliance.summary': '{pass} règle(s) validée(s) sur {total}.',
  'compliance.setsPerExercise.pass': '{label} ({session}) : {sets} série(s), conforme ({min}-{max}).',
  'compliance.setsPerExercise.fail': '{label} ({session}) : {sets} série(s), attendu entre {min} et {max}.',
  'compliance.sessionsPerWeek.pass': '{count} séance(s) programmée(s), conforme (minimum {min}).',
  'compliance.sessionsPerWeek.fail': '{count} séance(s) programmée(s), minimum requis : {min}.',
  'compliance.setsPerMuscleGroup.pass':
    '{muscle} : {primary} série(s) directe(s) + {secondary} série(s) secondaire(s) × 0,5 = {weighted} série(s) pondérée(s), conforme (minimum {min}).',
  'compliance.setsPerMuscleGroup.fail':
    '{muscle} : {primary} série(s) directe(s) + {secondary} série(s) secondaire(s) × 0,5 = {weighted} série(s) pondérée(s), minimum requis : {min}.',

  'exportImport.heading': 'Export / import',
  'exportImport.export': 'Exporter le programme',
  'exportImport.importLabel': 'Importer un programme (JSON)',
  'exportImport.invalidJson': 'Le fichier sélectionné n\'est pas un JSON valide.',
  'exportImport.invalidFile': 'Le fichier importé est invalide :',

  'zodError.invalid_type': 'champ manquant ou type incorrect.',
  'zodError.too_small': 'valeur trop petite ou champ vide.',
  'zodError.too_big': 'valeur trop grande.',
  'zodError.invalid_value': 'valeur non reconnue.',
  'zodError.unrecognized_keys': 'champ(s) inattendu(s).',
  'zodError.default': 'valeur invalide.',

  'programFileError.unknownGoal': 'header.goal.id : objectif inconnu « {id} ».',
  'programFileError.unknownExercise':
    'sessions.{sessionIndex}.exercises.{exerciseIndex}.exerciseId : exercice inconnu « {id} ».',

  'time.minutesOnly': '{minutes} min',
  'time.hoursMinutes': '{hours} h {minutes} min',

  // Static marketing pages (index, about, legal, 404) + shared site chrome.
  'nav.openApp': 'Ouvrir l\'application',
  'nav.backToApp': '← Retour à l\'application',

  'home.eyebrow': 'Programmation alignée sur l\'ACSM 2026',
  'home.title': 'Créez un programme que votre volume supporte vraiment.',
  'home.subtitle':
    'Volumen est un créateur de programme de musculation gratuit qui vérifie vos séries hebdomadaires par groupe musculaire par rapport aux recommandations 2026 de l\'ACSM pour l\'entraînement en résistance — pour savoir si une séance est sous-dosée, dans la cible, ou excessive avant même de mettre les pieds à la salle.',
  'home.cta.primary': 'Créer mon programme',
  'home.cta.secondary': 'En savoir plus',
  'home.privacyNote': 'Aucun compte, aucun serveur, aucun suivi — tout reste dans votre navigateur.',

  'home.preview.heading': 'Volume hebdomadaire · séries par groupe musculaire',
  'home.preview.muscle.chest': 'Pectoraux',
  'home.preview.muscle.back': 'Dos',
  'home.preview.muscle.quads': 'Quadriceps',
  'home.preview.muscle.shoulders': 'Épaules',
  'home.preview.setsUnit': 'séries',
  'home.preview.note': 'Exemple illustratif — pas un programme réel.',

  'home.howItWorks.heading': 'Comment ça marche',
  'home.howItWorks.subtitle': 'Quatre étapes, dans l\'ordre où vous les utiliserez réellement.',
  'home.step1.title': 'Définissez votre objectif',
  'home.step1.body':
    'Force, hypertrophie, puissance ou santé générale — Volumen charge les cibles de volume et de fréquence 2026 de l\'ACSM correspondantes.',
  'home.step2.title': 'Construisez vos séances',
  'home.step2.body':
    'Choisissez des exercices dans une base de plus de 800 mouvements et définissez séries, répétitions et repos par séance.',
  'home.step3.title': 'Vérifiez la conformité',
  'home.step3.body':
    'Les séries par groupe musculaire sont comptabilisées en direct et comparées à la plage recommandée, avec une estimation de la durée de séance à côté.',
  'home.step4.title': 'Exportez et importez',
  'home.step4.body':
    'Tout reste dans le localStorage de votre navigateur. Enregistrez votre programme en fichier JSON, ou rechargez-en un, quand vous voulez.',

  'home.finalCta.heading': 'Prêt à vérifier votre programme ?',
  'home.finalCta.subtitle':
    'Il faut moins de temps pour construire une séance que pour terminer votre série d\'échauffement.',

  'about.heading': 'À propos de Volumen',
  'about.intro':
    'Volumen est une petite application web entièrement côté client pour construire un programme de musculation aligné sur les <a href="https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx">recommandations 2026 de l\'ACSM pour l\'entraînement en résistance</a>. Choisissez un objectif d\'entraînement (force, hypertrophie, puissance, santé générale), construisez vos séances hebdomadaires à partir d\'une base de plus de 800 exercices, et l\'application vérifie vos séries/volume par rapport aux cibles recommandées par groupe musculaire, estime la durée réelle de chaque séance, et vous permet d\'exporter/importer votre programme en JSON. Tout reste dans le <code>localStorage</code> de votre navigateur — pas de serveur, pas de compte, pas de suivi.',

  'about.vibeCoding.heading': '⚠️ Ce projet est une expérience de « vibe coding »',
  'about.vibeCoding.p1':
    'L\'intégralité de ce code — chaque ligne, chaque test, chaque décision de conception — a été écrite en <strong>prompt-ant Claude</strong> (via <a href="https://claude.com/claude-code">Claude Code</a>), pas à la main. Il n\'y avait ni cadre de développement piloté par les specs, ni système de tickets, ni document de conception formel, ni harnais d\'échafaudage d\'aucune sorte. Juste une conversation allers-retours : une demande de fonctionnalité en langage naturel (souvent en français), Claude lisant le code existant, écrivant l\'implémentation, exécutant les tests, et rendant compte. Les bugs étaient décrits comme un utilisateur le ferait (« l\'import ne fonctionne pas ») plutôt que déposés avec un diagnostic de cause racine.',
  'about.vibeCoding.p2':
    'L\'objectif était de voir jusqu\'où le pur prompting conversationnel pouvait porter une application réelle, fonctionnelle et testée — pas de démontrer un processus d\'ingénierie abouti. Considérez l\'application avec ça en tête : c\'est le produit d\'une expérience de codage piloté par l\'IA (« vibe coding »), pas une architecture de référence.',

  'about.howBuilt.heading': 'Comment elle a vraiment été construite',
  'about.howBuilt.step1':
    '<strong>Amorçage</strong> — démarré à partir du template minimal standard d\'Astro avec l\'intégration React ajoutée pour les composants interactifs.',
  'about.howBuilt.step2':
    '<strong>Les données du domaine d\'abord</strong> — deux jeux de données sources ont été ajoutés (voir Sources ci-dessous) et Claude a été chargé de modéliser le domaine : objectifs d\'entraînement, exercices, et la structure programme/séance/exercice.',
  'about.howBuilt.step3':
    '<strong>Boucle centrale, promptée itérativement</strong> — sélection de l\'objectif → édition des séances/exercices → calcul du volume par muscle → vérification de conformité aux règles de l\'ACSM → export/import en JSON, chaque étape ajoutée comme sa propre demande de fonctionnalité.',
  'about.howBuilt.step4':
    '<strong>Passe i18n</strong> — support anglais/français, implémenté comme un petit système de correspondance codé à la main (sans librairie i18n) plus une traduction française partielle et manuelle des noms d\'exercices, avec un repli anglais testé pour tout ce qui n\'est pas traduit.',
  'about.howBuilt.step5':
    '<strong>Estimation du temps de séance</strong> — une demande de fonctionnalité (« montre-moi la durée de chaque séance/exercice, plus un champ de marge de temps ») a été implémentée, puis passée dans une boucle de revue multi-agents au sein de la même conversation : un agent l\'a implémentée, puis trois autres ont tourné en parallèle sur le diff — un relisant le code, un pilotant un vrai navigateur via Playwright pour valider l\'interface, et un re-dérivant indépendamment à la main les calculs d\'estimation de temps.',
  'about.howBuilt.step6':
    '<strong>Corrections de bugs à partir de rapports en langage naturel</strong> — par exemple « la fonction d\'import ne marche pas » a été investiguée depuis zéro plutôt que supposée ; le vrai défaut (un champ silencieusement perdu du schéma JSON exporté) a été trouvé et corrigé, avec des tests de non-régression ajoutés après coup.',
  'about.howBuilt.step7':
    '<strong>Ajustements au feeling</strong> — des prompts ultérieurs ont ajusté le modèle d\'estimation de temps lui-même (hypothèse de tempo, surcoût de changement de matériel) purement sur la base d\'une intuition de ce qui semblait réaliste, pas d\'une étude formelle.',
  'about.howBuilt.step8':
    '<strong>Passe de revue globale du projet</strong> — une boucle dédiée de revue/correction/validation a parcouru l\'ensemble du code : un agent a tout audité depuis zéro et signalé des bugs concrets (par exemple un cas de perte de données silencieuse où un champ numérique non borné pouvait effacer tout le programme stocké au rechargement), un second agent a corrigé chaque constat avec des tests de non-régression, et un troisième a re-piloté indépendamment l\'application corrigée à travers de vrais parcours utilisateur dans un navigateur avant validation finale.',
  'about.howBuilt.testingNote':
    'Les tests, tout du long, reposaient sur Vitest pour la logique métier et Playwright pour les parcours de bout en bout, tous deux pilotés par Claude, avec l\'humain dans la boucle relisant le comportement plutôt que le diff ligne par ligne.',

  'about.stack.heading': 'Stack et crédits',
  'about.stack.item1':
    '<a href="https://astro.build/">Astro</a> — framework de site statique en premier lieu, héberge un unique îlot Preact.',
  'about.stack.item2': '<a href="https://preactjs.com/">Preact</a> — le constructeur de programme interactif.',
  'about.stack.item3':
    '<a href="https://zod.dev/">Zod</a> — validation de schéma pour la forme du programme en localStorage et le format JSON d\'export/import.',
  'about.stack.item4':
    '<a href="https://tailwindcss.com/">Tailwind CSS</a> et <a href="https://daisyui.com/">daisyUI</a> — classes utilitaires et composants thématisés utilisés pour le style.',
  'about.stack.item5': '<a href="https://vitest.dev/">Vitest</a> — tests unitaires pour la logique métier.',
  'about.stack.item6': '<a href="https://playwright.dev/">Playwright</a> — tests de bout en bout dans le navigateur.',
  'about.stack.item7': '<a href="https://www.typescriptlang.org/">TypeScript</a> partout.',
  'about.stack.item8':
    '<a href="https://www.chartjs.org/">Chart.js</a> — le graphique radar des séries par muscle affiché pour l\'objectif hypertrophie.',
  'about.stack.item9':
    '<a href="https://driverjs.com/">driver.js</a> — la visite guidée qui présente l\'interface de l\'application lors d\'une première visite.',
  'about.stack.item10':
    '<a href="https://www.anthropic.com/claude">Claude</a> (Anthropic), via <a href="https://claude.com/claude-code">Claude Code</a> — a écrit l\'intégralité de l\'application, des tests et de la documentation, à partir de prompts en langage naturel.',

  'about.sources.heading': 'Sources',
  'about.sources.item1':
    '<strong>Règles par objectif d\'entraînement</strong> — résumées à partir de la prise de position 2026 de l\'American College of Sports Medicine, <em>« Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews »</em>, publiée dans <em>Medicine &amp; Science in Sports &amp; Exercise</em> (avril 2026), une revue parapluie de 137 revues systématiques (~30 000 participants). <a href="https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx">Texte intégral</a>.',
  'about.sources.item2':
    '<strong>Base de données d\'exercices</strong> — issue de <a href="https://github.com/yuhonas/free-exercise-db">yuhonas/free-exercise-db</a> (~870 entrées), elle-même restructurée à partir d\'un jeu de données original d\'Ollie Jennings (<a href="https://github.com/wrkout/exercises.json">wrkout/exercises.json</a>). Les noms d\'exercices ont une couche de traduction française partielle et manuelle, avec un repli sur le nom anglais d\'origine là où aucune traduction n\'existe encore.',

  'about.license.heading': 'Licence',
  'about.license.body':
    'Le code de l\'application est sous licence MIT. Cette licence ne s\'étend pas aux données tierces embarquées dans l\'application — la base d\'exercices est dans le domaine public (Unlicense) et créditée ci-dessus par courtoisie, tandis que les données d\'objectifs d\'entraînement de l\'ACSM sont un résumé condensé d\'une publication scientifique protégée par le droit d\'auteur, utilisées comme instantané de référence dans l\'application plutôt que comme donnée librement redistribuable. Voir le <a href="https://github.com/flnt-fr/volumen">dépôt source</a> du projet et ses fichiers <code>README.md</code> et <code>LICENSE</code> pour tous les détails, ainsi que les <a href="/legal">mentions légales</a> pour les informations d\'éditeur et d\'hébergeur.',

  'legal.heading': 'Mentions légales',
  'legal.intro':
    'Cette page constitue les mentions légales requises par la loi française (LCEN, art. 6-III) pour un site publié depuis la France.',
  'legal.publisher.heading': 'Éditeur',
  'legal.publisher.body':
    'Ce site est publié à titre personnel et non professionnel par Florent A.<br />Contact : <a href="mailto:volumen@flnt.fr">volumen@flnt.fr</a>',
  'legal.publisher.director': 'Directeur de la publication : Florent A.',
  'legal.hosting.heading': 'Hébergeur',
  'legal.hosting.body':
    'Ce site est hébergé sur un serveur privé virtuel exploité par :<br />OVH SAS — capital de 50 000 000 €<br />2 rue Kellermann, 59100 Roubaix, France<br />RCS Lille Métropole 424 761 419 00045',
  'legal.ip.heading': 'Propriété intellectuelle',
  'legal.ip.body':
    'Le code de l\'application est publié sous licence MIT. Il embarque des données tierces sous leurs propres conditions distinctes (une base d\'exercices ouverte dans le domaine public, et un résumé condensé d\'une publication scientifique protégée par le droit d\'auteur). Tous les détails, crédits et textes de licence sont disponibles dans le <a href="https://github.com/flnt-fr/volumen">dépôt source</a> du projet et ses fichiers <code>README.md</code>/<code>LICENSE</code>.',
  'legal.personalData.heading': 'Données personnelles',
  'legal.personalData.body':
    'Volumen fonctionne entièrement dans votre navigateur. Il n\'y a ni serveur, ni compte utilisateur, ni suivi analytique, ni cookie. Le programme d\'entraînement que vous construisez est stocké uniquement dans le <code>localStorage</code> de votre navigateur et n\'est jamais transmis à, ni vu par, l\'éditeur ou l\'hébergeur. Effacer les données de site de votre navigateur le supprime définitivement. Aucune donnée personnelle n\'étant collectée ni traitée par l\'éditeur, aucune relation de responsable de traitement n\'est établie et il n\'y a rien à demander d\'accéder, de corriger ou de supprimer de notre côté.',
  'legal.liability.heading': 'Responsabilité',
  'legal.liability.body':
    'Volumen est un projet expérimental, personnel (voir la page <a href="/about">À propos</a> pour le contexte) fourni « tel quel », sans garantie d\'aucune sorte, et ne constitue pas un avis médical ou professionnel en matière de fitness. Consultez un professionnel qualifié avant de commencer tout programme d\'entraînement.',

  'notFound.title': '404 — Page introuvable',
  'notFound.message': 'Aucun exercice, séance ou page ne correspond à ce nom. Retournez au constructeur de programme.',
  'notFound.homeLink': 'Aller à la page d\'accueil',
};

export default fr;
