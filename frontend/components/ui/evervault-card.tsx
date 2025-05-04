"use client";
import { useMotionValue } from "motion/react";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const EvervaultCard = ({
  className,
  children,
  isHovered = false,
}: {
  className?: string;
  children: React.ReactNode;
  isHovered?: boolean;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isMouseHovered, setIsMouseHovered] = useState(false);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    let str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  useEffect(() => {
    if ((isHovered || isMouseHovered) && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      mouseX.set(centerX);
      mouseY.set(centerY);
      const str = generateRandomString(1500);
      setRandomString(str);
    }
  }, [isHovered, isMouseHovered]);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  return (
    <div
      className={cn(
        "p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsMouseHovered(true)}
        onMouseLeave={() => setIsMouseHovered(false)}
        className={cn(
          "group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full",
          isHovered && "hover"
        )}
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
          isHovered={isHovered || isMouseHovered}
        />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44  rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20">{children}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString, isHovered }: any) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className={cn(
        "absolute inset-0 rounded-3xl [mask-image:linear-gradient(white,transparent)]",
        isHovered ? "opacity-50" : "opacity-0"
      )}></div>
      <motion.div
        className={cn(
          "absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-700 backdrop-blur-xl transition duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={style}
      />
      <motion.div
        className={cn(
          "absolute inset-0 rounded-3xl mix-blend-overlay",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={style}
      >
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
