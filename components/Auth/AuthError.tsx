import { XCircle } from 'lucide-react';

interface AuthErrorProps {
  error: string;
  onDismiss: () => void;
}

export function AuthError({ error, onDismiss }: AuthErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div className="flex">
        <XCircle className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto text-red-400 hover:text-red-500"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
