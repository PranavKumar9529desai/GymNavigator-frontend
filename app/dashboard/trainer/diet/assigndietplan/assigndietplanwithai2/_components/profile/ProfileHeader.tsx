import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  fullname?: string;
  contact?: string;
}

export function ProfileHeader({ fullname, contact }: ProfileHeaderProps) {
  // Generate initials from the name for the avatar or use placeholder
  const initials = fullname 
    ? fullname
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "CP"; // Client Profile default initials

  const backgroundColors = [
    "bg-blue-500",
    "bg-blue-600", 
    "bg-indigo-500",
    "bg-blue-700",
  ];
  
  // Choose a consistent background color based on the name
  const colorIndex = fullname
    ? fullname
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % backgroundColors.length
    : 0;
  
  const avatarBgColor = backgroundColors[colorIndex];
  const displayName = fullname || "Client Profile";

  return (
    <div className="p-4 pb-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center">
        <Avatar className="h-16 w-16 rounded-full mr-4">
          <AvatarImage src={undefined} />
          <AvatarFallback className={`${avatarBgColor} text-white text-lg font-semibold`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-blue-800">{displayName}</h2>
          {contact && (
            <p className="text-sm text-blue-600 mt-1">
              {contact.includes("@") ? contact : `+${contact}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
