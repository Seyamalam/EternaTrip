'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, MapPin, Users, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxPeople: number;
  location: string;
  featured: boolean;
  images: { url: string }[];
}

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    fetchTourDetails();
  }, [params.id]);

  const fetchTourDetails = async () => {
    try {
      const res = await fetch(`/api/tours/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch tour details');
      const data = await res.json();
      setTour(data);
    } catch (error) {
      console.error('Error fetching tour details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tour details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!selectedDate || !tour) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour.id,
          startDate: selectedDate,
          numberOfPeople,
          totalPrice: tour.price * numberOfPeople,
        }),
      });

      if (!res.ok) throw new Error('Failed to create booking');

      toast({
        title: 'Success',
        description: 'Your booking has been confirmed!',
      });

      setIsBookingDialogOpen(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tour not found</h1>
          <p className="text-muted-foreground mt-2">
            The tour you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/tours')} className="mt-4">
            Browse Tours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8">
        {/* Tour Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tour.images.map((image, index) => (
            <div
              key={index}
              className="aspect-[4/3] relative bg-muted rounded-lg overflow-hidden"
            >
              <OptimizedImage
                src={image.url}
                alt={`${tour.title} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                objectFit="cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Tour Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{tour.title}</h1>
              <p className="flex items-center text-muted-foreground mt-2">
                <MapPin className="mr-1 h-4 w-4" />
                {tour.location}
              </p>
            </div>

            <div className="prose max-w-none">
              <p>{tour.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Duration</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {tour.duration} days
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Group Size</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  Max {tour.maxPeople} people
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Price</CardTitle>
                </CardHeader>
                <CardContent className="text-lg font-bold">
                  ${tour.price.toFixed(2)}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Card */}
          <Card>
            <CardHeader>
              <CardTitle>Book This Tour</CardTitle>
              <CardDescription>
                Select your preferred date and number of people
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                <Label>Number of People</Label>
                <Input
                  type="number"
                  min={1}
                  max={tour.maxPeople}
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value, 10))}
                />
              </div>
              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={handleBooking}
                  disabled={!selectedDate || !numberOfPeople}
                >
                  Book Now - ${(tour.price * numberOfPeople).toFixed(2)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 