'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Search, MapPin, Calendar, Users } from 'lucide-react';
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

function ToursContent() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [duration, setDuration] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize filters from URL params
    const query = searchParams.get('q') || '';
    const price = searchParams.get('price') || 'all';
    const dur = searchParams.get('duration') || 'all';
    const sort = searchParams.get('sort') || 'price-asc';

    setSearchQuery(query);
    setPriceRange(price);
    setDuration(dur);
    setSortBy(sort);

    fetchTours(query, price, dur, sort);
  }, [searchParams]);

  const fetchTours = async (
    query: string,
    price: string,
    duration: string,
    sort: string
  ) => {
    try {
      const params = new URLSearchParams({
        q: query,
        price,
        duration,
        sort,
      });

      const res = await fetch(`/api/tours/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tours');
      const data = await res.json();
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tours',
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
    if (duration !== 'all') params.set('duration', duration);
    if (sortBy !== 'price-asc') params.set('sort', sortBy);

    router.push(`/tours?${params.toString()}`);
  };

  const handleViewTour = (tourId: string) => {
    router.push(`/tours/${tourId}`);
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

  return (
    <div className="container py-10">
      <div className="space-y-8">
        {/* Search and Filters Section */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tours..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="501-1000">$501 - $1000</SelectItem>
                  <SelectItem value="1001+">$1001+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="1-3">1-3 Days</SelectItem>
                  <SelectItem value="4-7">4-7 Days</SelectItem>
                  <SelectItem value="8+">8+ Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="duration-asc">Duration: Short to Long</SelectItem>
                  <SelectItem value="duration-desc">Duration: Long to Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden">
              <div className="aspect-[16/9] relative bg-muted">
                {tour.images[0] && (
                  <OptimizedImage
                    src={tour.images[0].url}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    objectFit="cover"
                    priority={tour.featured}
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle>{tour.title}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="mr-1 h-4 w-4" />
                  {tour.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tour.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {tour.duration} days
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    Max {tour.maxPeople} people
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-lg font-bold">${tour.price.toFixed(2)}</div>
                <Button onClick={() => handleViewTour(tour.id)}>View Details</Button>
              </CardFooter>
            </Card>
          ))}
          {tours.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No tours found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursContent />
    </Suspense>
  );
} 