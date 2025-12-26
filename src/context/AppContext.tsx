/* eslint-disable react-refresh/only-export-components */
/**
 * AppContext - Legacy wrapper for backward compatibility
 * This file provides a unified interface combining UIContext and DataContext
 * New code should use useUI() and useData() directly instead of useApp()
 */
import React from 'react';
import { UIProvider, useUI } from './UIContext';
import { DataProvider, useData } from './DataContext';
import type { AppContextType } from '../types/index';
import { generateTrainingProgramHTML, generateNutritionProgramHTML, generateSupplementProgramHTML } from '../utils/printGenerators';

// Create a combined context for backward compatibility
const AppContext = React.createContext<AppContextType | undefined>(undefined);

/**
 * Internal provider that combines UI and Data contexts
 * MUST be defined BEFORE AppProvider since it's not hoisted as const
 */
const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ui = useUI();
  const data = useData();

  // Combine print functionality from UI with data
  const handlePrintPreview = (type: import('../types/index').PrintType) => {
    if (!data.activeUser) {
      return;
    }
    
    let html = '';
    let title = 'چاپ';
    switch(type) {
      case 'training':
        html = generateTrainingProgramHTML(data.activeUser);
        title = 'پرینت برنامه تمرینی';
        break;
      case 'nutrition':
        html = generateNutritionProgramHTML(data.activeUser);
        title = 'پرینت برنامه غذایی';
        break;
      case 'supplements':
        html = generateSupplementProgramHTML(data.activeUser);
        title = 'پرینت برنامه مکمل';
        break;
      default:
        html = '<div>نوع برنامه نامشخص است</div>';
        title = 'چاپ';
    }
    
    // Update UI with generated HTML
    ui.handlePrintPreview(type, html, title);
  };

  const value: AppContextType = {
    // Data from DataContext
    users: data.users,
    activeUser: data.activeUser,
    selectedClientId: data.selectedClientId,
    templates: data.templates,
    currentRole: data.currentRole,
    currentAccountId: data.currentAccountId,
    setCurrentRole: data.setCurrentRole,
    setCurrentAccountId: data.setCurrentAccountId,
    setSelectedClientId: data.setSelectedClientId,
    setActiveUserId: data.setActiveUserId,
    hasPermission: data.hasPermission,
    saveUser: data.saveUser,
    deleteUser: data.deleteUser,
    updateActiveUser: data.updateActiveUser,
    saveTemplate: data.saveTemplate,
    deleteTemplate: data.deleteTemplate,
    logoutUser: data.logoutUser,
    resetSystem: data.resetSystem,
    backupData: data.backupData,
    restoreData: data.restoreData,

    // UI from UIContext
    currentTab: ui.currentTab,
    theme: ui.theme,
    setCurrentTab: ui.setCurrentTab,
    toggleTheme: ui.toggleTheme,

    // Print functionality
    printData: ui.printData,
    handlePrintPreview,
    closePrintModal: ui.closePrintModal,
    downloadPDF: ui.downloadPDF
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * AppProvider - Wraps UIProvider and DataProvider
 * This maintains backward compatibility while using the new architecture
 * Defined AFTER AppContextProvider since it uses it
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <DataProvider>
        <AppContextProvider>{children}</AppContextProvider>
      </DataProvider>
    </UIProvider>
  );
};

/**
 * useApp - Legacy hook for backward compatibility
 * @deprecated Use useUI() and useData() instead
 */
export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Export helper functions that were previously in AppContext
export { mapClientToUser } from './DataContext';
