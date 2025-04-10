// src/app/diet-page/components/DietPlanner/DietControls.tsx
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, SparklesIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface DietControlsProps {
  onGenerate: () => void;
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

  return (
    <div className="space-y-6 bg-gradient-to-b from-blue-50 to-white p-5 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Date Range Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
          <div className="flex items-center bg-white p-3 rounded-md shadow-sm border border-gray-100">
            <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="font-medium">{format(startDate, 'MMM d, yyyy')}</p>
            </div>
          </div>

          <div className="text-gray-400 hidden sm:block">→</div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className={`flex items-center bg-white p-3 rounded-md shadow-sm border ${
                  dateChanged
                    ? "border-blue-400 ring-2 ring-blue-100"
                    : "border-gray-100"
                } transition-colors hover:border-blue-300`}
              >
                <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">End Date</p>
                  <div className="flex items-center">
                    <p className="font-medium">{format(selectedEndDate, 'MMM d, yyyy')}</p>
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                {durationDays > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
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
          onClick={onGenerate}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition flex items-center justify-center gap-2"
        >
          <SparklesIcon className="h-5 w-5" />
          Generate Diet Plan
        </button>
      </div>

      <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 mb-2 px-2">Select day to view</p>
        <Tabs value={localActiveDay} onValueChange={handleDayChange} className="w-full">
          <TabsList className="grid grid-cols-7 w-full bg-gray-50">
            {days.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
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
