import { cn } from '@/lib/utils';
import { gymTheme } from '@/styles/theme';
import { type MotionProps, m } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface GradientCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  growth?: string;
  color: string;
  index?: number;
  className?: string;
  motionProps?: MotionProps;
}

export function GradientCard({
  icon: Icon,
  title,
  value,
  growth,
  color,
  index = 0,
  className,
  motionProps,
}: GradientCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        z: Math.sin(index * 0.5) * 50,
      }}
      whileHover={{
        scale: 1.05,
        z: 30,
        rotateX: 10,
        rotateY: 10,
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.8,
        type: 'spring',
        stiffness: 100,
      }}
      className={cn(
        'bg-gradient-to-br border transform-style-3d shadow-xl p-6',
        gymTheme.colors.borders.light,
        gymTheme.borderRadius.card,
        className,
      )}
      {...motionProps}
    >
      <div
        className={cn(
          'rounded-full w-12 h-12 bg-gradient-to-br flex items-center justify-center mb-4',
          color,
        )}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      <div className="flex items-end gap-2 mt-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {growth && <span className="text-green-400 text-sm mb-1">{growth}</span>}
      </div>

      {/* Animated graph line */}
      <m.div
        className="h-1 bg-white/10 mt-4 rounded-full overflow-hidden"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
      >
        <m.div
          className={cn('h-full bg-gradient-to-r', color)}
          animate={{
            x: ['-100%', '0%'],
            opacity: [0.5, 1],
          }}
          transition={{
            duration: 1.5,
            delay: index * 0.2 + 0.5,
            ease: 'easeOut',
          }}
        />
      </m.div>
    </m.div>
  );
}
