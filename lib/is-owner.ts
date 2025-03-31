import type { Session } from 'next-auth';

export const IsOwner = (session: Session | null) => {
	return session?.role === 'owner';
};
