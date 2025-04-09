
import { supabase } from "@/integrations/supabase/client";

// Récupérer toutes les évaluations
export async function fetchEvaluations() {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*, record_id(*)');

  if (error) {
    console.error('Erreur lors de la récupération des évaluations:', error);
    throw error;
  }

  return data || [];
}

// Récupérer les évaluations par campagne
export async function fetchEvaluationsByCampaign(campaignId: number) {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*, record_id(*)')
    .eq('record_id.campaign_id', campaignId);

  if (error) {
    console.error(`Erreur lors de la récupération des évaluations pour la campagne ${campaignId}:`, error);
    throw error;
  }

  return data || [];
}

// Récupérer une évaluation par ID
export async function fetchEvaluationById(id: number) {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*, record_id(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erreur lors de la récupération de l'évaluation ${id}:`, error);
    throw error;
  }

  return data;
}

// Créer une nouvelle évaluation
export async function createEvaluation(evaluationData: any) {
  const { data, error } = await supabase
    .from('evaluations')
    .insert([evaluationData])
    .select();

  if (error) {
    console.error('Erreur lors de la création de l\'évaluation:', error);
    throw error;
  }

  return data?.[0];
}

// Mettre à jour une évaluation
export async function updateEvaluation(id: number, evaluationData: any) {
  const { data, error } = await supabase
    .from('evaluations')
    .update(evaluationData)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Erreur lors de la mise à jour de l'évaluation ${id}:`, error);
    throw error;
  }

  return data?.[0];
}

// Soumettre les réponses d'une évaluation
export async function submitAnswers(evaluationId: number, answers: any[]) {
  const { error } = await supabase
    .from('answers')
    .insert(answers.map(answer => ({
      ...answer,
      evaluation_id: evaluationId
    })));

  if (error) {
    console.error('Erreur lors de la soumission des réponses:', error);
    throw error;
  }

  return true;
}
