'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, MapPin, Star, Users } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  amenities: string[];
  images: { url: string }[];
}

function HotelsContent() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [rating, setRating] = useState('all');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize filters from URL params
    const query = searchParams.get('q') || '';
    const price = searchParams.get('price') || 'all';
    const rate = searchParams.get('rating') || 'all';

    setSearchQuery(query);
    setPriceRange(price);
    setRating(rate);

    fetchHotels(query, price, rate);
  }, [searchParams]);

  const fetchHotels = async (
    query: string,
    price: string,
    rating: string
  ) => {
    try {
      const params = new URLSearchParams({
        q: query,
        price,
        rating,
      });

      const res = await fetch(`/api/hotels/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch hotels');
      const data = await res.json();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hotels',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (rating !== 'all') params.set('rating', rating);

    router.push(`/hotels?${params.toString()}`);
  };

  const handleViewHotel = (hotelId: string) => {
    router.push(`/hotels/${hotelId}`);
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

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="space-y-8">
          {/* Search and Filters Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search hotels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="101-200">$101 - $200</SelectItem>
                    <SelectItem value="201-300">$201 - $300</SelectItem>
                    <SelectItem value="301+">$301+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4+">4+ Stars</SelectItem>
                    <SelectItem value="3+">3+ Stars</SelectItem>
                    <SelectItem value="2+">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden">
                <div className="aspect-[16/9] relative bg-muted">
                  {hotel.images[0] && (
                    <OptimizedImage
                      src={hotel.images[0].url}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      objectFit="cover"
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{hotel.name}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <MapPin className="mr-1 h-4 w-4" />
                    {hotel.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {hotel.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{hotel.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-lg font-bold">
                      ${hotel.price.toFixed(2)}
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleViewHotel(hotel.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {hotels.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">
                  No hotels found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
} 