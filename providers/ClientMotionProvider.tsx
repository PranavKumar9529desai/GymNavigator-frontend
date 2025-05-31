"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";

interface ClientMotionProviderProps {
  children: ReactNode;
}

export default function ClientMotionProvider({ children }: ClientMotionProviderProps) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
