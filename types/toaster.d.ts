import type { ToasterProps as SonnerToasterProps } from 'sonner';

declare module 'sonner' {
  interface Toast {
    dismiss: () => void;
  }
}

export interface CustomToasterProps extends SonnerToasterProps {
  richColors?: boolean;
  theme?: 'light' | 'dark' | 'system';
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  closeButton?: boolean;
}
