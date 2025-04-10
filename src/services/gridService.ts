import { supabase } from "@/integrations/supabase/client";

// Récupérer toutes les grilles d'évaluation
export async function fetchGrids() {
  try {
    console.log("Fetching grids from Supabase...");
    const { data, error } = await supabase
      .from('evaluation_grids')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des grilles:', error);
      throw error;
    }

    console.log("Grilles récupérées:", data);
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des grilles:', error);
    // Fallback à l'état local si Supabase échoue
    return [];
  }
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
  // S'assurer que les données correspondent aux colonnes de la base de données
  const dbGridData = {
    name: gridData.name,
    description: gridData.description || '',
    created_by: gridData.created_by || 'system',
    status: gridData.status || 'active'
  };

  const { data, error } = await supabase
    .from('evaluation_grids')
    .insert(dbGridData)
    .select();

  if (error) {
    console.error('Erreur lors de la création de la grille:', error);
    throw error;
  }

  console.log("Grille créée:", data?.[0]);
  return data?.[0];
}

// Mettre à jour une grille
export async function updateGrid(id: number, gridData: any) {
  // S'assurer que les données correspondent aux colonnes de la base de données
  const dbGridData = {
    name: gridData.name,
    description: gridData.description,
    status: gridData.status
  };

  const { data, error } = await supabase
    .from('evaluation_grids')
    .update(dbGridData)
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
  // D'abord supprimer les sections et questions liées (si la cascade n'est pas configurée côté DB)
  try {
    // Récupérer toutes les sections de la grille
    const { data: sections } = await supabase
      .from('grid_sections')
      .select('id')
      .eq('grid_id', id);
    
    if (sections && sections.length > 0) {
      // Supprimer les questions pour chaque section
      for (const section of sections) {
        await supabase
          .from('questions')
          .delete()
          .eq('section_id', section.id);
      }
      
      // Supprimer toutes les sections
      await supabase
        .from('grid_sections')
        .delete()
        .eq('grid_id', id);
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression des sections/questions pour la grille ${id}:`, error);
  }
  
  // Supprimer la grille elle-même
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
    .insert({
      grid_id: sectionData.gridId,
      title: sectionData.title,
      order_index: sectionData.order || 0 // Changed 'order' to 'order_index' to match the database schema
    })
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
    .insert({
      section_id: questionData.sectionId,
      text: questionData.text,
      type: questionData.type,
      required: questionData.required,
      options: questionData.options,
      order_index: questionData.order || 0 // Changed 'order' to 'order_index' to match the database schema
    })
    .select();

  if (error) {
    console.error('Erreur lors de la création de la question:', error);
    throw error;
  }

  return data?.[0];
}
