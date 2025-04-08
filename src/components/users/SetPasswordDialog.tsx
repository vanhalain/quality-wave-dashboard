
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/language-context';

interface SetPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export function SetPasswordDialog({ open, onClose, userId }: SetPasswordDialogProps) {
  const { setUserPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Password cannot be empty'),
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await setUserPassword(userId, newPassword);
      if (result.success) {
        toast({
          title: t('Password Updated'),
          description: t('The user password has been updated successfully.'),
        });
        setNewPassword('');
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: t('Failed to Update Password'),
          description: result.message || t('An error occurred while updating the password.'),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('An unexpected error occurred.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('Update User Password')}</DialogTitle>
            <DialogDescription>
              {t('Set a new password for the user.')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                {t('New password')}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('Setting...') : t('Set Password')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
