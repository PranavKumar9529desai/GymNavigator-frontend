// src/app/diet-page/components/DietPlanner/DietControls.tsx
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDaysIcon, CalendarIcon, ChevronDownIcon, SparklesIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface DietControlsProps {
  onGenerate: () => void;
}

export const DietControls: React.FC<DietControlsProps> = ({ onGenerate }) => {
  const startDate = new Date();
  const defaultEndDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate()
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(defaultEndDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
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
  const [activeDay, setActiveDay] = useState<string>(initialDay);

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;

    setSelectedEndDate(date);
    // Ensure the calendar closes after selection
    setTimeout(() => {
      setIsCalendarOpen(false);
    }, 100);
  };

  // Visual feedback when date changes
  const [dateChanged, setDateChanged] = useState(false);

  useEffect(() => {
    if (dateChanged) {
      const timer = setTimeout(() => setDateChanged(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [dateChanged]);

  return (
    <div className="space-y-6 bg-gradient-to-b from-blue-50 to-white p-5 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex items-center bg-white p-3 rounded-md shadow-sm border border-gray-100">
          <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500">Start Date</p>
            <p className="font-medium">{startDate.toLocaleDateString()}</p>
          </div>
        </div>

        <div
          className={`flex items-center bg-white p-3 rounded-md shadow-sm border ${
            dateChanged
              ? "border-blue-400 ring-2 ring-blue-100"
              : "border-gray-100"
          } transition-colors`}
        >
          <CalendarDaysIcon className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500">End Date</p>
            <p className="font-medium">
              {selectedEndDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center text-sm font-medium px-3 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          {isCalendarOpen ? "Close Calendar" : "Change End Date"}
          <ChevronDownIcon
            className={`ml-1 h-4 w-4 transition-transform ${
              isCalendarOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isCalendarOpen && (
        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-md">
          <Calendar
            mode="single"
            selected={selectedEndDate}
            onSelect={(date) => {
              handleEndDateChange(date);
              setDateChanged(true);
            }}
            className="rounded-md"
            disabled={(date) => date < startDate}
          />
        </div>
      )}

      <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 mb-2 px-2">Select day to view</p>
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
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

      <button
        type="button"
        onClick={onGenerate}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition flex items-center justify-center gap-2"
      >
        <SparklesIcon className="h-5 w-5" />
        Generate Diet Plan
      </button>
    </div>
  );
};
