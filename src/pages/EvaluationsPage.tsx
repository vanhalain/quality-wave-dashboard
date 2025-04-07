
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TranscriptChat } from '@/components/evaluation/TranscriptChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormBuilder } from '@/components/evaluation/FormBuilder';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCampaignStore } from '@/lib/campaigns';
import { useGridStore } from '@/lib/evaluation-grids';
import { Grid2x2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function EvaluationsPage() {
  const navigate = useNavigate();
  const { campaigns } = useCampaignStore();
  const { getGrid } = useGridStore();
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock messages data
  const messages = [
    {
      id: 1,
      speaker: 'agent' as const,
      text: 'Hello, thank you for calling our customer service. How may I help you today?',
      timestamp: '14:32',
    },
    {
      id: 2,
      speaker: 'customer' as const,
      text: 'Hi, I have a question about my recent bill. There seems to be a charge I don\'t recognize.',
      timestamp: '14:33',
    },
    {
      id: 3,
      speaker: 'agent' as const,
      text: 'I\'d be happy to look into that for you. Could you please verify your account information first?',
      timestamp: '14:33',
    },
    {
      id: 4,
      speaker: 'customer' as const,
      text: 'Sure, my account number is 12345 and my name is John Doe.',
      timestamp: '14:34',
    },
    {
      id: 5,
      speaker: 'agent' as const,
      text: 'Thank you, Mr. Doe. I can see the charge you\'re referring to. This is for the additional service you requested last month.',
      timestamp: '14:35',
    },
  ];

  // Chercher une campagne avec une grille associée pour la démo
  const campaignWithGrid = campaigns.find(campaign => campaign.gridId);
  const selectedGrid = campaignWithGrid?.gridId ? getGrid(campaignWithGrid.gridId) : null;

  const handleSubmitEvaluation = () => {
    // Here would go the logic to submit the evaluation
    setIsSubmitted(true);
    // Reset after 3 seconds for demo purposes
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">{t('Evaluations')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('Conversation Transcript')}</CardTitle>
            <CardDescription>{t('Review the agent-customer interaction')}</CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptChat messages={messages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{t('Quality Assessment')}</CardTitle>
                <CardDescription>{t('Evaluate the conversation based on criteria')}</CardDescription>
              </div>
              {campaignWithGrid && selectedGrid && (
                <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
                  <Grid2x2 className="w-4 h-4 mr-1" />
                  {t('Grid')}: {selectedGrid.name}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form">
              <TabsList className="mb-4">
                <TabsTrigger value="form">{t('Evaluation')}</TabsTrigger>
                <TabsTrigger value="results">{t('Results')}</TabsTrigger>
              </TabsList>
              <TabsContent value="form">
                {selectedGrid ? (
                  <div>
                    <FormBuilder 
                      selectedGridId={selectedGrid.id} 
                      readOnly={false} 
                      onSubmit={handleSubmitEvaluation}
                    />
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={handleSubmitEvaluation} 
                        disabled={isSubmitted}
                      >
                        {isSubmitted ? t('Submitted') : t('Submit Evaluation')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-lg bg-muted/20">
                    <CheckCircle className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-2">{t('No grid selected')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('Please select an evaluation grid for this campaign')}
                    </p>
                    <Button variant="outline" onClick={() => navigate('/campaigns')}>
                      {t('Configure campaign')}
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="results">
                <div className="p-4 text-center text-muted-foreground">
                  {t('Results will be displayed after submission')}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
