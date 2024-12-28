import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
}

export function GradientText({
  children,
  className,
  variant = "primary",
  ...props
}: GradientTextProps) {
  const gradientClass = {
    primary: "from-[var(--gradient-primary-start)] to-[var(--gradient-primary-end)]",
    secondary: "from-[var(--gradient-secondary-start)] to-[var(--gradient-secondary-end)]",
    accent: "from-[var(--gradient-accent-start)] to-[var(--gradient-accent-end)]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-block bg-gradient-to-r bg-clip-text text-transparent",
        gradientClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
} 