import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestionType = 'text' | 'select' | 'radio' | 'checkbox' | 'slider' | 'toggle' | 'rating';

export interface QuestionOption {
  id: number;
  label: string;
  value: number;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  minValue?: number;
  maxValue?: number;
  required: boolean;
}

export interface Grid {
  id: number;
  name: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationAnswer {
  questionId: number;
  value: string | number | boolean | number[];
  comment?: string;
}

export interface Evaluation {
  id: number;
  gridId: number;
  answers: EvaluationAnswer[];
  score?: number;
  status: 'draft' | 'submitted' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

interface GridStore {
  grids: Grid[];
  evaluations: Evaluation[];
  addGrid: (grid: Omit<Grid, 'id' | 'createdAt' | 'updatedAt'>) => number;
  updateGrid: (id: number, updates: Partial<Grid>) => void;
  deleteGrid: (id: number) => void;
  getGrid: (id: number) => Grid | undefined;
  addQuestionToGrid: (gridId: number, question: Omit<Question, 'id'>) => void;
  updateQuestion: (gridId: number, questionId: number, updates: Partial<Question>) => void;
  deleteQuestion: (gridId: number, questionId: number) => void;
  submitEvaluation: (gridId: number, answers: EvaluationAnswer[]) => void;
  getEvaluationsByGridId: (gridId: number) => Evaluation[];
}

export const useGridStore = create<GridStore>()(
  persist(
    (set, get) => ({
      grids: [
        {
          id: 1,
          name: 'Grille d\'évaluation standard',
          description: 'Grille standard pour évaluer les appels clients',
          questions: [
            {
              id: 1,
              text: 'L\'agent a-t-il salué le client correctement ?',
              type: 'radio',
              options: [
                { id: 1, label: 'Non', value: 0 },
                { id: 2, label: 'Partiellement', value: 1 },
                { id: 3, label: 'Oui', value: 2 }
              ],
              required: true
            },
            {
              id: 2,
              text: 'Évaluez la clarté de l\'agent',
              type: 'slider',
              minValue: 0,
              maxValue: 10,
              required: true
            },
            {
              id: 3,
              text: 'L\'agent a-t-il résolu le problème du client ?',
              type: 'toggle',
              required: true
            },
            {
              id: 4,
              text: 'Évaluez la satisfaction globale du client',
              type: 'rating',
              maxValue: 5,
              required: true
            }
          ],
          createdAt: '2025-01-15T00:00:00.000Z',
          updatedAt: '2025-01-15T00:00:00.000Z'
        }
      ],
      evaluations: [],
      
      addGrid: (grid) => {
        const newId = Math.max(0, ...get().grids.map((g) => g.id)) + 1;
        const now = new Date().toISOString();
        
        set((state) => ({
          grids: [
            ...state.grids,
            {
              ...grid,
              id: newId,
              createdAt: now,
              updatedAt: now,
            },
          ],
        }));
        
        return newId; // Retourne l'ID pour permettre la sélection
      },
      
      updateGrid: (id, updates) => {
        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === id
              ? { ...grid, ...updates, updatedAt: updates.updatedAt || new Date().toISOString() }
              : grid
          ),
        }));
      },
      
      deleteGrid: (id) => {
        set((state) => ({
          grids: state.grids.filter((grid) => grid.id !== id),
        }));
      },
      
      getGrid: (id) => {
        return get().grids.find((grid) => grid.id === id);
      },
      
      addQuestionToGrid: (gridId, question) => {
        set((state) => {
          const grid = state.grids.find((g) => g.id === gridId);
          if (!grid) return state;
          
          const newQuestion = {
            ...question,
            id: Math.max(0, ...grid.questions.map((q) => q.id)) + 1
          };
          
          return {
            grids: state.grids.map((g) =>
              g.id === gridId
                ? {
                    ...g,
                    questions: [...g.questions, newQuestion],
                    updatedAt: new Date().toISOString()
                  }
                : g
            )
          };
        });
      },
      
      updateQuestion: (gridId, questionId, updates) => {
        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === gridId
              ? {
                  ...grid,
                  questions: grid.questions.map((question) =>
                    question.id === questionId
                      ? { ...question, ...updates }
                      : question
                  ),
                  updatedAt: new Date().toISOString()
                }
              : grid
          ),
        }));
      },
      
      deleteQuestion: (gridId, questionId) => {
        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === gridId
              ? {
                  ...grid,
                  questions: grid.questions.filter(
                    (question) => question.id !== questionId
                  ),
                  updatedAt: new Date().toISOString()
                }
              : grid
          ),
        }));
      },
      
      submitEvaluation: (gridId, answers) => {
        set((state) => {
          // Calculate score based on answers
          const grid = state.grids.find(g => g.id === gridId);
          if (!grid) return state;
          
          const totalQuestions = grid.questions.length;
          const answeredQuestions = answers.length;
          const completionRatio = answeredQuestions / totalQuestions;
          
          // Simple scoring algorithm - could be more sophisticated in a real app
          let score = 0;
          let totalPossibleScore = 0;
          
          answers.forEach(answer => {
            const question = grid.questions.find(q => q.id === answer.questionId);
            if (!question) return;
            
            if (question.type === 'radio' || question.type === 'select') {
              const selectedOption = question.options?.find(opt => opt.value === Number(answer.value));
              if (selectedOption) {
                score += selectedOption.value;
                totalPossibleScore += Math.max(...(question.options?.map(opt => opt.value) || [0]));
              }
            } else if (question.type === 'slider' || question.type === 'rating') {
              const value = Number(answer.value);
              score += value;
              totalPossibleScore += question.maxValue || 10;
            } else if (question.type === 'toggle') {
              if (answer.value === true) {
                score += 1;
              }
              totalPossibleScore += 1;
            }
          });
          
          const normalizedScore = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
          
          const newEvaluation: Evaluation = {
            id: Math.max(0, ...state.evaluations.map(e => e.id), 0) + 1,
            gridId,
            answers,
            score: Math.round(normalizedScore),
            status: 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          return {
            evaluations: [...state.evaluations, newEvaluation]
          };
        });
      },
      
      getEvaluationsByGridId: (gridId) => {
        return get().evaluations.filter(evaluation => evaluation.gridId === gridId);
      }
    }),
    {
      name: 'grid-storage',
      version: 1,
    }
  )
);
