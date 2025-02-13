'use client';
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Phone,
  Mail,
  Key,
  MoreVertical,
  Copy,
  Check,
  Map,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import NoGymDetails from './NoGymDetails';
import { useState } from 'react';
import { m } from 'framer-motion';

interface GymDetails {
  gym_name: string;
  gym_logo: string;
  address: string;
  phone_number: string;
  Email: string;
  gymauthtoken: string; // Add auth token to interface
}

export default function ViewGymDetails({
  gymDetails,
}: {
  gymDetails: GymDetails | null;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  if (!gymDetails) {
    return <NoGymDetails />;
  }

  const handleEdit = () => {
    const params = new URLSearchParams({
      name: gymDetails.gym_name,
      logo: gymDetails.gym_logo,
      address: gymDetails.address,
      phone: gymDetails.phone_number,
      email: gymDetails.Email,
      authToken: gymDetails.gymauthtoken,
    });
    router.push(
      `/ownerdashboard/gymdetails/editgymdetails?${params.toString()}`
    );
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Hero Section with Fixed Menu Position */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="relative">
            {/* Three-dot menu - Now absolutely positioned */}
            <div className="absolute right-0 top-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    Edit Gym Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Profile content */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
                <Image
                  src={gymDetails.gym_logo}
                  alt={`${gymDetails.gym_name} logo`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {gymDetails.gym_name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start text-gray-600 gap-2 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{gymDetails.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="hover:shadow transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-full">
                    <Phone className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium">{gymDetails.phone_number}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover:shadow transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-full">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-medium">{gymDetails.Email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Card className="hover:shadow transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-full">
                    <Key className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Auth Token</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm truncate bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                        {gymDetails.gymauthtoken}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(gymDetails.gymauthtoken)}
                        className="flex-shrink-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </m.div>
        </div>

        {/* Location Map */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Map className="h-5 w-5 text-gray-500" />
                Location
              </h2>
              <div className="aspect-[16/9] sm:aspect-[21/9] rounded-lg overflow-hidden bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                  <Map className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 font-medium">
                    Location feature coming soon
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{gymDetails.address}</span>
              </p>
            </CardContent>
          </Card>
        </m.div>
      </div>
    </div>
  );
}
