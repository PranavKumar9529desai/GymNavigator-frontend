"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowLeft, 
  CheckCircle,
  User,
  Utensils,
  Target,
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DietPlan {
  id: number;
  name: string;
  description: string;
  targetCalories?: number;
  proteinPercent?: number;
  carbPercent?: number;
  fatPercent?: number;
  meals: {
    id: number;
    name: string;
    mealTime: string;
    calories?: number;
    instructions: string;
  }[];
}

interface UserProfile {
  id: number;
  name: string;
  HealthProfile: {
    goal: string;
    dietaryPreference: string;
  } | null;
}

interface AssignmentSchedulerProps {
  selectedDietPlan: DietPlan;
  userProfile: UserProfile;
  onAssign: (assignmentData: {
    dietPlanId: number;
    startDate: Date;
    endDate: Date;
    daysOfWeek: string[];
    notes?: string;
  }) => void;
  onBack: () => void;
  isLoading: boolean;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

const PRESET_DURATIONS = [
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 },
  { label: "2 Months", days: 60 },
  { label: "3 Months", days: 90 },
];

export function AssignmentScheduler({
  selectedDietPlan,
  userProfile,
  onAssign,
  onBack,
  isLoading,
}: AssignmentSchedulerProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default 30 days
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
    // Clear error when user makes selection
    if (errors.days) {
      setErrors(prev => ({ ...prev, days: "" }));
    }
  };

  const handlePresetDuration = (days: number) => {
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + days);
    setEndDate(newEndDate);
    
    // Clear error when user makes selection
    if (errors.dates) {
      setErrors(prev => ({ ...prev, dates: "" }));
    }
  };

  const handleSelectAllDays = () => {
    setSelectedDays(DAYS_OF_WEEK.map(day => day.value));
  };

  const handleSelectWeekdays = () => {
    setSelectedDays(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  };

  const handleSelectWeekends = () => {
    setSelectedDays(["saturday", "sunday"]);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (startDate && endDate && endDate <= startDate) {
      newErrors.dates = "End date must be after start date";
    }

    if (selectedDays.length === 0) {
      newErrors.days = "Please select at least one day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAssign = () => {
    if (!validateForm()) return;

    onAssign({
      dietPlanId: selectedDietPlan.id,
      startDate,
      endDate,
      daysOfWeek: selectedDays,
      notes: notes.trim() || undefined,
    });
  };

  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBack();
            }
          }}
          className="p-2 hover:bg-blue-50/50 transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back to diet plan selection</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Set Schedule & Timeline</h2>
            <p className="text-slate-600">Configure when the diet plan should be active</p>
          </div>
        </div>
      </div>

      {/* Selected Plan Summary */}
      <Card className="border-blue-100 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Utensils className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Selected Diet Plan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-slate-800">{selectedDietPlan.name}</p>
              <p className="text-sm text-slate-600">{selectedDietPlan.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">For: {userProfile.name}</span>
            </div>
            <div className="flex gap-2">
              {selectedDietPlan.targetCalories && (
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  {selectedDietPlan.targetCalories} cal
                </Badge>
              )}
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {selectedDietPlan.meals.length} meals
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Date Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Timeline</CardTitle>
            </div>
            <CardDescription>Set the start and end dates for the diet plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Duration Presets */}
            <div className="space-y-2">
              <Label>Quick Duration</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_DURATIONS.map((preset) => (
                  <Button
                    key={preset.days}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetDuration(preset.days)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                        errors.startDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          // Adjust end date if it's before start date
                          if (endDate <= date) {
                            const newEndDate = new Date(date);
                            newEndDate.setDate(date.getDate() + 30);
                            setEndDate(newEndDate);
                          }
                          if (errors.startDate || errors.dates) {
                            setErrors(prev => ({ ...prev, startDate: "", dates: "" }));
                          }
                        }
                      }}
                      disabled={(date) => date < new Date(Date.now() - 24 * 60 * 60 * 1000)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        errors.endDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date);
                          if (errors.endDate || errors.dates) {
                            setErrors(prev => ({ ...prev, endDate: "", dates: "" }));
                          }
                        }
                      }}
                      disabled={(date) => date <= startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {errors.dates && (
              <p className="text-sm text-red-600">{errors.dates}</p>
            )}

            {/* Duration Display */}
            {startDate && endDate && endDate > startDate && (
              <div className="p-3 bg-green-50/50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Duration: {duration} days
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Days Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Active Days</CardTitle>
            </div>
            <CardDescription>Select which days of the week the diet plan should be followed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Selection Buttons */}
            <div className="space-y-2">
              <Label>Quick Selection</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllDays}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  All Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectWeekdays}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Weekdays
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectWeekends}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Weekends
                </Button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="space-y-2">
              <Label>Custom Selection</Label>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day.value);
                  return (
                    <div
                      key={day.value}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        isSelected
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
                      )}
                      onClick={() => handleDayToggle(day.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDayToggle(day.value);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-800">{day.short}</p>
                          <p className="text-xs text-slate-600">{day.label}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.days && (
                <p className="text-sm text-red-600">{errors.days}</p>
              )}
            </div>

            {/* Selected Days Summary */}
            {selectedDays.length > 0 && (
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Active on {selectedDays.length} day{selectedDays.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedDays.map(day => (
                    <Badge key={day} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {DAYS_OF_WEEK.find(d => d.value === day)?.short}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-lg">Additional Notes</CardTitle>
          </div>
          <CardDescription>Add any special instructions or notes for the diet plan assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any special instructions, modifications, or notes for this diet plan assignment..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          Back to Diet Plans
        </Button>
        <Button
          onClick={handleAssign}
          disabled={isLoading || selectedDays.length === 0 || !startDate || !endDate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Assigning..." : "Assign Diet Plan"}
        </Button>
      </div>
    </div>
  );
}
