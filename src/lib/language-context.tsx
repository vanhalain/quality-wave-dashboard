
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the available languages
export type Language = 'fr' | 'en';

// Create a context to store the language state
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const defaultValue: LanguageContextType = {
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Dashboard
    'Dashboard': 'Tableau de bord',
    'Campaigns': 'Campagnes',
    'Evaluations': 'Évaluations',
    'Grids': 'Grilles',
    'Users': 'Utilisateurs',
    'Settings': 'Paramètres',
    'Search': 'Rechercher',
    // Grid pages
    'Evaluation Grids': 'Grilles d\'évaluation',
    'Create Grid': 'Créer une grille',
    'View': 'Voir',
    'questions': 'questions',
    'Last modified': 'Dernière modification',
    'No grids': 'Aucune grille',
    'Start by creating your first evaluation grid.': 'Commencez par créer votre première grille d\'évaluation.',
    'Are you sure?': 'Êtes-vous sûr ?',
    'This action will permanently delete the grid': 'Cette action supprimera définitivement la grille',
    'and all associated data.': 'et toutes ses données associées.',
    'This action cannot be undone.': 'Cette action est irréversible.',
    'Cancel': 'Annuler',
    'Delete': 'Supprimer',
    'Grid deleted': 'Grille supprimée',
    'has been deleted.': 'a été supprimée.',
    // Settings
    'Account Settings': 'Paramètres du compte',
    'Manage your account preferences': 'Gérez les préférences de votre compte',
    'Profile': 'Profil',
    'Password': 'Mot de passe',
    'Notifications': 'Notifications',
    'Name': 'Nom',
    'Save Changes': 'Enregistrer les modifications',
    'Current Password': 'Mot de passe actuel',
    'New Password': 'Nouveau mot de passe',
    'Confirm New Password': 'Confirmer le nouveau mot de passe',
    'Update Password': 'Mettre à jour le mot de passe',
    'Configure your notification preferences': 'Configurez vos préférences de notification',
    'Coming soon...': 'Bientôt disponible...',
    'Preferences': 'Préférences',
    'Customize the appearance of your dashboard': 'Personnalisez l\'apparence de votre tableau de bord',
    'Application Language': 'Langue de l\'application',
    'Theme': 'Thème',
    'Select language': 'Sélectionner une langue',
    'Choose your preferred language for the application interface.': 'Choisissez la langue que vous préférez pour l\'interface de l\'application.',
    'Language changed': 'Langue modifiée',
    'Application language has been set to English.': 'La langue de l\'application a été définie sur Anglais.',
    'Langue modifiée': 'Langue modifiée',
    'La langue de l\'application a été définie sur Français.': 'La langue de l\'application a été définie sur Français.',
    'Profile updated': 'Profil mis à jour',
    'Your profile information has been updated successfully.': 'Vos informations de profil ont été mises à jour avec succès.',
    'Password updated': 'Mot de passe mis à jour',
    'Your password has been updated successfully.': 'Votre mot de passe a été mis à jour avec succès.',
    'List of grids': 'Liste des grilles',
    'Grid Creator': 'Créateur de grille',
    'Administrator': 'Administrateur',
  },
  en: {
    // English translations have the same keys as values
    // Dashboard
    'Dashboard': 'Dashboard',
    'Campaigns': 'Campaigns',
    'Evaluations': 'Evaluations',
    'Grids': 'Grids',
    'Users': 'Users',
    'Settings': 'Settings',
    'Search': 'Search',
    // Grid pages
    'Evaluation Grids': 'Evaluation Grids',
    'Create Grid': 'Create Grid',
    'View': 'View',
    'questions': 'questions',
    'Last modified': 'Last modified',
    'No grids': 'No grids',
    'Start by creating your first evaluation grid.': 'Start by creating your first evaluation grid.',
    'Are you sure?': 'Are you sure?',
    'This action will permanently delete the grid': 'This action will permanently delete the grid',
    'and all associated data.': 'and all associated data.',
    'This action cannot be undone.': 'This action cannot be undone.',
    'Cancel': 'Cancel',
    'Delete': 'Delete',
    'Grid deleted': 'Grid deleted',
    'has been deleted.': 'has been deleted.',
    // Settings
    'Account Settings': 'Account Settings',
    'Manage your account preferences': 'Manage your account preferences',
    'Profile': 'Profile',
    'Password': 'Password',
    'Notifications': 'Notifications',
    'Name': 'Name',
    'Save Changes': 'Save Changes',
    'Current Password': 'Current Password',
    'New Password': 'New Password',
    'Confirm New Password': 'Confirm New Password',
    'Update Password': 'Update Password',
    'Configure your notification preferences': 'Configure your notification preferences',
    'Coming soon...': 'Coming soon...',
    'Preferences': 'Preferences',
    'Customize the appearance of your dashboard': 'Customize the appearance of your dashboard',
    'Application Language': 'Application Language',
    'Theme': 'Theme',
    'Select language': 'Select language',
    'Choose your preferred language for the application interface.': 'Choose your preferred language for the application interface.',
    'Language changed': 'Language changed',
    'Application language has been set to English.': 'Application language has been set to English.',
    'Langue modifiée': 'Language changed',
    'La langue de l\'application a été définie sur Français.': 'Application language has been set to French.',
    'Profile updated': 'Profile updated',
    'Your profile information has been updated successfully.': 'Your profile information has been updated successfully.',
    'Password updated': 'Password updated',
    'Your password has been updated successfully.': 'Your password has been updated successfully.',
    'List of grids': 'List of grids',
    'Grid Creator': 'Grid Creator',
    'Administrator': 'Administrator',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or default to French
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('appLanguage') as Language;
    return (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) ? savedLanguage : 'fr';
  });

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Update language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('appLanguage', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
