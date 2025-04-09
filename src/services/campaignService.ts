
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
  // Adapter les noms de propriétés aux colonnes de la base de données
  const dbCampaignData = {
    name: campaignData.name,
    description: campaignData.description,
    status: campaignData.status,
    grid_id: campaignData.gridId || null,
    start_date: new Date().toISOString() // Adding the required start_date field
  };

  const { data, error } = await supabase
    .from('campaigns')
    .insert(dbCampaignData)
    .select();

  if (error) {
    console.error('Erreur lors de la création de la campagne:', error);
    throw error;
  }

  return data?.[0];
}

// Mettre à jour une campagne existante
export async function updateCampaign(id: number, campaignData: any) {
  // Adapter les noms de propriétés aux colonnes de la base de données
  const dbCampaignData = {
    name: campaignData.name,
    description: campaignData.description,
    status: campaignData.status,
    grid_id: campaignData.gridId
  };

  const { data, error } = await supabase
    .from('campaigns')
    .update(dbCampaignData)
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
