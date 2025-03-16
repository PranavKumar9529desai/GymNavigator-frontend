'use client';
import { GradientBackground } from '@/components/theme/GradientBackground';
import { GradientCard } from '@/components/theme/GradientCard';
import { GradientText } from '@/components/theme/GradientText';
import { Button } from '@/components/ui/button';
import { gymTheme } from '@/styles/theme';
import { m } from 'framer-motion';
import { Activity, ArrowRight, Dumbbell, Sparkles, UserCheck, UserCog, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomButton from '../../_component/CustomButton';

export default function Herosection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="min-h-[90vh]" />; // Loading state
  }

  const dashboardCards = [
    {
      icon: Users,
      title: 'Onboarded Users',
      value: '1,847',
      color: gymTheme.colors.gradients.primaryBlue,
      growth: '+22%',
    },
    {
      icon: UserCheck,
      title: "Today's Attendance",
      value: '234',
      color: gymTheme.colors.gradients.greenCard,
      growth: '+18%',
    },
    {
      icon: UserCog,
      title: 'Trainer Dashboard',
      value: '16',
      color: gymTheme.colors.gradients.purpleCard,
      growth: '+5%',
    },
    {
      icon: Activity,
      title: 'Active Users',
      value: '1,392',
      color: gymTheme.colors.gradients.orangeCard,
      growth: '+15%',
    },
  ];

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 sm:px-12 lg:px-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero content */}
          <m.div className="space-y-6 lg:space-y-8 text-center lg:text-left relative z-10 py-8 lg:py-0">
            <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto lg:mx-0">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                  <span className="block mb-2 sm:mb-4 text-white/90">Elevate Your</span>
                  <GradientText>Gym Management</GradientText>
                </h1>
              </m.div>
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base sm:text-lg text-gray-300 leading-relaxed mt-4"
              >
                Streamline operations, enhance member experience, and drive growth with our
                sophisticated management suite.
              </m.p>
            </div>

            {/* Mobile Stats Overview */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3 my-8 lg:hidden"
            >
              {[
                { label: 'Partner Gyms', value: '10+', icon: Users },
                { label: 'Active Members', value: '100+', icon: UserCheck },
              ].map((stat, i) => (
                <m.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 + 0.5 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <stat.icon className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </m.div>
              ))}
            </m.div>

            {/* Mobile Feature Highlights */}
            <div className="lg:hidden">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-2 justify-center my-6"
              >
                {['Easy Setup', '24/7 Support', 'Secure'].map((feature, i) => (
                  <m.span
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.7 }}
                    className="bg-blue-500/10 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {feature}
                  </m.span>
                ))}
              </m.div>
            </div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-8"
            >
              <CustomButton className="w-full sm:w-auto" />
              <Button
                variant="outline"
                className="w-full sm:w-auto hidden sm:flex items-center gap-2 bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-blue-500 hover:scale-105 font-medium px-6 py-3 rounded-lg transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </m.div>

            {/* Mobile-optimized CTA buttons */}
            <m.div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
              {/* <m.button
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto lg:hidden px-6 py-3 rounded-full border border-gray-700 text-gray-300 flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
              >
                Watch Demo
                <ArrowRight className="w-4 h-4" />
              </m.button> */}
            </m.div>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="hidden lg:flex justify-end"
          >
            <div className="relative w-[600px] h-[600px] perspective-1000">
              {/* 3D Dashboard Cards */}
              <div className="grid grid-cols-2 gap-6">
                {dashboardCards.map((card, i) => (
                  <GradientCard
                    key={i}
                    icon={card.icon}
                    title={card.title}
                    value={card.value}
                    growth={card.growth}
                    color={card.color}
                    index={i}
                  />
                ))}
              </div>

              {/* Floating Achievement Badges */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <m.div
                    key={`badge-${i as number}`}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                      x: Math.sin(i * 45) * 200,
                      y: Math.cos(i * 45) * 200,
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'reverse',
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </m.div>
        </div>
      </div>

      {/* Mobile-specific floating elements */}
      <div className="absolute inset-0 pointer-events-none lg:hidden">
        {[...Array(3)].map((_, i) => (
          <m.div
            key={`mobile-float-${i as number}`}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              x: Math.sin(i * 45) * 100,
              y: Math.cos(i * 45) * 100,
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
            }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <Dumbbell className="w-3 h-3 text-white" />
            </div>
          </m.div>
        ))}
      </div>

      {/* Mobile-optimized scroll indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:bottom-8"
      >
        <m.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="text-blue-400 text-sm flex flex-col items-center gap-2"
        >
          <span className="hidden sm:block text-xs text-gray-400">Scroll to explore</span>
          <ArrowRight className="w-4 h-4 rotate-90" />
        </m.div>
      </m.div>
    </GradientBackground>
  );
}
