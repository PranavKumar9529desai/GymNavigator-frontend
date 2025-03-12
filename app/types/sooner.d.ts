declare module 'sonner' {
  interface ToasterProps {
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

  export const Toaster: React.FC<ToasterProps>;
  export const toast: {
    (message: string): void;
    success: (message: string, options?: { description?: string }) => void;
    loading: (message: string, options?: { description?: string }) => void;
    error: (message: string, options?: { description?: string }) => void;
    warning: (message: string, options?: { description?: string }) => void;
    info: (message: string, options?: { description?: string }) => void;
    dismiss: () => void;
  };
}
