'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ImageGallery } from '@/components/gallery/image-gallery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, differenceInDays } from 'date-fns';
import { MapPin, Star, Wifi, Coffee, Car, Tv, Users } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  amenities: string[];
  images: { id: string; url: string; alt: string }[];
}

const amenityIcons: { [key: string]: any } = {
  'Free WiFi': Wifi,
  'Breakfast Included': Coffee,
  'Free Parking': Car,
  'Smart TV': Tv,
};

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    fetchHotelDetails();
  }, [params.id]);

  const fetchHotelDetails = async () => {
    try {
      const res = await fetch(`/api/hotels/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch hotel details');
      const data = await res.json();
      setHotel(data);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hotel details',
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

    if (!checkIn || !checkOut || !hotel) return;

    try {
      const nights = differenceInDays(checkOut, checkIn);
      const totalPrice = hotel.price * nights * guests;

      const res = await fetch('/api/bookings/hotel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: hotel.id,
          checkIn,
          checkOut,
          guests,
          totalPrice,
        }),
      });

      if (!res.ok) throw new Error('Failed to create booking');

      const booking = await res.json();

      toast({
        title: 'Success',
        description: 'Your booking has been confirmed!',
      });

      setIsBookingDialogOpen(false);
      router.push(`/thank-you?type=hotel&id=${booking.id}`);
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
      <MainLayout>
        <div className="container py-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!hotel) {
    return (
      <MainLayout>
        <div className="container py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Hotel not found</h1>
            <p className="text-muted-foreground mt-2">
              The hotel you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push('/hotels')} className="mt-4">
              Browse Hotels
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="grid gap-8">
          {/* Hotel Images */}
          <ImageGallery images={hotel.images} columns={2} />

          {/* Hotel Details */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{hotel.name}</h1>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-semibold">{hotel.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="mr-1 h-4 w-4" />
                  {hotel.location}
                </p>
              </div>

              <div className="prose max-w-none">
                <p>{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Users;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center p-3 rounded-lg border"
                      >
                        <Icon className="h-5 w-5 mr-2 text-primary" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="space-y-4">
              <div className="sticky top-24 rounded-lg border bg-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold">
                    ${hotel.price}
                    <span className="text-sm text-muted-foreground">/night</span>
                  </div>
                </div>

                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Book Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Your Stay</DialogTitle>
                      <DialogDescription>
                        Select your check-in and check-out dates, and number of guests
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Check-in Date</Label>
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Check-out Date</Label>
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) =>
                            date < (checkIn ? addDays(checkIn, 1) : new Date())
                          }
                          initialFocus
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Number of Guests</Label>
                        <Input
                          type="number"
                          min={1}
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                        />
                      </div>
                      {checkIn && checkOut && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Price per night</span>
                            <span>${hotel.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Number of nights</span>
                            <span>{differenceInDays(checkOut, checkIn)}</span>
                          </div>
                          <div className="flex justify-between font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>
                              ${hotel.price * differenceInDays(checkOut, checkIn) * guests}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsBookingDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBooking}
                        disabled={!checkIn || !checkOut || guests < 1}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="text-sm text-muted-foreground mt-4">
                  <p>• Free cancellation up to 24 hours before check-in</p>
                  <p>• Check-in: After 2:00 PM</p>
                  <p>• Check-out: Before 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 