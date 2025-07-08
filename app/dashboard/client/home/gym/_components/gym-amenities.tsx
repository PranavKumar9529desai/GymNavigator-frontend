'use client';

import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useState } from 'react';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface GymAmenitiesProps {
  amenities: GymDetailsData['gym']['amenities'];
}

export function GymAmenities({ amenities }: GymAmenitiesProps) {
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

  const groupAmenitiesByType = () => {
    const grouped: Record<string, typeof amenities> = {};
    
    for (const gymAmenity of amenities) {
      const typeName = gymAmenity.amenity.amenityType.name;
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(gymAmenity);
    }
    
    return grouped;
  };

  const groupedAmenities = groupAmenitiesByType();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
          <Zap className="h-3 w-3 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Gym Amenities</h2>
      </div>
      
      <div className="space-y-2">
        {Object.entries(groupedAmenities).map(([typeName, typeAmenities]) => {
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
                    {typeAmenities.length}
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
                    {typeAmenities.map((gymAmenity) => (
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
  );
}
