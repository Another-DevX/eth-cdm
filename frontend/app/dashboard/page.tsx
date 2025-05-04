"use client";

import { AppProvider } from "@/lib/context";
import { ThemeProvider } from "@/lib/theme";
import { Register } from "@/components/Register";
import { Dashboard } from "@/components/Dashboard";
import { Liquidity } from "@/components/Liquidity";
import { Swap } from "@/components/Swap";
import { useApp } from "@/lib/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppKitAccount } from "@reown/appkit/react";

function MainContent() {
  const { isVerified } = useApp();
  const { isConnected } = useAppKitAccount();

  if (!isConnected || !isVerified) {
    return <Register />;
  }

  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="liquidity">Liquidity & Staking</TabsTrigger>
        <TabsTrigger value="swap">Swap</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <Dashboard />
      </TabsContent>
      <TabsContent value="liquidity">
        <Liquidity />
      </TabsContent>
      <TabsContent value="swap">
        <Swap />
      </TabsContent>
    </Tabs>
  );
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
