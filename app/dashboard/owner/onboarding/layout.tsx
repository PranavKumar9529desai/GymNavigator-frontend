import Link from "next/link";

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="px-4 py-3">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            <Link
              href="/dashboard/owner/onboarding/onboardedusers"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-center rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 ui-active:bg-blue-50 ui-active:text-blue-600"
            >
              Onboarding users
            </Link>
            <Link
              href="/dashboard/owner/onboarding/onboardingqr"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-center rounded-full transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 ui-active:bg-blue-50 ui-active:text-blue-600"
            >
              Add User
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}
