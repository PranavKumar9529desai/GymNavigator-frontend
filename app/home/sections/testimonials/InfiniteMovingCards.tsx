'use client';
import { useEffect, useState, useRef } from 'react';
import { m } from 'framer-motion';
import Image from 'next/image';

export type TestimonialItem = {
  image: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  growth: string;
};

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
}: {
  items: TestimonialItem[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setTimeout(() => setStart(true), 100);
  }, []);

  const speeds = {
    fast: 20,
    normal: 35,
    slow: 50,
  };

  return (
    <div
      className="relative overflow-hidden"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <m.div
        className="flex gap-6 w-max"
        animate={
          start
            ? {
                x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
              }
            : {}
        }
        transition={{
          duration: speeds[speed],
          ease: 'linear',
          repeat: Infinity,
          paused: pauseOnHover && isHovered,
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="relative group w-[280px] sm:w-[350px] md:w-[450px] h-[350px] sm:h-[400px] md:h-[450px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-4 sm:p-6 md:p-8 relative z-10 h-full flex flex-col">
              {/* Rating Stars and Growth */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="flex gap-0.5 sm:gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="text-yellow-500 text-sm sm:text-base"
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-500/20 rounded-full">
                  <span className="text-green-400 text-xs sm:text-sm font-medium">
                    ↑ {item.growth}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <div className="mb-4 sm:mb-6">
                <blockquote className="text-sm sm:text-base md:text-lg text-zinc-300">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Profile */}
              <div className="mt-auto flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-blue-500/20">
                  <Image
                    src={item.image}
                    alt={item.author}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-white">
                    {item.author}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    {item.role}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-400">
                    {item.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </m.div>
    </div>
  );
};
