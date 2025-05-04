"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, AlertCircle, Coins, ArrowRightLeft, TrendingUp, Sparkles, Zap, Rocket } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";
import { redeemPlatoCoins } from "@/services/stakingPool";
import { toast } from "sonner";
import { getPlatoCoinBalance, approvePlatoCoin } from "@/services/platoCoin";
import { formatEther } from "viem";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Datos mockeados
const MOCK_EXCHANGE_RATE = 1; // 1 PlatoToken = 1 ASTR

const floatingElements = [
  { icon: <Sparkles className="w-4 h-4 text-purple-500" />, delay: 0 },
  { icon: <Zap className="w-4 h-4 text-yellow-500" />, delay: 0.2 },
  { icon: <Rocket className="w-4 h-4 text-pink-500" />, delay: 0.4 },
];

export function Swap() {
  const [platoAmount, setPlatoAmount] = useState<string>("");
  const [astrAmount, setAstrAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { data: platoCoinBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['platoCoinBalance', address],
    queryFn: () => getPlatoCoinBalance(address as `0x${string}`),
    enabled: !!address,
  });

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: async () => {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      if (!platoAmount || isNaN(Number(platoAmount))) {
        throw new Error("Invalid amount");
      }

      const amountBigInt = BigInt(Math.floor(Number(platoAmount) * 1e18));
      return await approvePlatoCoin(amountBigInt, address, walletClient);
    },
    onSuccess: () => {
      toast("Approval successful");
      setShowApprovalModal(false);
      setShowRedeemModal(true);
    },
    onError: (error) => {
      toast.error("Approval failed");
      console.error("Error approving:", error);
    },
  });

  const { mutate: redeem, isPending: isRedeeming } = useMutation({
    mutationFn: async () => {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      if (!platoAmount || isNaN(Number(platoAmount))) {
        throw new Error("Invalid amount");
      }

      const amountBigInt = BigInt(Math.floor(Number(platoAmount) * 1e18));
      return await redeemPlatoCoins(amountBigInt, address, walletClient);
    },
    onSuccess: () => {
      toast("Successfully redeemed PlatoCoins");
      setPlatoAmount("");
      setAstrAmount("");
      setShowRedeemModal(false);
    },
    onError: (error) => {
      toast.error("Failed to redeem PlatoCoins");
      console.error("Error redeeming:", error);
    },
  });

  const handlePlatoChange = (value: string) => {
    setPlatoAmount(value);
    if (value) {
      const amount = parseFloat(value);
      if (isNaN(amount)) {
        setAstrAmount("");
        setError("Please enter a valid number");
        return;
      }
      setAstrAmount((amount * MOCK_EXCHANGE_RATE).toFixed(2));
      if (platoCoinBalance && BigInt(Math.floor(amount * 1e18)) > platoCoinBalance) {
        setError("Insufficient balance");
      } else {
        setError("");
      }
    } else {
      setAstrAmount("");
      setError("");
    }
  };

  const handleSwap = () => {
    setShowApprovalModal(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden">

      <div className="w-full max-w-md relative m z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative"
        >
          {/* Logo de Plato flotante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 z-20 mb-4"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-32 h-32"
            >
              <Image
                src="https://raw.githubusercontent.com/cypherplatxs/web/main/public/logo-cypherplatxs-unscreen.gif"
                alt="Plato Logo"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                priority
              />
            </motion.div>
          </motion.div>

          <Card className="border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300">
            <CardHeader className="border-b border-purple-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ArrowRightLeft className="w-6 h-6 text-purple-500" />
                  </motion.div>
                  <CardTitle className="text-foreground">Swap Tokens</CardTitle>
                </div>
                <div className="flex items-center space-x-1 text-sm text-purple-300">
                  <Coins className="w-4 h-4" />
                  <span>
                    {isLoadingBalance ? (
                      <Skeleton className="h-4 w-16 bg-purple-500/20" />
                    ) : (
                      `Balance: ${Number(formatEther(platoCoinBalance || BigInt(0))).toFixed(2)} PT`
                    )}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                {/* PlatoToken Input */}
                <motion.div 
                  className="flex flex-col space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="text-sm text-purple-300">From</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={platoAmount}
                        onChange={(e) => handlePlatoChange(e.target.value)}
                        placeholder="0.0"
                        className="border-purple-500/30 focus:border-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 font-medium">
                        PT
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-purple-500 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer"
                      onClick={() => {
                        if (platoCoinBalance) {
                          setPlatoAmount(formatEther(platoCoinBalance));
                          setAstrAmount(formatEther(platoCoinBalance));
                        }
                      }}
                    >
                      MAX
                    </Button>
                  </div>
                </motion.div>

                {/* Arrow Down Icon */}
                <div className="flex justify-center">
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center cursor-pointer hover:bg-purple-500/20 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowDown className="w-5 h-5 text-purple-500" />
                  </motion.div>
                </div>

                {/* ASTR Input */}
                <motion.div 
                  className="flex flex-col space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="text-sm text-purple-300">To</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={astrAmount}
                      readOnly
                      placeholder="0.0"
                      className="border-purple-500/30 focus:border-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 font-medium">
                      ASTR
                    </div>
                  </div>
                </motion.div>

                {/* Exchange Rate */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center space-x-2 text-sm text-purple-300 p-3 bg-purple-500/5 rounded-lg"
                >
                  <div className="flex items-center space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Coins className="w-4 h-4" />
                    </motion.div>
                    <span>1 PT</span>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </motion.div>
                  <div className="flex items-center space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <Coins className="w-4 h-4" />
                    </motion.div>
                    <span>1 ASTR</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </motion.div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center text-red-500 text-sm p-2 bg-red-500/5 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </motion.div>
                )}

                {/* Swap Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSwap}
                    disabled={!platoAmount || !!error || !address || isRedeeming}
                    className="w-full bg-purple-500/90 hover:bg-purple-500 border border-purple-400/50 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative z-10"
                    >
                      {isRedeeming ? "Redeeming..." : "Redeem PlatoCoins"}
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve PlatoCoins</DialogTitle>
            <DialogDescription>
              You need to approve the contract to redeem your PlatoCoins.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowApprovalModal(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => approve()}
              disabled={isApproving}
              className="cursor-pointer"
            >
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Redeem Modal */}
      <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redeem</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem {platoAmount} PlatoCoins for {astrAmount} ASTR?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRedeemModal(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => redeem()}
              disabled={isRedeeming}
              className="cursor-pointer"
            >
              {isRedeeming ? "Redeeming..." : "Confirm Redeem"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Elementos flotantes */}
      <AnimatePresence>
        {isHovered && floatingElements.map((element, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100, x: Math.random() * 200 - 100 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [-100, -200],
              x: [Math.random() * 200 - 100, Math.random() * 400 - 200]
            }}
            transition={{ 
              duration: 2,
              delay: element.delay,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute z-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 