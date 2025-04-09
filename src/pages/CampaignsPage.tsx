
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useCampaignStore, Campaign } from '@/lib/campaigns';
import { FileText, Edit, Trash, Eye, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { CampaignEditDialog } from '@/components/campaigns/CampaignEditDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { fetchCampaigns, deleteCampaign as deleteCampaignAPI, createCampaign as createCampaignAPI, updateCampaign as updateCampaignAPI } from '@/services/campaignService';
import { useLanguage } from '@/lib/language-context';
import { Tables } from '@/integrations/supabase/types';

type CampaignType = Tables<'campaigns'>;

export default function CampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCampaignStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | undefined>();
  const [dialogMode, setDialogMode] = useState<'edit' | 'add'>('add');
  const [isLoading, setIsLoading] = useState(true);
  const [dbCampaigns, setDbCampaigns] = useState<CampaignType[]>([]);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      localStorage.getItem('appLanguage') === 'fr' ? 'fr-FR' : 'en-US', 
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  // Calculer des statistiques simulées pour les campagnes dynamiques
  const getSimulatedStats = (campaign: CampaignType) => {
    // Générer des valeurs aléatoires basées sur l'ID pour la stabilité
    const seed = campaign.id || 1;
    const recordCount = Math.max(5, seed * 3 + 10);
    const evaluatedCount = Math.floor(recordCount * (0.1 + (seed % 10) / 10));
    
    return {
      recordCount,
      evaluatedCount
    };
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>{t('Loading')}...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbCampaigns.map((campaign) => {
            const stats = getSimulatedStats(campaign);
            const completionPercentage = Math.round((stats.evaluatedCount / stats.recordCount) * 100);
            
            // Convertir l'objet de la base de données en objet Campaign pour les fonctions de gestion
            const campaignObj: Campaign = {
              id: campaign.id,
              name: campaign.name,
              description: campaign.description || '',
              status: (campaign.status as 'active' | 'inactive' | 'completed') || 'active',
              gridId: campaign.grid_id,
              recordCount: stats.recordCount,
              evaluatedCount: stats.evaluatedCount,
              createdAt: campaign.created_at,
              updatedAt: campaign.updated_at
            };
            
            return (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <CardDescription className="mt-1">{formatDate(campaign.created_at)}</CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : campaign.status === 'inactive'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t(campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1))}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {campaign.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{stats.evaluatedCount} {t('of')} {stats.recordCount} {t('evaluated')}</span>
                      <span className="font-medium">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4 bg-muted/50">
                  <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaignObj)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('View')}
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaignObj)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCampaign(campaignObj)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && dbCampaigns.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t('No Campaigns Yet')}</p>
            <p className="text-muted-foreground mb-4">
              {t('Start by creating your first quality assessment campaign.')}
            </p>
            <Button onClick={handleAddCampaign}>
              <FileText className="h-4 w-4 mr-2" />
              {t('Create Campaign')}
            </Button>
          </CardContent>
        </Card>
      )}

      <CampaignEditDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveCampaign}
        campaign={currentCampaign}
        mode={dialogMode}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('This action will permanently delete the campaign')} "{currentCampaign?.name}" {t('and all associated data.')}
              {t('This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCampaign} className="bg-destructive text-destructive-foreground">
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
