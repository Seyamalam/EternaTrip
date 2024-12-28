'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

// This will be replaced with actual data from the API
const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing experience! The tour was well organized and our guide was knowledgeable and friendly.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 5,
    comment: 'Unforgettable adventure! Everything was perfect from start to finish.',
  },
  {
    id: '3',
    name: 'Emma Davis',
    rating: 4,
    comment: 'Great tour with beautiful locations. Would definitely recommend to others.',
  },
];

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {TESTIMONIALS.map((testimonial) => (
        <Card key={testimonial.id} className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating
                      ? 'text-primary fill-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-card-foreground mb-4">{testimonial.comment}</p>
            <p className="text-sm font-semibold text-primary">
              {testimonial.name}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 