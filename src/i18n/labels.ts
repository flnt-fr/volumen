import type { TrainingGoal } from '../lib/data';
import type { Locale } from './types';

const muscleLabelsFr: Record<string, string> = {
  abdominals: 'Abdominaux',
  abductors: 'Abducteurs',
  adductors: 'Adducteurs',
  biceps: 'Biceps',
  calves: 'Mollets',
  chest: 'Pectoraux',
  forearms: 'Avant-bras',
  glutes: 'Fessiers',
  hamstrings: 'Ischio-jambiers',
  lats: 'Grand dorsal',
  'lower back': 'Bas du dos',
  'middle back': 'Milieu du dos',
  neck: 'Cou',
  quadriceps: 'Quadriceps',
  shoulders: 'Épaules',
  traps: 'Trapèzes',
  triceps: 'Triceps',
};

function label(dict: Record<string, string>, raw: string | null, locale: Locale): string {
  if (raw === null) return '';
  if (locale === 'en') return raw;
  return dict[raw] ?? raw;
}

export function getMuscleLabel(muscle: string, locale: Locale): string {
  return label(muscleLabelsFr, muscle, locale);
}

interface GoalTranslation {
  name: string;
  definition: string;
  keyPrinciples: string[];
}

const goalTranslationsFr: Record<string, GoalTranslation> = {
  strength: {
    name: 'Force',
    definition: 'La capacité à soulever une charge lourde',
    keyPrinciples: [
      'Effectuez les mouvements clés/principaux en début de séance',
      'Utilisez une amplitude de mouvement complète',
      "L'entraînement jusqu'à l'échec absolu n'est pas nécessaire",
    ],
  },
  hypertrophy: {
    name: 'Hypertrophie (croissance musculaire)',
    definition: 'Augmenter la taille et le volume musculaire',
    keyPrinciples: [
      'Le volume total hebdomadaire de séries est le principal moteur de la croissance musculaire',
      'La surcharge excentrique (la phase de descente/négative) est favorable à l\'hypertrophie',
      "L'entraînement jusqu'à l'échec absolu n'est pas nécessaire ; s'arrêter à 2-3 répétitions en réserve produit des résultats comparables avec moins de fatigue",
    ],
  },
  power: {
    name: 'Puissance',
    definition: "La vitesse à laquelle une charge donnée peut être déplacée",
    keyPrinciples: [
      'Déplacez la charge le plus rapidement possible pendant la phase concentrique',
      "Comparable à l'intention utilisée en haltérophilie olympique",
      'Peut être entraînée en toute sécurité avec des mouvements simples : passages assis-debout rapides, step-ups, lancers de medicine ball, variantes de sauts, swings de kettlebell',
    ],
  },
  generalHealthMovement: {
    name: 'Santé générale / mouvement fonctionnel',
    definition: 'Améliorer les fonctions du quotidien telles que la vitesse de marche et l\'équilibre',
    keyPrinciples: [
      'Utilisez une technique de levage rapide (« Power RT ») plutôt qu\'une charge lourde',
      'Cible la vitesse de marche et l\'équilibre',
      "Particulièrement pertinent pour les adultes vieillissants : la puissance musculaire décline plus vite que la force, souvent dès la 4e-5e décennie de vie",
    ],
  },
};

export function getGoalName(goal: TrainingGoal, locale: Locale): string {
  if (locale === 'en') return goal.name;
  return goalTranslationsFr[goal.id]?.name ?? goal.name;
}

export function getGoalDefinition(goal: TrainingGoal, locale: Locale): string {
  if (locale === 'en') return goal.definition;
  return goalTranslationsFr[goal.id]?.definition ?? goal.definition;
}

export function getGoalKeyPrinciples(goal: TrainingGoal, locale: Locale): string[] {
  if (locale === 'en') return goal.keyPrinciples;
  return goalTranslationsFr[goal.id]?.keyPrinciples ?? goal.keyPrinciples;
}
