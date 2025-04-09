
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useCampaignStore, Campaign } from '@/lib/campaigns';
import { FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CampaignEditDialog } from '@/components/campaigns/CampaignEditDialog';
import { CampaignDeleteConfirmation } from '@/components/campaigns/CampaignDeleteConfirmation';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { fetchCampaigns, deleteCampaign as deleteCampaignAPI, createCampaign as createCampaignAPI, updateCampaign as updateCampaignAPI } from '@/services/campaignService';
import { useLanguage } from '@/lib/language-context';
import { Tables } from '@/integrations/supabase/types';

export default function CampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCampaignStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | undefined>();
  const [dialogMode, setDialogMode] = useState<'edit' | 'add'>('add');
  const [isLoading, setIsLoading] = useState(true);
  const [dbCampaigns, setDbCampaigns] = useState<Tables<'campaigns'>[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCampaigns();
        setDbCampaigns(data);
      } catch (error) {
        console.error("Erreur lors du chargement des campagnes:", error);
        toast({
          title: t('Error'),
          description: "Impossible de charger les campagnes. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [toast, t]);

  const handleAddCampaign = () => {
    setCurrentCampaign(undefined);
    setDialogMode('add');
    setIsEditDialogOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setDialogMode('edit');
    setIsEditDialogOpen(true);
  };

  const handleViewCampaign = (campaign: Campaign) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    if (currentCampaign) {
      try {
        await deleteCampaignAPI(currentCampaign.id);
        deleteCampaign(currentCampaign.id);
        
        // Mettre à jour la liste après suppression
        setDbCampaigns(prev => prev.filter(c => c.id !== currentCampaign.id));
        
        toast({
          title: t("Campaign deleted"),
          description: `${currentCampaign.name} ${t("has been removed.")}`,
        });
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          title: t("Error"),
          description: "Impossible de supprimer la campagne. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleSaveCampaign = async (campaignData: any) => {
    try {
      if (dialogMode === 'add') {
        const newCampaign = await createCampaignAPI(campaignData);
        
        // Ajouter les propriétés manquantes pour correspondre au type Campaign
        const campaignToStore: Campaign = {
          id: newCampaign.id,
          name: newCampaign.name,
          description: newCampaign.description,
          status: newCampaign.status as 'active' | 'inactive' | 'completed',
          gridId: newCampaign.grid_id,
          recordCount: campaignData.recordCount || 0,
          evaluatedCount: 0,
          createdAt: newCampaign.created_at,
          updatedAt: newCampaign.updated_at
        };
        
        addCampaign(campaignToStore);
        
        // Mettre à jour la liste après ajout
        setDbCampaigns(prev => [newCampaign, ...prev]);
        
        toast({
          title: t("Campaign created"),
          description: `${campaignData.name} ${t("has been created successfully.")}`,
        });
      } else if (currentCampaign) {
        const updatedCampaign = await updateCampaignAPI(currentCampaign.id, campaignData);
        
        // Mettre à jour avec les propriétés correctes
        const campaignToStore: Partial<Campaign> = {
          name: updatedCampaign.name,
          description: updatedCampaign.description,
          status: updatedCampaign.status as 'active' | 'inactive' | 'completed',
          gridId: updatedCampaign.grid_id,
          updatedAt: updatedCampaign.updated_at
        };
        
        updateCampaign(currentCampaign.id, campaignToStore);
        
        // Mettre à jour la liste après modification
        setDbCampaigns(prev => prev.map(c => c.id === currentCampaign.id ? updatedCampaign : c));
        
        toast({
          title: t("Campaign updated"),
          description: `${campaignData.name} ${t("has been updated successfully.")}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: t("Error"),
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">{t('Campaigns')}</h1>
        <Button onClick={handleAddCampaign}>
          <FileText className="h-4 w-4 mr-2" />
          {t('Add Campaign')}
        </Button>
      </div>

      <CampaignList 
        campaigns={dbCampaigns}
        isLoading={isLoading}
        onView={handleViewCampaign}
        onEdit={handleEditCampaign}
        onDelete={handleDeleteCampaign}
        onCreateCampaign={handleAddCampaign}
      />

      <CampaignEditDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveCampaign}
        campaign={currentCampaign}
        mode={dialogMode}
      />

      <CampaignDeleteConfirmation
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteCampaign}
        campaign={currentCampaign}
      />
    </DashboardLayout>
  );
}
