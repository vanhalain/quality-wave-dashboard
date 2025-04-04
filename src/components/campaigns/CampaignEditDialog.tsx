
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Campaign } from '@/lib/campaigns';

interface CampaignFormData {
  id?: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  recordCount?: number;
  evaluatedCount?: number;
}

interface CampaignEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (campaign: CampaignFormData) => void;
  campaign?: Campaign;
  mode: 'edit' | 'add';
}

export function CampaignEditDialog({ open, onClose, onSave, campaign, mode }: CampaignEditDialogProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    id: campaign?.id,
    name: campaign?.name || '',
    description: campaign?.description || '',
    status: campaign?.status || 'active',
    recordCount: campaign?.recordCount,
    evaluatedCount: campaign?.evaluatedCount,
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        recordCount: campaign.recordCount,
        evaluatedCount: campaign.evaluatedCount,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        recordCount: 0,
        evaluatedCount: 0,
      });
    }
  }, [campaign, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === 'add' ? 'Add New Campaign' : 'Edit Campaign'}</DialogTitle>
            <DialogDescription>
              {mode === 'add' 
                ? 'Create a new quality assessment campaign' 
                : 'Make changes to the campaign details'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive' | 'completed') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {mode === 'add' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recordCount" className="text-right">
                  Records
                </Label>
                <Input
                  id="recordCount"
                  type="number"
                  value={formData.recordCount || 0}
                  onChange={(e) => setFormData({ ...formData, recordCount: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">{mode === 'add' ? 'Create Campaign' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
