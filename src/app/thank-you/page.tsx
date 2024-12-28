'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Calendar, MapPin, Users } from 'lucide-react';

interface TourBooking {
  id: string;
  date: string;
  guests: number;
  totalPrice: number;
  tour: {
    title: string;
    location: string;
  };
}

interface HotelBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  hotel: {
    name: string;
    location: string;
  };
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<TourBooking | HotelBooking | null>(null);

  const type = searchParams.get('type');
  const id = searchParams.get('id');

  useEffect(() => {
    if (!type || !id) {
      router.push('/');
      return;
    }

    fetchBooking();
  }, [type, id]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${type}/${id}`);
      if (!res.ok) throw new Error('Failed to fetch booking');
      const data = await res.json();
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to load booking details',
        variant: 'destructive',
      });
      router.push('/');
    } finally {
      setLoading(false);
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

  if (!booking) {
    return (
      <MainLayout>
        <div className="container py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Booking not found</h1>
            <p className="text-muted-foreground mt-2">
              The booking you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Back to Home
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isHotelBooking = 'checkIn' in booking;

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground">
              Your booking has been confirmed. We've sent a confirmation email with
              all the details.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {isHotelBooking
                          ? (booking as HotelBooking).hotel.name
                          : (booking as TourBooking).tour.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isHotelBooking
                          ? (booking as HotelBooking).hotel.location
                          : (booking as TourBooking).tour.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      {isHotelBooking ? (
                        <>
                          <p className="font-medium">Check-in</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              (booking as HotelBooking).checkIn
                            ).toLocaleDateString()}
                          </p>
                          <p className="font-medium mt-2">Check-out</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              (booking as HotelBooking).checkOut
                            ).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              (booking as TourBooking).date
                            ).toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Guests</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.guests} {booking.guests === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Price</span>
                  <span className="text-xl font-bold">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Booking Reference: <span className="font-mono">{booking.id}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
            <Button onClick={() => router.push('/dashboard')}>
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
} 