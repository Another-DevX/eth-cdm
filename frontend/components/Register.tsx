"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/lib/context";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { motion } from "framer-motion";
import { CheckCircle2, Wallet2, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

export function Register() {
  const { isVerified, setIsVerified, checkVerificationStatus } = useApp();
  const { open, close } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  // Check verification status when component mounts or wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      checkVerificationStatus(address);
    } else if (!isConnected) {
      // Reset verification status when wallet disconnects
      setIsVerified(false);
    }
  }, [isConnected, address, checkVerificationStatus, setIsVerified]);

  const handleVerify = async () => {
    if (isConnected && address) {
      await checkVerificationStatus(address);
    }
  };

  const handleConnectWallet = () => {
    open();
  };

  console.debug({ isConnected, isVerified });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Bienvenido a PlatoCoins
                  </h2>
                  <p className="text-xl opacity-90 text-purple-300">Tu plataforma de recompensas en Web3</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="w-full border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-black/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Comienza tu viaje
                </CardTitle>
                <p className="text-center text-purple-300">
                  Completa estos pasos para comenzar
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isConnected
                        ? "bg-green-500 text-white"
                        : "bg-purple-500/20 text-purple-500 border border-purple-500"
                      }`}>
                      {isConnected ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Wallet2 className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-medium text-white">Conectar Wallet</span>
                  </div>
                  <Button
                    onClick={handleConnectWallet}
                    className={`w-full transition-all duration-300 ${isConnected
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-purple-500 hover:bg-purple-600 border border-purple-400"
                      }`}
                  >
                    {isConnected ? "Wallet Conectada" : "Conectar Wallet"}
                  </Button>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isVerified
                        ? "bg-green-500 text-white"
                        : "bg-purple-500/20 text-purple-500 border border-purple-500"
                      }`}>
                      {isVerified ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-medium text-white">Verificar en Talent Protocol</span>
                  </div>
                  <Button
                    onClick={() => !isVerified && window.open('https://talentprotocol.com', '_blank')}
                    disabled={!isConnected || isVerified}
                    className={`w-full transition-all duration-300 ${isVerified
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-purple-500 hover:bg-purple-600 border border-purple-400"
                      }`}
                  >
                    {isVerified ? "Verificado" : "Verificar en Talent Protocol"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
