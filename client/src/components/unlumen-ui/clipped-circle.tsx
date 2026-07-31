import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface ClippedCircleProps {
  className?: string;
  circleClassName?: string;
  circleSize?: number;
}

function ClippedCircle({
  className,
  circleClassName = "bg-white/20",
  circleSize = 400,
}: ClippedCircleProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for buttery tracking without layout thrashing
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.parentElement) return;
    const parent = container.parentElement;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      // Subtract half the size to center the circle on the cursor
      mouseX.set(e.clientX - rect.left - circleSize / 2);
      mouseY.set(e.clientY - rect.top - circleSize / 2);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [circleSize, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none z-20",
        className,
      )}
    >
      <motion.div
        className={cn(
          "pointer-events-none absolute rounded-full",
          circleClassName,
        )}
        style={{
          width: circleSize,
          height: circleSize,
          mixBlendMode: "difference",
          x: smoothX,
          y: smoothY,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1 : 0.5 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}

export { ClippedCircle, type ClippedCircleProps };
