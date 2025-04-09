
import React from 'react';
import { CampaignCard } from './CampaignCard';
import { CampaignEmptyState } from './CampaignEmptyState';
import { Campaign } from '@/lib/campaigns';
import { Tables } from '@/integrations/supabase/types';
import { useLanguage } from '@/lib/language-context';

interface CampaignListProps {
  campaigns: Tables<'campaigns'>[];
  isLoading: boolean;
  onView: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onCreateCampaign: () => void;
}

export function CampaignList({ 
  campaigns, 
  isLoading, 
  onView, 
  onEdit, 
  onDelete,
  onCreateCampaign
}: CampaignListProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>{t('Loading')}...</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return <CampaignEmptyState onCreateCampaign={onCreateCampaign} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
