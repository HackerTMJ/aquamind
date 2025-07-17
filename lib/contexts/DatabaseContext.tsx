import React, { createContext, useContext, useState } from 'react';

interface DatabaseContextType {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isReady: true, // Always ready with AsyncStorage
});

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  // With AsyncStorage, we're always ready - no initialization needed
  const [isReady] = useState(true);

  return <DatabaseContext.Provider value={{ isReady }}>{children}</DatabaseContext.Provider>;
};
