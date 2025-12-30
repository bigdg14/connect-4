"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MenuButtonProps {
  onClick: () => void;
  children: ReactNode;
  gradient: string;
  icon?: ReactNode;
}

export default function MenuButton({
  onClick,
  children,
  gradient,
  icon,
}: MenuButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        w-full px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4
        rounded-lg sm:rounded-xl
        font-bold text-base sm:text-lg text-white
        ${gradient}
        shadow-xl hover:shadow-2xl
        transition-all duration-200
        flex items-center justify-center gap-2 sm:gap-3
      `}
    >
      {icon && <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>}
      {children}
    </motion.button>
  );
}
