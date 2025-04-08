
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/language-context';

interface ResetPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
}

export function ResetPasswordDialog({ open, onClose, userEmail }: ResetPasswordDialogProps) {
  const { resetUserPassword } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [email, setEmail] = useState(userEmail || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await resetUserPassword(email);
      if (result.success) {
        toast({
          title: t('Password Reset Email Sent'),
          description: t('An email with password reset instructions has been sent to the user.'),
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: t('Failed to Send Reset Email'),
          description: result.message || t('An error occurred while sending the password reset email.'),
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
            <DialogTitle>{t('Reset User Password')}</DialogTitle>
            <DialogDescription>
              {t('Send a password reset email to the user.')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('Email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? t('Sending...') : t('Send Reset Email')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
