'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Percent } from 'lucide-react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

// This will be replaced with actual API data
const SPECIAL_OFFERS = [
  {
    id: '1',
    title: 'Early Bird Summer Special',
    description: 'Book your summer adventure now and save 20% on selected tours.',
    image: 'offers/summer-special.jpg',
    discount: 20,
    validUntil: '2024-05-31',
    minPeople: 2,
    destinations: ['Bali', 'Maldives', 'Thailand'],
  },
  {
    id: '2',
    title: 'Group Discount Package',
    description: 'Travel with 5 or more people and get 15% off on any tour.',
    image: 'offers/group-discount.jpg',
    discount: 15,
    validUntil: '2024-12-31',
    minPeople: 5,
    destinations: ['Europe', 'Asia', 'Americas'],
  },
  {
    id: '3',
    title: 'Last Minute Deals',
    description: 'Up to 30% off on selected tours departing in the next 30 days.',
    image: 'offers/last-minute.jpg',
    discount: 30,
    validUntil: '2024-03-31',
    minPeople: 1,
    destinations: ['Caribbean', 'Mediterranean'],
  },
];

export function SpecialOffers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SPECIAL_OFFERS.map((offer) => (
        <Card key={offer.id} className="group overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full overflow-hidden">
              <OptimizedImage
                src={offer.image}
                alt={offer.title}
                fill
                className="transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                objectFit="cover"
              />
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="text-lg font-bold">
                  {offer.discount}% OFF
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="mb-2">{offer.title}</CardTitle>
            <CardDescription className="mb-4">
              {offer.description}
            </CardDescription>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Minimum {offer.minPeople} people</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="h-4 w-4" />
                <span>Save up to {offer.discount}% on regular prices</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Available Destinations:</p>
              <div className="flex flex-wrap gap-2">
                {offer.destinations.map((destination) => (
                  <Badge key={destination} variant="outline">
                    {destination}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link href={`/tours?offer=${offer.id}`}>
                View Eligible Tours
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 