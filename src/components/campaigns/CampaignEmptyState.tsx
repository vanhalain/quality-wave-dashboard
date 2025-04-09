
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, FileText } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface CampaignEmptyStateProps {
  onCreateCampaign: () => void;
}

export function CampaignEmptyState({ onCreateCampaign }: CampaignEmptyStateProps) {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center">
      <CardContent>
        <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">{t('No Campaigns Yet')}</p>
        <p className="text-muted-foreground mb-4">
          {t('Start by creating your first quality assessment campaign.')}
        </p>
        <Button onClick={onCreateCampaign}>
          <FileText className="h-4 w-4 mr-2" />
          {t('Create Campaign')}
        </Button>
      </CardContent>
    </Card>
  );
}
