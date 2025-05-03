"use client";

import { AppProvider } from "@/lib/context";
import { ThemeProvider } from "@/lib/theme";
import { Register } from "@/components/Register";
import { Dashboard } from "@/components/Dashboard";
import { useApp } from "@/lib/context";

function MainContent() {
  const { isWalletConnected, isVerified } = useApp();

  if (!isWalletConnected || !isVerified) {
    return <Register />;
  }

  return <Dashboard />;
}

export default function Home() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}
