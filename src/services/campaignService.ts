
import { supabase } from "@/integrations/supabase/client";

// Récupérer toutes les campagnes
export async function fetchCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des campagnes:', error);
    throw error;
  }

  return data || [];
}

// Récupérer une campagne par ID
export async function fetchCampaignById(id: number) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erreur lors de la récupération de la campagne ${id}:`, error);
    throw error;
  }

  return data;
}

// Créer une nouvelle campagne
export async function createCampaign(campaignData: any) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([campaignData])
    .select();

  if (error) {
    console.error('Erreur lors de la création de la campagne:', error);
    throw error;
  }

  return data?.[0];
}

// Mettre à jour une campagne existante
export async function updateCampaign(id: number, campaignData: any) {
  const { data, error } = await supabase
    .from('campaigns')
    .update(campaignData)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Erreur lors de la mise à jour de la campagne ${id}:`, error);
    throw error;
  }

  return data?.[0];
}

// Supprimer une campagne
export async function deleteCampaign(id: number) {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erreur lors de la suppression de la campagne ${id}:`, error);
    throw error;
  }

  return true;
}
