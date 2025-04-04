
import { useState } from 'react';
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

export default function CampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCampaignStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | undefined>();
  const [dialogMode, setDialogMode] = useState<'edit' | 'add'>('add');
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const confirmDeleteCampaign = () => {
    if (currentCampaign) {
      deleteCampaign(currentCampaign.id);
      toast({
        title: "Campaign deleted",
        description: `${currentCampaign.name} has been removed.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveCampaign = (campaignData: any) => {
    if (dialogMode === 'add') {
      addCampaign(campaignData);
      toast({
        title: "Campaign created",
        description: `${campaignData.name} has been created successfully.`,
      });
    } else if (currentCampaign) {
      updateCampaign(currentCampaign.id, campaignData);
      toast({
        title: "Campaign updated",
        description: `${campaignData.name} has been updated successfully.`,
      });
    }
    setIsEditDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">Campaigns</h1>
        <Button onClick={handleAddCampaign}>
          <FileText className="h-4 w-4 mr-2" />
          Add Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          const completionPercentage = Math.round((campaign.evaluatedCount / campaign.recordCount) * 100);
          
          return (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">{formatDate(campaign.createdAt)}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : campaign.status === 'inactive'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {campaign.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{campaign.evaluatedCount} of {campaign.recordCount} evaluated</span>
                    <span className="font-medium">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 bg-muted/50">
                <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaign)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCampaign(campaign)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No Campaigns Yet</p>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first quality assessment campaign.
            </p>
            <Button onClick={handleAddCampaign}>
              <FileText className="h-4 w-4 mr-2" />
              Create Campaign
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign "{currentCampaign?.name}" and all its associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCampaign} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
