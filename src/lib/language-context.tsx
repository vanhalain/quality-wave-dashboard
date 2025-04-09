
import React, { createContext, useContext, useState } from 'react';

// Define the available languages
export type Language = 'en' | 'fr';

// Create a context to store the language state
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  addTranslation: (lang: Language, key: string, value: string) => void;
  updateTranslation: (lang: Language, key: string, value: string) => void;
  getAllTranslations: () => Record<string, Record<string, string>>;
}

const defaultValue: LanguageContextType = {
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  addTranslation: () => {},
  updateTranslation: () => {},
  getAllTranslations: () => ({ en: {}, fr: {} }),
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
    'Only administrators can change user roles.': 'Only administrators can change user roles.',
    'Only administrators can reset user passwords.': 'Only administrators can reset user passwords.',
    'Update User Password': 'Update User Password',
    'Set a new password for the user.': 'Set a new password for the user.',
    'New password': 'New password',
    'Set Password': 'Set Password',
    'Setting...': 'Setting...',
    'Password Updated': 'Password Updated',
    'The user password has been updated successfully.': 'The user password has been updated successfully.',
    'Failed to Update Password': 'Failed to Update Password',
    'An error occurred while updating the password.': 'An error occurred while updating the password.',
    'Role Updated': 'Role Updated',
    'User role has been updated successfully.': 'User role has been updated successfully.',
    'Update Failed': 'Update Failed',
    'Failed to update user role.': 'Failed to update user role.',
    'User Management': 'User Management',
    'Manage user roles and permissions': 'Manage user roles and permissions',
    'Users': 'Users',
    'Roles': 'Roles',
    'Status': 'Status',
    'Actions': 'Actions',
    'active': 'active',
    'admin': 'admin',
    'quality_controller': 'quality_controller',
    'manager': 'manager',
    'Select role': 'Select role',
    'Note: Only administrators can change user roles and edit users.': 'Note: Only administrators can change user roles and edit users.',
    'Set New Password': 'Set New Password',
    // Translation Manager
    'Translation Manager': 'Translation Manager',
    'Manage application translations': 'Manage application translations',
    'Add Translation': 'Add Translation',
    'Key': 'Key',
    'English': 'English',
    'French': 'French',
    'Add': 'Add',
    'Edit': 'Edit',
    'Save': 'Save',
    'Translation added': 'Translation added',
    'Translation updated': 'Translation updated',
    'Translation key already exists': 'Translation key already exists',
    'Please fill in all fields': 'Please fill in all fields',
    'Filter translations': 'Filter translations',
    'No results found': 'No results found',
    'Try a different search term or clear filters': 'Try a different search term or clear filters',
    'Export Translations': 'Export Translations',
    'Import Translations': 'Import Translations',
    'Edit Translation': 'Edit Translation',
    'Edit the translation values for this key': 'Edit the translation values for this key',
    'Add a new translation key and its values': 'Add a new translation key and its values',
    'My Profile': 'My Profile',
    'Logout': 'Logout',
    'Full access to all features including user management and system configuration.': 'Full access to all features including user management and system configuration.',
    'Can create and manage evaluations, view records, and access quality reports.': 'Can create and manage evaluations, view records, and access quality reports.',
    'Can view evaluation results, create campaigns, and manage team performance.': 'Can view evaluation results, create campaigns, and manage team performance.',
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
    'Application language has been set to English.': 'La langue de l\'application a été définie sur Français.',
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
    'Only administrators can change user roles.': 'Seuls les administrateurs peuvent modifier les rôles des utilisateurs.',
    'Only administrators can reset user passwords.': 'Seuls les administrateurs peuvent réinitialiser les mots de passe des utilisateurs.',
    'Update User Password': 'Mettre à jour le mot de passe',
    'Set a new password for the user.': 'Définir un nouveau mot de passe pour l\'utilisateur.',
    'New password': 'Nouveau mot de passe',
    'Set Password': 'Définir le mot de passe',
    'Setting...': 'Configuration en cours...',
    'Password Updated': 'Mot de passe mis à jour',
    'The user password has been updated successfully.': 'Le mot de passe de l\'utilisateur a été mis à jour avec succès.',
    'Failed to Update Password': 'Échec de la mise à jour du mot de passe',
    'An error occurred while updating the password.': 'Une erreur s\'est produite lors de la mise à jour du mot de passe.',
    'Role Updated': 'Rôle mis à jour',
    'User role has been updated successfully.': 'Le rôle de l\'utilisateur a été mis à jour avec succès.',
    'Update Failed': 'Échec de la mise à jour',
    'Failed to update user role.': 'Échec de la mise à jour du rôle de l\'utilisateur.',
    'User Management': 'Gestion des utilisateurs',
    'Manage user roles and permissions': 'Gérer les rôles et les permissions des utilisateurs',
    'Users': 'Utilisateurs',
    'Roles': 'Rôles',
    'Status': 'Statut',
    'Actions': 'Actions',
    'active': 'actif',
    'admin': 'administrateur',
    'quality_controller': 'contrôleur qualité',
    'manager': 'gestionnaire',
    'Select role': 'Sélectionner un rôle',
    'Note: Only administrators can change user roles and edit users.': 'Remarque : Seuls les administrateurs peuvent modifier les rôles et éditer les utilisateurs.',
    'Set New Password': 'Définir un nouveau mot de passe',
    // Translation Manager
    'Translation Manager': 'Gestionnaire de traductions',
    'Manage application translations': 'Gérer les traductions de l\'application',
    'Add Translation': 'Ajouter une traduction',
    'Key': 'Clé',
    'English': 'Anglais',
    'French': 'Français',
    'Add': 'Ajouter',
    'Edit': 'Modifier',
    'Save': 'Enregistrer',
    'Translation added': 'Traduction ajoutée',
    'Translation updated': 'Traduction mise à jour',
    'Translation key already exists': 'La clé de traduction existe déjà',
    'Please fill in all fields': 'Veuillez remplir tous les champs',
    'Filter translations': 'Filtrer les traductions',
    'No results found': 'Aucun résultat trouvé',
    'Try a different search term or clear filters': 'Essayez un autre terme de recherche ou effacez les filtres',
    'Export Translations': 'Exporter les traductions',
    'Import Translations': 'Importer les traductions',
    'Edit Translation': 'Modifier la traduction',
    'Edit the translation values for this key': 'Modifier les valeurs de traduction pour cette clé',
    'Add a new translation key and its values': 'Ajouter une nouvelle clé de traduction et ses valeurs',
    'My Profile': 'Mon profil',
    'Logout': 'Déconnexion',
    'Full access to all features including user management and system configuration.': 'Accès complet à toutes les fonctionnalités, y compris la gestion des utilisateurs et la configuration du système.',
    'Can create and manage evaluations, view records, and access quality reports.': 'Peut créer et gérer des évaluations, consulter des enregistrements et accéder aux rapports de qualité.',
    'Can view evaluation results, create campaigns, and manage team performance.': 'Peut consulter les résultats des évaluations, créer des campagnes et gérer les performances de l\'équipe.',
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

  // State to store translations
  const [translationsState, setTranslationsState] = useState(translations);

  // Translation function
  const t = (key: string): string => {
    return translationsState[language][key] || key;
  };

  // Update language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('appLanguage', newLanguage);
  };

  // Add a new translation
  const addTranslation = (lang: Language, key: string, value: string) => {
    setTranslationsState(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  // Update an existing translation
  const updateTranslation = (lang: Language, key: string, value: string) => {
    setTranslationsState(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  // Get all translations
  const getAllTranslations = () => {
    return translationsState;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      addTranslation, 
      updateTranslation, 
      getAllTranslations 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
