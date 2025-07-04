import type { Session } from 'next-auth';

export const IsClient = (session: Session | null) => {
	return session?.role === 'client';
};
