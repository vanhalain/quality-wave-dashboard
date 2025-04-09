
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Edit, Trash } from 'lucide-react';
import { Campaign } from '@/lib/campaigns';
import { useLanguage } from '@/lib/language-context';
import { Tables } from '@/integrations/supabase/types';

interface CampaignCardProps {
  campaign: Tables<'campaigns'>;
  onView: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onView, onEdit, onDelete }: CampaignCardProps) {
  const { t } = useLanguage();
  
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      localStorage.getItem('appLanguage') === 'fr' ? 'fr-FR' : 'en-US', 
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };
  
  // Calculer des statistiques simulées pour les campagnes dynamiques
  const getSimulatedStats = (campaign: Tables<'campaigns'>) => {
    // Générer des valeurs aléatoires basées sur l'ID pour la stabilité
    const seed = campaign.id || 1;
    const recordCount = Math.max(5, seed * 3 + 10);
    const evaluatedCount = Math.floor(recordCount * (0.1 + (seed % 10) / 10));
    
    return {
      recordCount,
      evaluatedCount
    };
  };
  
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
    <Card className="overflow-hidden">
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
        <Button variant="ghost" size="sm" onClick={() => onView(campaignObj)}>
          <Eye className="h-4 w-4 mr-2" />
          {t('View')}
        </Button>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(campaignObj)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(campaignObj)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
