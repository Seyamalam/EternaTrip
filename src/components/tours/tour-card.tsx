'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, DollarSign, MapPin } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface TourCardProps {
  tour: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    maxPeople: number;
    location?: string;
    image: string;
    featured?: boolean;
  };
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <Card className="group overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <OptimizedImage
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={tour.featured}
            objectFit="cover"
          />
          {tour.featured && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="secondary">Featured</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl mb-2 line-clamp-1">{tour.title}</CardTitle>
          <span className="text-lg font-bold text-primary">${tour.price}</span>
        </div>
        {tour.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span>{tour.location}</span>
          </div>
        )}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
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
          <Link href={`/tours/${tour.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 