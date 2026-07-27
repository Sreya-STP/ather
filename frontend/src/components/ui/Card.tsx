import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  gradient?: boolean;
  hover?: boolean;
}

export function Card({ className, glass, gradient, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        glass
          ? "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-white/20 dark:border-white/10"
          : "bg-white dark:bg-surface-dark-card border-gray-100 dark:border-surface-dark-border",
        gradient && "bg-gradient-card",
        hover && "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
        "shadow-card dark:shadow-card-dark",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}
