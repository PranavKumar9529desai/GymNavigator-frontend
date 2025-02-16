'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Dumbbell, Minus, Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

export default function CreateWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: 3, reps: 10 }]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updatedExercises = exercises.map((exercise, i) => {
      if (i === index) {
        return { ...exercise, [field]: value };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure ',
      text: 'You want to create new workout plan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Successs!',
          text: 'Workout is sucssfully created.',
          icon: 'success',
        }).then(() => {
          // TODO backend call to the database
          console.log('Submitting:', {
            workoutName,
            description,
            duration,
            difficulty,
            exercises,
          });
        });
      }
    });
    // Here you would typically send the data to your backend
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Workout</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="workoutName">Workout Name</Label>
            <Input
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the workout"
              rows={3}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Duration"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="flex-1">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Exercises</Label>
            {exercises.map((exercise, index) => (
              <div key={index as number} className="flex items-center space-x-2 mt-2">
                <Input
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  placeholder="Exercise name"
                  required
                />
                <Input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', Number.parseInt(e.target.value))}
                  placeholder="Sets"
                  min="1"
                  required
                  className="w-20"
                />
                <Input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', Number.parseInt(e.target.value))}
                  placeholder="Reps"
                  min="1"
                  required
                  className="w-20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeExercise(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addExercise} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Exercise
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" onClick={() => {}}>
            <Dumbbell className="w-4 h-4 mr-2" /> Create Workout
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
