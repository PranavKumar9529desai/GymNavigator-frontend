import type { Session } from 'next-auth';

export const IsTrainer = (session: Session | null) => {
  return session?.role === 'trainer';
};
