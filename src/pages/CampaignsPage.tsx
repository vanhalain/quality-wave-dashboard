
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Campaign, useCampaignStore } from '@/lib/campaigns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function CampaignsPage() {
  const { campaigns, addCampaign } = useCampaignStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    recordCount: 0,
    evaluatedCount: 0,
  });
  const { toast } = useToast();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as 'active' | 'inactive' | 'completed' }));
  };

  const handleRecordCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setFormData((prev) => ({ ...prev, recordCount: value }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Campaign name is required",
      });
      return;
    }

    addCampaign({
      name: formData.name,
      description: formData.description,
      status: formData.status as 'active' | 'inactive' | 'completed',
      recordCount: formData.recordCount,
      evaluatedCount: 0,
    });

    toast({
      title: "Campaign created",
      description: `${formData.name} has been created successfully`,
    });

    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      status: 'active',
      recordCount: 0,
      evaluatedCount: 0,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'qa-status-active';
      case 'inactive':
        return 'qa-status-inactive';
      case 'completed':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'qa-status-inactive';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">Campaigns</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange}
                  placeholder="Enter campaign name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleFormChange}
                  placeholder="Enter campaign description" 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordCount">Total Records</Label>
                <Input 
                  id="recordCount" 
                  name="recordCount" 
                  type="number"
                  value={formData.recordCount.toString()} 
                  onChange={handleRecordCountChange}
                  min={0}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Save Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="qa-card">
        <div className="overflow-x-auto">
          <table className="qa-table">
            <thead>
              <tr>
                <th className="rounded-tl-md">Campaign Name</th>
                <th>Status</th>
                <th>Created</th>
                <th>Progress</th>
                <th className="rounded-tr-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign: Campaign) => (
                <tr key={campaign.id} className="hover:bg-muted/50">
                  <td className="font-medium">{campaign.name}</td>
                  <td>
                    <span className={getStatusClass(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(campaign.createdAt)}</td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-qa-blue h-2.5 rounded-full" 
                          style={{ width: `${(campaign.evaluatedCount / campaign.recordCount) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {campaign.evaluatedCount} / {campaign.recordCount}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/campaigns/${campaign.id}`}>View</a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/campaigns/${campaign.id}/edit`}>Edit</a>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
