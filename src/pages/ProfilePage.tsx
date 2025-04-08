
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Languages } from 'lucide-react';
import { useLanguage, Language } from '@/lib/language-context';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUserProfile({ name, email }).then((result) => {
      if (result.success) {
        toast({
          title: t('Profile updated'),
          description: t('Your profile information has been updated successfully.'),
        });
      } else {
        toast({
          variant: "destructive",
          title: t('Profile update failed'),
          description: result.message || t('An error occurred while updating your profile.'),
        });
      }
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: t('Password updated'),
      description: t('Your password has been updated successfully.'),
    });
  };

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    toast({
      title: t('Language changed'),
      description: value === 'fr' 
        ? t('La langue de l\'application a été définie sur Français.')
        : t('Application language has been set to English.'),
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">
          {t('My Profile')}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('Account Settings')}</CardTitle>
            <CardDescription>
              {t('Manage your account preferences')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">{t('Profile')}</TabsTrigger>
                <TabsTrigger value="password">{t('Password')}</TabsTrigger>
                <TabsTrigger value="language">{t('Language')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('Name')}</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('Role')}</Label>
                    <Input
                      id="role"
                      value={user?.role ? t(user.role.replace('_', ' ')) : ''}
                      readOnly
                      disabled
                    />
                  </div>
                  <Button type="submit">{t('Save Changes')}</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="password">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">
                      {t('Current Password')}
                    </Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">
                      {t('New Password')}
                    </Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      {t('Confirm New Password')}
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="submit">{t('Update Password')}</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="language">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Languages className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        {t('Application Language')}
                      </h3>
                    </div>
                    
                    <Select value={language} onValueChange={(value) => handleLanguageChange(value as Language)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('Select language')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <p className="text-sm text-muted-foreground">
                      {t('Choose your preferred language for the application interface.')}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
