import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import type { Rolestype } from '@/types/next-auth';

interface PageProps {
  params: Promise<{ role: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const session = await auth();
  const { role } = await params;

  // Check if user is authenticated
  if (!session || !session.user) {
    redirect('/signin');
  }

  // Check if the role in params matches the user's role
  const userRole = session.role;
  const paramRole = role as Rolestype;

  // Validate that the role in the URL is valid
  const validRoles: Rolestype[] = ['owner', 'trainer', 'client'];
  if (!validRoles.includes(paramRole)) {
    redirect('/dashboard');
  }

  // If the user's role doesn't match the role in the URL, redirect to their correct profile
  if (userRole !== paramRole) {
    redirect(`/profile/${userRole}/${session.user.id}`);
  }

  // If roles match, redirect to the specific user profile page
  redirect(`/profile/${userRole}/${session.user.id}`);
}
