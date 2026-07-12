const en = {
  'app.tagline': 'Build a strength training program aligned with the 2026 ACSM recommendations.',

  'localeSwitcher.label': 'Language',

  'goalSelector.heading': 'Training goal',
  'goalSelector.label': 'Training goal',

  'sessions.heading': 'Sessions',
  'sessions.empty': 'No sessions yet.',
  'sessions.add': 'Add a session',
  'sessions.defaultName': 'Session {index}',
  'sessions.marginLabel': 'Time margin per session (minutes)',
  'sessions.totalTime': 'Total estimated time for all sessions: {duration}',

  'session.nameLabel': 'Session name',
  'session.deleteAria': 'Delete session "{name}"',
  'session.delete': 'Delete session',
  'session.tableCaption': 'Exercises for session "{name}"',
  'session.tableExercise': 'Exercise',
  'session.tableSets': 'Sets',
  'session.tableReps': 'Reps',
  'session.tableRest': 'Rest (s)',
  'session.tableTime': 'Estimated time',
  'session.tableActions': 'Actions',
  'session.estimatedTime': 'Estimated time for this session: {duration} (including {margin} margin)',
  'session.muscleSummary': 'Sets per muscle for this session',
  'session.muscleContribution.heading': 'Sets by exercise',
  'session.muscleContribution.exercise': 'Exercise',
  'session.muscleContribution.primaryMuscles': 'Primary muscle(s)',
  'session.muscleContribution.direct': 'Direct',
  'session.muscleContribution.secondaryMuscles': 'Secondary muscle(s)',
  'session.muscleContribution.secondary': 'Secondary (×0.5)',

  'exerciseRow.setsLabel': 'Sets',
  'exerciseRow.repsLabel': 'Reps',
  'exerciseRow.restLabel': 'Rest (seconds)',
  'exerciseRow.timeBreakdown': '{duration} (including {changeTime} for machine change/setup)',
  'exerciseRow.deleteAria': 'Delete "{name}"',
  'exerciseRow.delete': 'Delete',

  'exercisePicker.label': 'Add an exercise',
  'exercisePicker.placeholder': 'Search for an exercise…',
  'exercisePicker.add': 'Add',
  'exercisePicker.noMatch': 'No exercise matches "{value}".',

  'muscleVolume.empty': 'No exercises added to this session yet.',
  'muscleVolume.caption': 'Sets per muscle for session "{name}"',
  'muscleVolume.muscle': 'Muscle',
  'muscleVolume.primary': 'Sets (primary)',
  'muscleVolume.secondary': 'Sets (secondary)',

  'muscleGroupVolume.heading': 'Muscle group volume',
  'muscleGroupVolume.caption': 'Weekly sets per muscle group compared to the recommended minimum',
  'muscleGroupVolume.direct': 'Direct',
  'muscleGroupVolume.secondary': 'Secondary (×0.5)',
  'muscleGroupVolume.weighted': 'Weighted total',
  'muscleGroupVolume.minimum': 'Minimum',
  'muscleGroupVolume.status': 'Status',
  'muscleGroupVolume.note': 'A secondary/synergist muscle set counts for half a direct set (weighted total = direct + secondary × 0.5).',

  'compliance.heading': 'Volume rule compliance',
  'compliance.noRuleDefined': 'No volume rule defined for this goal.',
  'compliance.addToEvaluate': 'Add sessions and exercises to evaluate compliance with the volume rules.',
  'compliance.summary': '{pass} rule(s) passed out of {total}.',
  'compliance.setsPerExercise.pass': '{label} ({session}): {sets} set(s), compliant ({min}-{max}).',
  'compliance.setsPerExercise.fail': '{label} ({session}): {sets} set(s), expected between {min} and {max}.',
  'compliance.sessionsPerWeek.pass': '{count} session(s) scheduled, compliant (minimum {min}).',
  'compliance.sessionsPerWeek.fail': '{count} session(s) scheduled, minimum required: {min}.',
  'compliance.setsPerMuscleGroup.pass':
    '{muscle}: {primary} direct + {secondary} secondary set(s) × 0.5 = {weighted} weighted set(s), compliant (minimum {min}).',
  'compliance.setsPerMuscleGroup.fail':
    '{muscle}: {primary} direct + {secondary} secondary set(s) × 0.5 = {weighted} weighted set(s), minimum required: {min}.',

  'exportImport.heading': 'Export / import',
  'exportImport.export': 'Export program',
  'exportImport.importLabel': 'Import a program (JSON)',
  'exportImport.invalidJson': 'The selected file is not valid JSON.',
  'exportImport.invalidFile': 'The imported file is invalid:',

  'zodError.invalid_type': 'missing field or incorrect type.',
  'zodError.too_small': 'value too small or empty field.',
  'zodError.too_big': 'value too large.',
  'zodError.invalid_value': 'unrecognized value.',
  'zodError.unrecognized_keys': 'unexpected field(s).',
  'zodError.default': 'invalid value.',

  'programFileError.unknownGoal': 'header.goal.id: unknown goal "{id}".',
  'programFileError.unknownExercise': 'sessions.{sessionIndex}.exercises.{exerciseIndex}.exerciseId: unknown exercise "{id}".',

  'time.minutesOnly': '{minutes} min',
  'time.hoursMinutes': '{hours} h {minutes} min',
};

export default en;
export type TranslationKey = keyof typeof en;
