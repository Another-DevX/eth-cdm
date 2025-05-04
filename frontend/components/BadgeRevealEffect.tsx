"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BadgeRevealEffectProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  badgeIcon: React.ReactNode;
}

export function BadgeRevealEffect({
  isOpen,
  onClose,
  badgeName,
  badgeIcon,
}: BadgeRevealEffectProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative z-20 text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6"
            >
              {badgeIcon}
            </motion.div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Congratulations!
            </h2>
            <p className="text-white/80 text-lg mb-6">
              You've claimed the badge: {badgeName}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-500/50 text-white rounded-lg hover:bg-purple-500/70 transition-colors backdrop-blur-sm border border-white/20"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 