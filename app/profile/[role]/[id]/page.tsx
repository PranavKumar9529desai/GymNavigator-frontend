import { getUserProfile } from './_action/get-user-profile-for-client';
import { UserProfileClient } from './_components/user-profile-client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string, role: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id, role } = await params;
  const profileData = await getUserProfile(id);

  // Capitalize the first letter of the role for display, but exclude 'client'
  const shouldShowRole = role !== 'client';
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center space-x-1 text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink 
                asChild 
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground/60" />
            <BreadcrumbItem>
              <BreadcrumbPage className={shouldShowRole ? "text-muted-foreground font-medium" : "text-foreground font-semibold"}>
                Profile
              </BreadcrumbPage>
            </BreadcrumbItem>
            {shouldShowRole && (
              <>
                <BreadcrumbSeparator className="text-muted-foreground/60" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-semibold">
                    {roleDisplay}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <UserProfileClient profileData={profileData} userId={id} />
    </div>
  );
}
