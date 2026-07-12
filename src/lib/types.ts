export interface ProgramExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface Session {
  id: string;
  name: string;
  exercises: ProgramExercise[];
}

export interface Program {
  goalId: string;
  sessions: Session[];
  marginMinutes: number;
}
