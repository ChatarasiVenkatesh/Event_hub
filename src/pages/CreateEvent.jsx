import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// Firebase imports
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().refine((val) => {
    const today = new Date();
    const pickedDate = new Date(val);
    today.setHours(0, 0, 0, 0); // midnight
    return pickedDate >= today;
  }, {
    message: 'Date must be today or in the future',
  }),
  time: z.string().min(1, 'Please select a time'),
  location: z.string().min(1, 'Location is required'),
  price: z.string().transform(val => (val === '' ? '0' : val)),
  capacity: z.string().transform(val => (val === '' ? '0' : val)),
  isOnline: z.boolean().default(false),
});

export function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isOnline: false,
      price: '',
      capacity: '',
    }
  });

  const isOnline = watch('isOnline');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to create an event.');
      navigate('/login');
      return;
    }

    try {
      // Prepare event payload
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        time: data.time,
        location: data.location,
        price: Number(data.price || 0),
        capacity: Number(data.capacity || 0),
        isOnline: data.isOnline,
        organizerId: user.uid,
        createdAt: serverTimestamp(),
        imageUrl: null,
      };

      // Upload image if provided
      if (imageFile) {
        const fileName = `${user.uid}_${Date.now()}_${imageFile.name}`;
        const imgRef = ref(storage, `event_images/${fileName}`);

        // This uses the Firebase Storage SDK directly — no CORS issues
        const uploadTask = uploadBytesResumable(imgRef, imageFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            () => { }, // optional progress tracking
            (error) => {
              console.error('Upload failed:', error);
              toast.error('Image upload failed.');
              reject(error);
            },
            async () => {
              payload.imageUrl = await getDownloadURL(imgRef);
              resolve();
            }
          );
        });
      }

      // Save event to Firestore
      await addDoc(collection(db, 'events'), payload);

      toast.success('Your event has been successfully created.');
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Event Image</Label>
                  <div
                    className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer"
                    onClick={() => document.getElementById('eventImage').click()}
                  >
                    <input
                      type="file"
                      id="eventImage"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-[200px] rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click to upload event image
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Enter event title"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Describe your event..."
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        {...register('category')}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select Category</option>
                        {EVENT_CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center justify-between">
                        <span>Online Event</span>
                        <Switch
                          checked={isOnline}
                          onCheckedChange={(checked) => setValue('isOnline', checked)}
                        />
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]} // today's date
                        {...register('date')}
                      />

                      {errors.date && (
                        <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" {...register('time')} />
                      {errors.time && (
                        <p className="text-sm text-destructive mt-1">{errors.time.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">
                      {isOnline ? 'Meeting Link' : 'Location'}
                    </Label>
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder={isOnline ? 'Enter meeting link' : 'Enter venue address'}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Ticket Price</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        {...register('price')}
                        placeholder="0 for free event"
                      />
                    </div>

                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        {...register('capacity')}
                        placeholder="Maximum number of attendees"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
