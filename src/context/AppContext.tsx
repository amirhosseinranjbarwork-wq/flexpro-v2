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

// Create a combined context for backward compatibility
const AppContext = React.createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider - Wraps UIProvider and DataProvider
 * This maintains backward compatibility while using the new architecture
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
 * Internal provider that combines UI and Data contexts
 */
const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ui = useUI();
  const data = useData();

  // Combine print functionality from UI with data
  const handlePrintPreview = (type: import('../types/index').PrintType) => {
    if (!data.activeUser) {
      // Show error if no active user
            return;
        }
    // Delegate to UI context - actual HTML generation should be done in components
    // that have access to activeUser and can call generatePrintHTML
    ui.handlePrintPreview(type, data.activeUser);
  };

  const value: AppContextType = {
    // Data from DataContext
    users: data.users,
    activeUser: data.activeUser,
    templates: data.templates,
    currentRole: data.currentRole,
    currentAccountId: data.currentAccountId,
    setCurrentRole: data.setCurrentRole,
    setCurrentAccountId: data.setCurrentAccountId,
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
