
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, FileText, ListChecks, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useCampaignStore } from '@/lib/campaigns';
import { useToast } from '@/components/ui/use-toast';
import { CampaignEditDialog } from '@/components/campaigns/CampaignEditDialog';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCampaign, updateCampaign } = useCampaignStore();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  const campaignId = parseInt(id || '0');
  const campaign = getCampaign(campaignId);
  
  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
          <Button onClick={() => navigate('/campaigns')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const completionPercentage = Math.round((campaign.evaluatedCount / campaign.recordCount) * 100);
  
  const handleSaveCampaign = (updatedCampaign: any) => {
    updateCampaign(campaignId, updatedCampaign);
    toast({
      title: "Campaign updated",
      description: "The campaign details have been updated successfully.",
    });
    setIsEditDialogOpen(false);
  };
  
  // Mock evaluation data
  const recentEvaluations = [
    { id: 1, name: "Call with John Smith", date: "Apr 2, 2025", score: 92 },
    { id: 2, name: "Email response to Sarah Johnson", date: "Apr 1, 2025", score: 85 },
    { id: 3, name: "Chat with Michael Brown", date: "Mar 30, 2025", score: 78 },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/campaigns')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-qa-charcoal">{campaign.name}</h1>
        </div>
        <Button onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                campaign.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : campaign.status === 'inactive'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                Created: {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{campaign.evaluatedCount} of {campaign.recordCount} evaluated</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Average Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">87%</div>
              <div className="ml-2 text-sm text-muted-foreground">(From evaluated records)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Campaign Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{campaign.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records">
            <TabsList className="mb-4">
              <TabsTrigger value="records">
                <FileText className="h-4 w-4 mr-2" />
                Records
              </TabsTrigger>
              <TabsTrigger value="evaluations">
                <ListChecks className="h-4 w-4 mr-2" />
                Evaluations
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="records">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">All Records</h4>
                    <Button size="sm">Assign Records</Button>
                  </div>
                  
                  <div className="text-center p-8 text-muted-foreground">
                    <p>Records will be displayed here</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="evaluations">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Recent Evaluations</h4>
                    <Button size="sm">View All</Button>
                  </div>
                  
                  <div className="divide-y">
                    {recentEvaluations.map(evaluation => (
                      <div key={evaluation.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{evaluation.name}</p>
                          <p className="text-sm text-muted-foreground">{evaluation.date}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            evaluation.score >= 90 ? 'bg-green-100 text-green-800' :
                            evaluation.score >= 80 ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {evaluation.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="text-center p-8 text-muted-foreground">
                <p>Analytics and reporting features coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <CampaignEditDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveCampaign}
        campaign={campaign}
        mode="edit"
      />
    </DashboardLayout>
  );
}
