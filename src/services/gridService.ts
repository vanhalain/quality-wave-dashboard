
import { supabase } from "@/integrations/supabase/client";

// Récupérer toutes les grilles d'évaluation
export async function fetchGrids() {
  const { data, error } = await supabase
    .from('evaluation_grids')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des grilles:', error);
    throw error;
  }

  return data || [];
}

// Récupérer une grille par ID
export async function fetchGridById(id: number) {
  const { data, error } = await supabase
    .from('evaluation_grids')
    .select(`
      *,
      grid_sections(
        *,
        questions(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erreur lors de la récupération de la grille ${id}:`, error);
    throw error;
  }

  return data;
}

// Créer une nouvelle grille
export async function createGrid(gridData: any) {
  const { data, error } = await supabase
    .from('evaluation_grids')
    .insert([gridData])
    .select();

  if (error) {
    console.error('Erreur lors de la création de la grille:', error);
    throw error;
  }

  return data?.[0];
}

// Mettre à jour une grille
export async function updateGrid(id: number, gridData: any) {
  const { data, error } = await supabase
    .from('evaluation_grids')
    .update(gridData)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Erreur lors de la mise à jour de la grille ${id}:`, error);
    throw error;
  }

  return data?.[0];
}

// Supprimer une grille
export async function deleteGrid(id: number) {
  const { error } = await supabase
    .from('evaluation_grids')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erreur lors de la suppression de la grille ${id}:`, error);
    throw error;
  }

  return true;
}

// Créer une section de grille
export async function createGridSection(sectionData: any) {
  const { data, error } = await supabase
    .from('grid_sections')
    .insert([sectionData])
    .select();

  if (error) {
    console.error('Erreur lors de la création de la section:', error);
    throw error;
  }

  return data?.[0];
}

// Créer une question
export async function createQuestion(questionData: any) {
  const { data, error } = await supabase
    .from('questions')
    .insert([questionData])
    .select();

  if (error) {
    console.error('Erreur lors de la création de la question:', error);
    throw error;
  }

  return data?.[0];
}
