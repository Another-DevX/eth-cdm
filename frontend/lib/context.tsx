"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  isWalletConnected: boolean;
  isVerified: boolean;
  setIsWalletConnected: (value: boolean) => void;
  setIsVerified: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isWalletConnected,
        isVerified,
        setIsWalletConnected,
        setIsVerified,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
} 