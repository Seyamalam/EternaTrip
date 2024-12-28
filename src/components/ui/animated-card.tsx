import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  gradient?: boolean;
  hover?: boolean;
  delay?: number;
}

export function AnimatedCard({
  children,
  className,
  gradient = false,
  hover = true,
  delay = 0,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "rounded-lg bg-card p-6",
        gradient && "gradient-border",
        hover && "hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
} 