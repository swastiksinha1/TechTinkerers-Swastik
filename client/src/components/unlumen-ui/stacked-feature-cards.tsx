"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StackedFeatureCard {
  name: string;
  description: string;
  icon?: React.ReactNode;
}

interface CardProps {
  index: number;
  item: StackedFeatureCard;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
  total: number;
}

const Card = ({ index, item, progress, range, targetScale, total }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // We want each card to have a slightly different top offset when stacked, 
  // so you can see the top edge of the cards behind it.
  // 10vh is the base padding from the top, + 30px per index.
  const topOffset = `calc(15vh + ${index * 30}px)`;

  return (
    <div 
      ref={containerRef} 
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{ 
          scale,
          top: topOffset,
        }}
        className={cn(
          "w-full max-w-[1000px] h-[550px] relative origin-top",
          "rounded-3xl border border-slate-200 shadow-xl p-12",
          "flex flex-col gap-6",
          // Use solid white so cards stack opaquely over each other
          "bg-white"
        )}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              {item.icon}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">{item.name}</h2>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              {item.description}
            </p>
          </div>
          
          <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative mt-8">
            <img 
              src="/isometric_campus.png" 
              alt="Campus" 
              className="absolute w-full h-full object-cover opacity-40 mix-blend-multiply" 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export interface StackedFeatureCardsProps {
  items: StackedFeatureCard[];
  className?: string;
}

export function StackedFeatureCards({ items, className }: StackedFeatureCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className={cn("relative w-full pb-[10vh]", className)}>
      {items.map((item, i) => {
        // Calculate the target scale so the back card is smallest
        const targetScale = 1 - ((items.length - 1 - i) * 0.05);
        // The card should start shrinking when it hits the top of the viewport (which corresponds to scrollYProgress passing its section)
        const startShrinkingAt = i * (1 / items.length);
        
        return (
          <Card 
            key={i}
            index={i}
            item={item}
            progress={scrollYProgress}
            range={[startShrinkingAt, 1]}
            targetScale={targetScale}
            total={items.length}
          />
        );
      })}
    </div>
  );
}
