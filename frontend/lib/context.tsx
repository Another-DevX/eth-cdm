"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AppContextType {
  isVerified: boolean;
  setIsVerified: (value: boolean) => void;
  checkVerificationStatus: (walletAddress: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage key for persisting verification status
const VERIFICATION_KEY = "plato_verification_status";

export function AppProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(VERIFICATION_KEY);
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  // Persist verification status to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(VERIFICATION_KEY, JSON.stringify(isVerified));
    }
  }, [isVerified]);

  // Function to check verification status from API
  const checkVerificationStatus = async (walletAddress: string) => {
    if (!walletAddress) return;

    try {
      const response = await fetch(`/api/talent/user?address=${encodeURIComponent(walletAddress)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();


      console.log(data);
      if (response.ok) {
        // Assuming the API returns some indication of verification status
        // Adjust this logic based on your actual API response structure
        setIsVerified(!!data.user);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      setIsVerified(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isVerified,
        setIsVerified,
        checkVerificationStatus,
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
