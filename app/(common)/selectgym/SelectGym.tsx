'use client';
import { GymAtom } from '@/app/state/Atoms/gymAtom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Building2, MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Swal from 'sweetalert2';

export interface gym {
  id: string;
  name: string;
  img: string;
}

const GymSkeleton = () => (
  <>
    {[1, 2, 3, 4].map((index) => (
      <div
        key={index}
        className="flex items-center p-4 bg-white rounded-xl border border-gray-100 animate-pulse"
      >
        {/* Skeleton Image */}
        <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />

        {/* Skeleton Content */}
        <div className="ml-4 flex-grow">
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-300 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-24" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default function SelectGym({ gyms }: { gyms: gym[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [, setSelectedGym] = useState<gym | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [, setIsGymSelected] = useState(false);
  const setGymAtom = useSetRecoilState(GymAtom);
  const [isLoading, setIsLoading] = useState(true);
  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    // Simulate loading time or actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleGymSelect = (gym: gym) => {
    setIsOpen(false);
    Swal.fire({
      title: 'Confirm Gym Selection',
      html: `
        <div class="p-4">
          <div class="mb-4">
            <img src="${gym.img}" alt="${gym.name}" class="w-24 h-24 mx-auto rounded-lg object-cover mb-3">
          </div>
          <p class="text-lg font-semibold text-gray-900">${gym.name}</p>
          <p class="text-sm text-gray-600 mt-2">Do you want to select this gym?</p>
        </div>
      `,
      icon: undefined,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Select',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-6 py-2.5 rounded-lg text-white font-medium',
        cancelButton: 'px-6 py-2.5 rounded-lg text-white font-medium',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedGym(gym);
        setIsGymSelected(true);
        setGymAtom(gym);
        router.push(`/selectgym/${gym.id}`);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-center">Select Your Gym</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Search Input with Icon */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search gyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-5 text-lg rounded-xl border-gray-200"
            />
          </div>

          {/* Gym List with Skeleton Loading */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1 -mx-1">
            {isLoading ? (
              <GymSkeleton />
            ) : (
              <>
                {filteredGyms.map((gym) => (
                  <button
                    type="button"
                    key={gym.id}
                    onClick={() => handleGymSelect(gym)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleGymSelect(gym);
                      }
                    }}
                    className="w-full text-left flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    {/* Gym Image */}
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={gym.img} alt={gym.name} fill className="object-cover" />
                    </div>

                    {/* Gym Details */}
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{gym.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>Branch</span>
                        <MapPin className="h-4 w-4 ml-3 mr-1" />
                        <span>Location</span>
                      </div>
                    </div>
                  </button>
                ))}

                {/* No Results Message */}
                {filteredGyms.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No gyms found matching your search.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
