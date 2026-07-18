const en = {
  'app.tagline': 'Build a strength training program aligned with the 2026 ACSM recommendations.',
  'app.eyebrow': 'ACSM 2026-aligned programming',
  'app.heading': 'Your program',

  'localeSwitcher.label': 'Language',

  'tour.startButton': 'Show me around',
  'tour.next': 'Next',
  'tour.previous': 'Back',
  'tour.done': 'Done',
  'tour.progress': '{{current}} of {{total}}',
  'tour.intro.title': 'Your program',
  'tour.intro.description': 'This is your training program, built entirely in your browser — nothing is sent anywhere.',
  'tour.goalSelector.title': 'Training goal',
  'tour.goalSelector.description':
    'Pick strength, hypertrophy, power, or general health. It sets the volume and frequency targets checked below.',
  'tour.sessions.title': 'Sessions',
  'tour.sessions.description': 'Add sessions and exercises here. Each one contributes to the volume checks below.',
  'tour.muscleGroupVolume.title': 'Muscle group volume',
  'tour.muscleGroupVolume.description':
    'Your weekly sets per muscle group, compared live against the recommended minimum for your goal.',
  'tour.compliance.title': 'Volume rule compliance',
  'tour.compliance.description': 'A pass/fail summary of every ACSM volume rule that applies to your goal.',
  'tour.exportImport.title': 'Export / import',
  'tour.exportImport.description': 'Save your program as a JSON file, or load one back in — no account needed.',

  'footer.about': 'About',
  'footer.legal': 'Legal notice',

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
  'muscleGroupVolume.chart.heading': 'Sets per muscle, at a glance',
  'muscleGroupVolume.chart.legend.actual': 'Weighted sets',
  'muscleGroupVolume.chart.legend.min': 'Recommended minimum',
  'muscleGroupVolume.table.summary': 'Muscle group volume breakdown',

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

  // Static marketing pages (index, about, legal, 404) + shared site chrome.
  'nav.openApp': 'Open the app',
  'nav.backToApp': '← Back to the app',

  'home.eyebrow': 'ACSM 2026-aligned programming',
  'home.title': 'Build a program your volume actually supports.',
  'home.subtitle':
    "Volumen is a free strength-training program builder that checks your weekly sets per muscle group against the ACSM's 2026 resistance-training recommendations — so you know if a session is under-dosed, on target, or overreaching before you ever step in the gym.",
  'home.cta.primary': 'Create my program',
  'home.cta.secondary': 'Learn more',
  'home.privacyNote': 'No account, no backend, no tracking — everything stays in your browser.',

  'home.preview.heading': 'Weekly volume · sets per muscle group',
  'home.preview.muscle.chest': 'Chest',
  'home.preview.muscle.back': 'Back',
  'home.preview.muscle.quads': 'Quads',
  'home.preview.muscle.shoulders': 'Shoulders',
  'home.preview.setsUnit': 'sets',
  'home.preview.note': 'Illustrative example — not a live program.',

  'home.howItWorks.heading': 'How it works',
  'home.howItWorks.subtitle': "Four steps, in the order you'll actually use them.",
  'home.step1.title': 'Set your goal',
  'home.step1.body':
    'Strength, hypertrophy, power, or general health — Volumen loads the ACSM 2026 volume and frequency targets that go with it.',
  'home.step2.title': 'Build your sessions',
  'home.step2.body': 'Pick exercises from a database of 800+ movements and assign sets, reps, and rest per session.',
  'home.step3.title': 'Check the compliance',
  'home.step3.body':
    'Sets per muscle group are tallied live and checked against the recommended range, with an estimated session duration alongside.',
  'home.step4.title': 'Export & import',
  'home.step4.body':
    'Everything stays in your browser’s localStorage. Save your program as a JSON file, or load one back in, whenever you want.',

  'home.finalCta.heading': 'Ready to check your program?',
  'home.finalCta.subtitle': 'It takes less time to build a session than to finish your warm-up set.',

  'about.heading': 'About Volumen',
  'about.intro':
    'Volumen is a small, fully client-side web app for building a strength-training program aligned with the <a href="https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx">ACSM 2026 resistance-training recommendations</a>. Pick a training goal (strength, hypertrophy, power, general health), build out your weekly sessions from a database of 800+ exercises, and the app checks your sets/volume against the recommended targets per muscle group, estimates how long each session will actually take, and lets you export/import your program as JSON. Everything lives in your browser\'s <code>localStorage</code> — no backend, no accounts, no tracking.',

  'about.vibeCoding.heading': '⚠️ This project is a vibe-coding experiment',
  'about.vibeCoding.p1':
    'This entire codebase — every line, every test, every design decision — was written by <strong>prompting Claude</strong> (via <a href="https://claude.com/claude-code">Claude Code</a>), not by hand. There was no spec-driven-development framework, no ticket system, no formal design doc, no scaffolding harness of any kind. Just a back-and-forth conversation: a feature request in plain English (often in French), Claude reading the existing code, writing the implementation, running the tests, and reporting back. Bugs got described the same way a user would describe them ("the import doesn\'t work") rather than filed with a root-cause diagnosis.',
  'about.vibeCoding.p2':
    'The goal was to see how far pure conversational prompting could carry a real, working, tested app — not to demonstrate a polished engineering process. Take the app with that in mind: it\'s the product of an experiment in AI-driven ("vibe") coding, not a reference architecture.',

  'about.howBuilt.heading': 'How it was actually built',
  'about.howBuilt.step1':
    '<strong>Bootstrap</strong> — started from the standard Astro minimal template with the React integration added for interactive components.',
  'about.howBuilt.step2':
    '<strong>Domain data first</strong> — dropped in two source datasets (see Sources below) and asked Claude to model the domain: training goals, exercises, and the program/session/exercise shape.',
  'about.howBuilt.step3':
    '<strong>Core loop, iteratively prompted</strong> — goal selection → session/exercise editing → per-muscle volume calculation → compliance checking against the ACSM rules → export/import as JSON, each added as its own prompt/feature request.',
  'about.howBuilt.step4':
    '<strong>i18n pass</strong> — English/French support, implemented as a small hand-rolled lookup system (no i18n library) plus a hand-translated subset of exercise names, with a tested English fallback for anything untranslated.',
  'about.howBuilt.step5':
    '<strong>Session time estimation</strong> — a feature request ("show me how long each session/exercise will take, plus a time margin input") was implemented, then run through a multi-agent review loop in the same conversation: one agent implemented it, then three more ran in parallel against the diff — one re-reviewing the code, one driving a real browser via Playwright to validate the UI, and one independently re-deriving the time-estimation math by hand.',
  'about.howBuilt.step6':
    '<strong>Bug fixes from plain-English reports</strong> — e.g. "the import feature doesn\'t work" was investigated from scratch rather than assumed; the actual defect (a field silently dropped from the exported JSON schema) was found and fixed with regression tests added after the fact.',
  'about.howBuilt.step7':
    '<strong>Tuning by feel</strong> — later prompts adjusted the time-estimation model itself (tempo assumption, equipment-change overhead) purely based on intuition about what felt realistic, not a formal study.',
  'about.howBuilt.step8':
    '<strong>Whole-project review pass</strong> — a dedicated review/fix/validate loop ran across the entire codebase: one agent audited everything from scratch and flagged concrete bugs (e.g. a silent-data-loss edge case where an unclamped numeric input could wipe the whole stored program on reload), a second agent fixed each finding with regression tests, and a third independently re-drove the fixed app through real user journeys in a browser before signing off.',
  'about.howBuilt.testingNote':
    'Testing throughout was Vitest for the domain logic and Playwright for end-to-end flows, both driven by Claude, with the human in the loop reviewing behavior rather than diffs line by line.',

  'about.stack.heading': 'Stack & credits',
  'about.stack.item1': '<a href="https://astro.build/">Astro</a> — static-first site framework, hosts a single Preact island.',
  'about.stack.item2': '<a href="https://preactjs.com/">Preact</a> — the interactive program builder.',
  'about.stack.item3':
    '<a href="https://zod.dev/">Zod</a> — schema validation for the localStorage program shape and the export/import JSON file format.',
  'about.stack.item4':
    '<a href="https://tailwindcss.com/">Tailwind CSS</a> and <a href="https://daisyui.com/">daisyUI</a> — utility classes and themed components used for styling.',
  'about.stack.item5': '<a href="https://vitest.dev/">Vitest</a> — unit tests for the domain logic.',
  'about.stack.item6': '<a href="https://playwright.dev/">Playwright</a> — end-to-end browser tests.',
  'about.stack.item7': '<a href="https://www.typescriptlang.org/">TypeScript</a> throughout.',
  'about.stack.item8':
    '<a href="https://www.chartjs.org/">Chart.js</a> — the sets-per-muscle radar chart shown for the hypertrophy goal.',
  'about.stack.item9':
    '<a href="https://driverjs.com/">driver.js</a> — the guided tour introducing the app\'s interface on a visitor\'s first visit.',
  'about.stack.item10':
    '<a href="https://www.anthropic.com/claude">Claude</a> (Anthropic), via <a href="https://claude.com/claude-code">Claude Code</a> — wrote the entire application, tests, and documentation, from natural-language prompts.',

  'about.sources.heading': 'Sources',
  'about.sources.item1':
    '<strong>Training-goal rules</strong> — summarized from the American College of Sports Medicine\'s 2026 position stand, <em>"Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews"</em>, published in <em>Medicine &amp; Science in Sports &amp; Exercise</em> (April 2026), an umbrella review of 137 systematic reviews (~30,000 participants). <a href="https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx">Full text</a>.',
  'about.sources.item2':
    '<strong>Exercise database</strong> — from <a href="https://github.com/yuhonas/free-exercise-db">yuhonas/free-exercise-db</a> (~870 entries), itself restructured from an original dataset by Ollie Jennings (<a href="https://github.com/wrkout/exercises.json">wrkout/exercises.json</a>). Exercise names have a partial hand-authored French translation layer, falling back to the original English name where no translation exists yet.',

  'about.license.heading': 'License',
  'about.license.body':
    'The application code is MIT-licensed. That license does not extend to the third-party data bundled with the app — the exercise database is public domain (Unlicense) and credited above out of courtesy, while the ACSM training-goal data is a condensed summary of a copyrighted scientific publication, used as a reference snapshot within the app rather than freely redistributable data. See the <a href="https://github.com/flnt-fr/volumen">source repository</a>\'s <code>README.md</code> and <code>LICENSE</code> files for full details, and the <a href="/legal">legal notice</a> for publisher and hosting information.',

  'legal.heading': 'Legal notice',
  'legal.intro':
    'This page is provided as the legal notice ("mentions légales") required under French law (LCEN, art. 6-III) for a website published from France.',
  'legal.publisher.heading': 'Publisher',
  'legal.publisher.body':
    'This site is published on a non-professional, personal basis by Florent A.<br />Contact: <a href="mailto:volumen@flnt.fr">volumen@flnt.fr</a>',
  'legal.publisher.director': 'Publication director: Florent A.',
  'legal.hosting.heading': 'Hosting provider',
  'legal.hosting.body':
    'This site is hosted on a virtual private server operated by:<br />OVH SAS — capital of €50,000,000<br />2 rue Kellermann, 59100 Roubaix, France<br />RCS Lille Métropole 424 761 419 00045',
  'legal.ip.heading': 'Intellectual property',
  'legal.ip.body':
    'The application code is released under the MIT license. It bundles third-party data under their own, separate terms (an open exercise database released into the public domain, and a condensed summary of a copyrighted scientific publication). Full details, credits, and license text are available in the project\'s <a href="https://github.com/flnt-fr/volumen">source repository</a> and its <code>README.md</code>/<code>LICENSE</code> files.',
  'legal.personalData.heading': 'Personal data',
  'legal.personalData.body':
    'Volumen runs entirely in your browser. It has no backend, no user accounts, no analytics, and sets no cookies. The training program you build is stored only in your browser\'s <code>localStorage</code> and is never transmitted to, or seen by, the publisher or the hosting provider. Clearing your browser\'s site data removes it permanently. Because no personal data is collected or processed by the publisher, no data-controller relationship is established and there is nothing to request access to, correct, or delete on our end.',
  'legal.liability.heading': 'Liability',
  'legal.liability.body':
    'Volumen is an experimental, hobby project (see the <a href="/about">About</a> page for context) provided "as is", without warranty of any kind, and is not medical or professional fitness advice. Consult a qualified professional before starting any training program.',

  'notFound.title': '404 — Page not found',
  'notFound.message': 'There\'s no exercise, session, or page under that name. Head back to the program builder.',
  'notFound.homeLink': 'Go to the home page',
};

export default en;
export type TranslationKey = keyof typeof en;
