
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Campaign } from '@/lib/campaigns';
import { useGridStore } from '@/lib/evaluation-grids';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/hooks/use-toast';

interface CampaignFormData {
  id?: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  recordCount?: number;
  evaluatedCount?: number;
  gridId?: number | null;
}

interface CampaignEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (campaign: CampaignFormData) => void;
  campaign?: Campaign;
  mode: 'edit' | 'add';
}

export function CampaignEditDialog({ open, onClose, onSave, campaign, mode }: CampaignEditDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CampaignFormData>({
    id: campaign?.id,
    name: campaign?.name || '',
    description: campaign?.description || '',
    status: campaign?.status || 'active',
    recordCount: campaign?.recordCount || 0,
    evaluatedCount: campaign?.evaluatedCount || 0,
    gridId: campaign?.gridId || null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { grids } = useGridStore();

  useEffect(() => {
    if (campaign) {
      setFormData({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        recordCount: campaign.recordCount,
        evaluatedCount: campaign.evaluatedCount,
        gridId: campaign.gridId || null,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        recordCount: 0,
        evaluatedCount: 0,
        gridId: null,
      });
    }
  }, [campaign, open]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: t('Validation Error'),
        description: t('Campaign name is required'),
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t('Error'),
        description: t('Failed to save campaign. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === 'add' ? t('Add New Campaign') : t('Edit Campaign')}</DialogTitle>
            <DialogDescription>
              {mode === 'add' 
                ? t('Create a new quality assessment campaign') 
                : t('Make changes to the campaign details')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('Name')}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                {t('Description')}
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
                {t('Status')}
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive' | 'completed') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('Select status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('Active')}</SelectItem>
                  <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                  <SelectItem value="completed">{t('Completed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gridId" className="text-right">
                {t('Grid')}
              </Label>
              <Select 
                value={formData.gridId?.toString() || "null"} 
                onValueChange={(value) => 
                  setFormData({ ...formData, gridId: value === "null" ? null : parseInt(value) })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('Select a grid')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">{t('None')}</SelectItem>
                  {grids.map(grid => (
                    <SelectItem key={grid.id} value={grid.id.toString()}>
                      {grid.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {mode === 'add' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recordCount" className="text-right">
                  {t('Records')}
                </Label>
                <Input
                  id="recordCount"
                  type="number"
                  min="0"
                  value={formData.recordCount || 0}
                  onChange={(e) => setFormData({ ...formData, recordCount: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('Saving...') : mode === 'add' ? t('Create Campaign') : t('Save Changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
