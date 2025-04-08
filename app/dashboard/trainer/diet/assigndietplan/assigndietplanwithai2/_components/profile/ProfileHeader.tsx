import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  fullname?: string;
  contact?: string;
}

export function ProfileHeader({ fullname, contact }: ProfileHeaderProps) {
  // Get initials from fullname for avatar fallback
  const getInitials = (name?: string): string => {
    if (!name) return "CP";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
          <AvatarImage
            src="/placeholder-avatar.jpg"
            alt={fullname || "Client"}
          />
          <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
            {getInitials(fullname)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-xl text-gray-800 truncate">
            {fullname || "Client Profile"}
          </h2>
          {contact && (
            <p className="text-gray-600 text-sm mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {contact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
