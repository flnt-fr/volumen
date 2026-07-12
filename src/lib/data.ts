import acsmData from '../data/acsm-2026.json';
import exercisesData from '../data/exercices.json';

export interface TrainingGoalVolume {
  setsPerExercise?: { min: number; max: number };
  setsPerMuscleGroupPerWeek?: { min: number };
}

export interface TrainingGoalFrequency {
  sessionsPerWeekMin: number;
}

export interface TrainingGoal {
  id: string;
  name: string;
  definition: string;
  load: {
    percentOf1RM: { min: number; max: number | null; note?: string };
  };
  volume?: TrainingGoalVolume;
  frequency?: TrainingGoalFrequency;
  keyPrinciples: string[];
}

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
}

export const trainingGoals = acsmData.trainingGoals as TrainingGoal[];
export const exercises = exercisesData as Exercise[];
export const primaryMuscles: string[] = Array.from(new Set(exercises.flatMap((e) => e.primaryMuscles))).sort();

const goalsById = new Map(trainingGoals.map((goal) => [goal.id, goal]));
const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

export function getGoalById(id: string): TrainingGoal | undefined {
  return goalsById.get(id);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercisesById.get(id);
}
