'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, DollarSign } from 'lucide-react';

// This will be replaced with actual data from the API
const FEATURED_TOURS = [
  {
    id: '1',
    title: 'Beautiful Beach Paradise',
    description: 'Experience the crystal clear waters and white sandy beaches.',
    price: 299,
    duration: 3,
    maxPeople: 12,
    image: '/placeholder.jpg',
  },
  {
    id: '2',
    title: 'Mountain Adventure Trek',
    description: 'Challenge yourself with an exciting mountain trek.',
    price: 399,
    duration: 5,
    maxPeople: 8,
    image: '/placeholder.jpg',
  },
  {
    id: '3',
    title: 'Cultural City Tour',
    description: 'Discover the rich history and culture of ancient cities.',
    price: 199,
    duration: 2,
    maxPeople: 15,
    image: '/placeholder.jpg',
  },
];

export function FeaturedTours() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {FEATURED_TOURS.map((tour) => (
        <Card key={tour.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-xl mb-2">{tour.title}</CardTitle>
            <p className="text-muted-foreground text-sm mb-4">
              {tour.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{tour.duration} days</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Max {tour.maxPeople}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${tour.price}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full" variant="default">
              <Link href={`/tours/${tour.id}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 