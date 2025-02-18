'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Upload, User } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Loader from '../Skeltons/loaders';
import { addTrainer, updateTrainer } from './AddTrainerSA';
import type { AddTrainerRequest, ShiftType, UpdateTrainerRequest } from './AddTrainerSA';
interface AddTrainerProps {
  addTrainerProps: {
    id?: number;
    name?: string;
    shift?: ShiftType;
    image?: string;
    rating?: number;
  };
}

const ShiftArray = [
  {
    name: 'Morning',
    label: 'morning',
  },
  {
    name: 'Evening',
    label: 'evening',
  },
];

export default function AddTrainer({ addTrainerProps }: AddTrainerProps) {
  const [name, setName] = useState<string>(addTrainerProps.name || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof addTrainerProps.image === 'string' ? addTrainerProps.image : null
  );
  const [rating, setRating] = useState<number>(addTrainerProps.rating || 0);
  const [shift, setShift] = useState<ShiftType>(addTrainerProps.shift || 'morning');
  const [imageError, setImageError] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (addTrainerProps) {
      Swal.fire({
        title: 'Warning',
        text: 'Do you want to edit the trainer details?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      });
    }
  }, [addTrainerProps]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setImageError('');

    const isEditing = !!addTrainerProps.id;

    if (!isEditing && !name.trim()) {
      Swal.fire({
        title: 'Error!',
        text: "Please enter the trainer's name.",
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!image && !imagePreview && !isEditing) {
      setImageError('Please upload an image.');
      return;
    }

    let imageUrl: string | undefined = undefined;
    try {
      setLoading(true);
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch('/api/uploadimage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imagePreview }),
        });

        const result = await response.json();

        if (response.ok) {
          imageUrl = result.url;
        } else {
          throw new Error(result.error || 'Failed to upload image.');
        }
      } else if (imagePreview) {
        imageUrl = imagePreview;
      }

      const requestData = isEditing
        ? {
            id: addTrainerProps.id,
            shift,
            rating,
            image: imageUrl,
          }
        : {
            name,
            shift,
            rating,
            image: imageUrl,
          };

      const responseData = isEditing
        ? await updateTrainer(requestData as UpdateTrainerRequest)
        : await addTrainer(requestData as AddTrainerRequest);

      if ((isEditing && responseData.trainer) || (!isEditing && responseData.trainer)) {
        setLoading(false);
        Swal.fire({
          title: isEditing ? 'Updated!' : 'Added!',
          text: isEditing ? 'Trainer details have been updated.' : 'Trainer has been added.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {});
        // Optionally reset the form or redirect
      } else {
        throw new Error(responseData.msg || 'An error occurred.');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  if (isLoading) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {addTrainerProps.id ? 'Edit Trainer' : 'Add Trainer'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Trainer"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
          </div>

          {
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!!addTrainerProps.name}
                placeholder="Enter trainer's name"
              />
            </div>
          }

          <div>
            <Label htmlFor="shift">Shift</Label>
            <select
              id="shift"
              name="shift"
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="block w-full text-sm bg-white border text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="" hidden>
                Select Shift
              </option>
              {ShiftArray.map((shiftItem, index) => (
                <option key={index as number} value={shiftItem.label}>
                  {shiftItem.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="image">Trainer Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <span className="text-sm text-gray-500">
                {image ? image.name : imagePreview ? 'Image Selected' : 'No file chosen'}
              </span>
            </div>
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          </div>

          <div>
            <Label>Initial Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{addTrainerProps.id ? 'Update Trainer' : 'Add Trainer'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
