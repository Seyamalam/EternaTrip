import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function GlassContainer({
  children,
  className,
  blur = "md",
  animate = true,
}: GlassContainerProps) {
  const blurClass = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  }[blur];

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0, 0, 0.2, 1],
        }}
        className={cn(
          "glass-effect rounded-lg",
          blurClass,
          className
        )}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "glass-effect rounded-lg",
        blurClass,
        className
      )}
    >
      {children}
    </div>
  );
} 