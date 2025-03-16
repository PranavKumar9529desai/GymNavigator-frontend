import { cn } from '@/lib/utils';
import { gymTheme } from '@/styles/theme';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientText({
  children,
  className,
  gradient = gymTheme.colors.gradients.primaryBlue,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradient,
        gymTheme.animation.gradient,
        className
      )}
    >
      {children}
    </span>
  );
}
