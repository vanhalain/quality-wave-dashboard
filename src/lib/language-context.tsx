import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the available languages
export type Language = 'en' | 'fr';

// Create a context to store the language state
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const defaultValue: LanguageContextType = {
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
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
    // Evaluation page
    'Conversation Transcript': 'Conversation Transcript',
    'Review the agent-customer interaction': 'Review the agent-customer interaction',
    'Quality Assessment': 'Quality Assessment',
    'Evaluate the conversation based on criteria': 'Evaluate the conversation based on criteria',
    'Grid': 'Grid',
    'Evaluation': 'Evaluation',
    'Results': 'Results',
    'No grid selected': 'No grid selected',
    'Please select an evaluation grid for this campaign': 'Please select an evaluation grid for this campaign',
    'Configure campaign': 'Configure campaign',
    'Results will be displayed after submission': 'Results will be displayed after submission',
    'Submit Evaluation': 'Submit Evaluation',
    'Submitted': 'Submitted',
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
    'Reset Password': 'Reset Password',
    'Reset User Password': 'Reset User Password',
    'Send a password reset email to the user.': 'Send a password reset email to the user.',
    'Email': 'Email',
    'Cancel': 'Cancel',
    'Send Reset Email': 'Send Reset Email',
    'Sending...': 'Sending...',
    'Password Reset Email Sent': 'Password Reset Email Sent',
    'An email with password reset instructions has been sent to the user.': 'An email with password reset instructions has been sent to the user.',
    'Failed to Send Reset Email': 'Failed to Send Reset Email',
    'An error occurred while sending the password reset email.': 'An error occurred while sending the password reset email.',
    'Error': 'Error',
    'An unexpected error occurred.': 'An unexpected error occurred.',
    'Permission Denied': 'Permission Denied',
    'Only administrators can reset user passwords.': 'Only administrators can reset user passwords.',
  },
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
    // Evaluation page
    'Conversation Transcript': 'Transcription de la conversation',
    'Review the agent-customer interaction': 'Examinez l\'interaction agent-client',
    'Quality Assessment': 'Évaluation de la qualité',
    'Evaluate the conversation based on criteria': 'Évaluez la conversation selon les critères',
    'Grid': 'Grille',
    'Evaluation': 'Évaluation',
    'Results': 'Résultats',
    'No grid selected': 'Aucune grille sélectionnée',
    'Please select an evaluation grid for this campaign': 'Veuillez sélectionner une grille d\'évaluation pour cette campagne',
    'Configure campaign': 'Configurer la campagne',
    'Results will be displayed after submission': 'Les résultats seront affichés après la soumission',
    'Submit Evaluation': 'Soumettre l\'évaluation',
    'Submitted': 'Soumis',
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
    'Reset Password': 'Réinitialiser le mot de passe',
    'Reset User Password': 'Réinitialiser le mot de passe',
    'Send a password reset email to the user.': 'Envoyer un e-mail de réinitialisation du mot de passe à l\'utilisateur.',
    'Email': 'E-mail',
    'Cancel': 'Annuler',
    'Send Reset Email': 'Envoyer l\'e-mail de réinitialisation',
    'Sending...': 'Envoi en cours...',
    'Password Reset Email Sent': 'E-mail de réinitialisation envoyé',
    'An email with password reset instructions has been sent to the user.': 'Un e-mail avec des instructions de réinitialisation du mot de passe a été envoyé à l\'utilisateur.',
    'Failed to Send Reset Email': 'Échec de l\'envoi de l\'e-mail de réinitialisation',
    'An error occurred while sending the password reset email.': 'Une erreur s\'est produite lors de l\'envoi de l\'e-mail de réinitialisation du mot de passe.',
    'Error': 'Erreur',
    'An unexpected error occurred.': 'Une erreur inattendue s\'est produite.',
    'Permission Denied': 'Accès refusé',
    'Only administrators can reset user passwords.': 'Seuls les administrateurs peuvent réinitialiser les mots de passe des utilisateurs.',
  },
};

export interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
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
