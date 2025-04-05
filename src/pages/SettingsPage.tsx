
import React, { useState, useEffect } from 'react';
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

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: t('Profile updated'),
      description: t('Your profile information has been updated successfully.'),
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
          {t('Settings')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <TabsTrigger value="notifications">{t('Notifications')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('Name')}</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
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
              
              <TabsContent value="notifications">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {t('Configure your notification preferences')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('Coming soon...')}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('Preferences')}</CardTitle>
            <CardDescription>
              {t('Customize the appearance of your dashboard')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">
                  {t('Theme')}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {t('Coming soon...')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
