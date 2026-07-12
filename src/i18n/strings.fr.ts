import type { TranslationKey } from './strings.en';

const fr: Partial<Record<TranslationKey, string>> = {
  'app.tagline': 'Créez un programme de musculation aligné sur les recommandations 2026 de l\'ACSM.',

  'localeSwitcher.label': 'Langue',

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
};

export default fr;
