'use client';

import { AppProvider } from '@/lib/context';
import { ThemeProvider } from '@/lib/theme';
import { Register } from '@/components/Register';
import { Dashboard } from '@/components/Dashboard';
import { Liquidity } from '@/components/Liquidity';
import { Swap } from '@/components/Swap';
import { useApp } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppKitAccount } from '@reown/appkit/react';
import { Navbar } from '@/components/Navbar';
import { useState } from 'react';

function MainContent() {
  const { isVerified } = useApp();
  const { isConnected } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isConnected || !isVerified) {
    return <Register />;
  }

  return (
    <>
      <Navbar onTabChange={setActiveTab} />
      <Tabs value={activeTab} defaultValue='dashboard' className='w-full'>
        <TabsContent value='dashboard'>
          <Dashboard />
        </TabsContent>
        <TabsContent value='liquidity'>
          <Liquidity />
        </TabsContent>
        <TabsContent value='swap'>
          <Swap />
        </TabsContent>
      </Tabs>
    </>
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
