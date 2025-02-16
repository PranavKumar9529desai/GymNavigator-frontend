import type { ToasterProps as SonnerToasterProps } from 'sonner';

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
