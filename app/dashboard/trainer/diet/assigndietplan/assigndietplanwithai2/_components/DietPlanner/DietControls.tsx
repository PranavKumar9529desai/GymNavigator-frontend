// src/app/diet-page/components/DietPlanner/DietControls.tsx
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, SparklesIcon, MapPinIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DietControlsProps {
  onGenerate: (location: { country: string; state: string }) => void;
  activeDay?: string;
  onDayChange?: (day: string) => void;
}

export const DietControls: React.FC<DietControlsProps> = ({ 
  onGenerate,
  activeDay: propActiveDay,
  onDayChange 
}) => {
  const startDate = new Date();
  const defaultEndDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate()
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(defaultEndDate);
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const initialDay =
    new Date().getDay() === 0 ? "Sunday" : days[new Date().getDay() - 1];
  const [localActiveDay, setLocalActiveDay] = useState<string>(propActiveDay || initialDay);

  // Calculate duration in days between start and end date
  const durationDays = Math.ceil(
    (selectedEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Visual feedback when date changes
  const [dateChanged, setDateChanged] = useState(false);

  useEffect(() => {
    if (dateChanged) {
      const timer = setTimeout(() => setDateChanged(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [dateChanged]);

  // Update local state when prop changes
  useEffect(() => {
    if (propActiveDay) {
      setLocalActiveDay(propActiveDay);
    }
  }, [propActiveDay]);

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    setSelectedEndDate(date);
    setDateChanged(true);
  };

  const handleDayChange = (day: string) => {
    setLocalActiveDay(day);
    if (onDayChange) {
      onDayChange(day);
    }
  };

  const handleGenerate = () => {
    onGenerate({ country, state });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        {/* Date Selection Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
          <div className="flex items-center bg-blue-50 p-3 rounded-md border border-blue-100">
            <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="font-medium text-blue-800">{format(startDate, 'MMM d, yyyy')}</p>
            </div>
          </div>

          <div className="text-gray-400 hidden sm:block">→</div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className={`flex items-center bg-blue-50 p-3 rounded-md border ${
                  dateChanged
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-blue-100"
                } transition-colors hover:border-blue-400`}
              >
                <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">End Date</p>
                  <div className="flex items-center">
                    <p className="font-medium text-blue-800">{format(selectedEndDate, 'MMM d, yyyy')}</p>
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-blue-600" />
                  </div>
                </div>
                {durationDays > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {durationDays} days
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedEndDate}
                onSelect={handleEndDateChange}
                disabled={(date) => date < startDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-md shadow-sm transition flex items-center justify-center gap-2"
        >
          <SparklesIcon className="h-5 w-5" />
          Generate Diet Plan
        </button>
      </div>

      {/* Location Input Section */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              id="country"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium text-gray-700">State/Region</Label>
          <Input 
            id="state"
            placeholder="Enter state or region"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Select day to view</p>
        <Tabs value={localActiveDay} onValueChange={handleDayChange} className="w-full">
          <TabsList className="grid grid-cols-7 w-full bg-gray-50 p-1">
            {days.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded"
              >
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
