"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";
import { Coins } from "lucide-react";

interface PlatoCoinsClaimEffectProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export function PlatoCoinsClaimEffect({
  isOpen,
  onClose,
  amount,
}: PlatoCoinsClaimEffectProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [236, 72, 153],
                [232, 121, 249],
              ]}
              dotSize={2}
            />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative z-20 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                rotate: { duration: 0.5 }
              }}
              className="mb-8"
            >
              <Coins className="w-24 h-24 text-purple-500" />
            </motion.div>
            <h2 className="text-white text-4xl font-bold mb-4">
              Congratulations!
            </h2>
            <p className="text-white text-2xl mb-8">
              You've claimed {amount} PlatoCoins
            </p>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-purple-500/50 text-white rounded-lg hover:bg-purple-500/70 transition-colors backdrop-blur-sm border border-white/20"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 