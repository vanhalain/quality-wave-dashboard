
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

// Type pour la langue
type Language = 'fr' | 'en';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  // État pour la langue sélectionnée, par défaut français
  const [language, setLanguage] = useState<Language>('fr');

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: language === 'fr' ? "Profil mis à jour" : "Profile updated",
      description: language === 'fr' 
        ? "Vos informations de profil ont été mises à jour avec succès."
        : "Your profile information has been updated successfully.",
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: language === 'fr' ? "Mot de passe mis à jour" : "Password updated",
      description: language === 'fr' 
        ? "Votre mot de passe a été mis à jour avec succès." 
        : "Your password has been updated successfully.",
    });
  };

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    toast({
      title: value === 'fr' ? "Langue modifiée" : "Language changed",
      description: value === 'fr' 
        ? "La langue de l'application a été définie sur Français." 
        : "Application language has been set to English.",
    });
    // Ici, vous pourriez éventuellement sauvegarder ce choix dans localStorage
    localStorage.setItem('appLanguage', value);
  };

  // Récupérer la langue au chargement si disponible
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">
          {language === 'fr' ? 'Paramètres' : 'Settings'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Paramètres du compte' : 'Account Settings'}</CardTitle>
            <CardDescription>
              {language === 'fr' ? 'Gérez les préférences de votre compte' : 'Manage your account preferences'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">{language === 'fr' ? 'Profil' : 'Profile'}</TabsTrigger>
                <TabsTrigger value="password">{language === 'fr' ? 'Mot de passe' : 'Password'}</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{language === 'fr' ? 'Nom' : 'Name'}</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <Button type="submit">{language === 'fr' ? 'Enregistrer les modifications' : 'Save Changes'}</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="password">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">
                      {language === 'fr' ? 'Mot de passe actuel' : 'Current Password'}
                    </Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">
                      {language === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                    </Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      {language === 'fr' ? 'Confirmer le nouveau mot de passe' : 'Confirm New Password'}
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="submit">{language === 'fr' ? 'Mettre à jour le mot de passe' : 'Update Password'}</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {language === 'fr' ? 'Configurez vos préférences de notification' : 'Configure your notification preferences'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Bientôt disponible...' : 'Coming soon...'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Préférences' : 'Preferences'}</CardTitle>
            <CardDescription>
              {language === 'fr' ? 'Personnalisez l\'apparence de votre tableau de bord' : 'Customize the appearance of your dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">
                  {language === 'fr' ? 'Langue de l\'application' : 'Application Language'}
                </h3>
              </div>
              
              <Select value={language} onValueChange={(value) => handleLanguageChange(value as Language)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={language === 'fr' ? 'Sélectionner une langue' : 'Select language'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-sm text-muted-foreground">
                {language === 'fr' 
                  ? 'Choisissez la langue que vous préférez pour l\'interface de l\'application.' 
                  : 'Choose your preferred language for the application interface.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">
                  {language === 'fr' ? 'Thème' : 'Theme'}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {language === 'fr' ? 'Bientôt disponible...' : 'Coming soon...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
