
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestionType = 'text' | 'select' | 'radio' | 'checkbox' | 'slider';

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

interface GridStore {
  grids: Grid[];
  addGrid: (grid: Omit<Grid, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGrid: (id: number, updates: Partial<Grid>) => void;
  deleteGrid: (id: number) => void;
  getGrid: (id: number) => Grid | undefined;
  addQuestionToGrid: (gridId: number, question: Omit<Question, 'id'>) => void;
  updateQuestion: (gridId: number, questionId: number, updates: Partial<Question>) => void;
  deleteQuestion: (gridId: number, questionId: number) => void;
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
            }
          ],
          createdAt: '2025-01-15T00:00:00.000Z',
          updatedAt: '2025-01-15T00:00:00.000Z'
        }
      ],
      
      addGrid: (grid) => {
        set((state) => ({
          grids: [
            ...state.grids,
            {
              ...grid,
              id: Math.max(0, ...state.grids.map((g) => g.id)) + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        }));
      },
      
      updateGrid: (id, updates) => {
        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === id
              ? { ...grid, ...updates, updatedAt: new Date().toISOString() }
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
    }),
    {
      name: 'grid-storage',
    }
  )
);
