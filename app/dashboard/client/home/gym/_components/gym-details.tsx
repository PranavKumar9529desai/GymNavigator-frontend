'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface GymDetailsProps {
  data: GymDetailsData;
}

export function GymDetails({ data }: GymDetailsProps) {
  const { gym, trainer, membership, attendanceHistory } = data;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const groupAmenitiesByType = () => {
    const grouped: Record<string, typeof gym.amenities> = {};
    
    for (const gymAmenity of gym.amenities) {
      const typeName = gymAmenity.amenity.amenityType.name;
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(gymAmenity);
    }
    
    return grouped;
  };

  const groupedAmenities = groupAmenitiesByType();

  const calculateAttendanceStats = () => {
    const totalDays = attendanceHistory.length;
    const attendedDays = attendanceHistory.filter(record => record.attended).length;
    const percentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;
    
    return { totalDays, attendedDays, percentage };
  };

  const attendanceStats = calculateAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
      <div className="max-w-4xl mx-auto space-y-6 p-2 sm:p-4">
        {/* Gym Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {gym.gym_logo && (
              <div className="relative">
                <Image
                  src={gym.gym_logo}
                  alt={gym.gym_name}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {gym.gym_name}
                </h1>
                {gym.address && (
                  <p className="text-slate-600 flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">
                      {gym.address.street}, {gym.address.city}, {gym.address.state} {gym.address.postalCode}
                    </span>
                  </p>
                )}
              </div>
              
              {/* Contact Information */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded text-sm">
                  <Phone className="h-3 w-3 text-blue-500" />
                  <span className="text-slate-700">{gym.phone_number}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded text-sm">
                  <Mail className="h-3 w-3 text-blue-500" />
                  <span className="text-slate-700">{gym.Email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
              <Calendar className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">My Membership</h2>
          </div>
          
          <div className="border-l-2 border-blue-200 pl-4">
            {membership.validPeriod ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Start Date</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{formatDate(membership.validPeriod.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">End Date</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{formatDate(membership.validPeriod.endDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Shift</p>
                  <div className="mt-1">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium capitalize">
                      {membership.validPeriod.shift}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <Clock className="h-8 w-8 text-blue-300 mb-2" />
                <p className="text-slate-600 font-medium">No active membership found</p>
                <p className="text-xs text-slate-500 mt-1">Contact your gym to activate your membership</p>
              </div>
            )}
          </div>
        </div>

        {/* Trainer Information */}
        {trainer && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">My Trainer</h2>
            </div>
            
            <div className="border-l-2 border-blue-200 pl-4">
              <div className="flex items-start gap-4">
                {trainer.image ? (
                  <div className="relative">
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{trainer.name}</h3>
                    {trainer.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "h-3 w-3",
                                i < Math.floor(trainer.rating!) 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "fill-gray-200 text-gray-200"
                              )} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-600">
                          {trainer.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {trainer.specializations && (
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Specializations</p>
                      <p className="text-sm text-slate-700">{trainer.specializations}</p>
                    </div>
                  )}
                  
                  {trainer.description && (
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">About</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{trainer.description}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {trainer.contactNumber && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 px-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 px-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Attendance History */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
            <Calendar className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Attendance History</h2>
          <span className="ml-auto text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
            {attendanceStats.percentage}% attendance
          </span>
        </div>
        
        <div className="border-l-2 border-blue-200 pl-4">
          <div className="grid grid-cols-7 gap-1">
            {attendanceHistory.slice(0, 28).map((record, index) => (
              <div
                key={index}
                className={cn(
                  'aspect-square rounded text-xs font-medium flex items-center justify-center',
                  record.attended
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                )}
                title={`${formatDate(record.date)} - ${record.attended ? 'Present' : 'Absent'}`}
              >
                {new Date(record.date).getDate()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gym Amenities */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
            <Zap className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Gym Amenities</h2>
        </div>
        
        <div className="space-y-2">
          {Object.entries(groupedAmenities).map(([typeName, amenities]) => {
            const isExpanded = expandedCategories.has(typeName);
            return (
              <div key={typeName} className="border-b border-slate-100">
                <button
                  onClick={() => toggleCategory(typeName)}
                  className="w-full flex items-center justify-between py-2 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-700 text-sm uppercase tracking-wide">
                      {typeName}
                    </h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {amenities.length}
                    </span>
                  </div>
                  <div className="text-blue-600">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="pb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {amenities.map((gymAmenity) => (
                        <div
                          key={gymAmenity.amenity.id}
                          className="p-2 hover:bg-blue-50/30 rounded transition-colors"
                        >
                          <div className="font-medium text-slate-800 text-sm">{gymAmenity.amenity.name}</div>
                          {gymAmenity.amenity.description && (
                            <div className="text-slate-600 text-xs mt-1">
                              {gymAmenity.amenity.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Plans */}
      {gym.pricingPlans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
              <DollarSign className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Available Plans</h2>
          </div>
          
          <div className="border-l-2 border-blue-200 pl-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {gym.pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    'p-3 rounded border-l-2',
                    plan.isFeatured 
                      ? 'border-l-blue-400 bg-blue-50/50' 
                      : 'border-l-slate-200 hover:border-l-blue-200'
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">{plan.name}</h3>
                      {plan.isFeatured && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Featured</span>
                      )}
                    </div>
                    
                    <div>
                      <span className="text-2xl font-bold text-slate-800">₹{plan.price}</span>
                      <span className="text-slate-600 text-sm">/{plan.duration}</span>
                    </div>
                    
                    {plan.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{plan.description}</p>
                    )}
                    
                    {plan.features.length > 0 && (
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-xs flex items-center gap-2">
                            <Zap className="h-2 w-2 text-emerald-500" />
                            <span className="text-slate-700">{feature.description}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Services */}
      {gym.additionalServices.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-lg shadow-blue-100/20 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Additional Services</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gym.additionalServices.map((service) => (
              <div key={service.id} className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{service.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">₹{service.price}</div>
                    <div className="text-sm text-slate-600">{service.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
