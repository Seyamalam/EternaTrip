'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ImageGallery } from '@/components/gallery/image-gallery';
import { Trash2, Upload } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface HotelImage {
  id: string;
  url: string;
  alt: string;
}

interface Hotel {
  id: string;
  name: string;
  images: HotelImage[];
}

export default function HotelImagesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHotel();
  }, [params.id]);

  const fetchHotel = async () => {
    try {
      const res = await fetch(`/api/hotels/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch hotel');
      const data = await res.json();
      setHotel(data);
    } catch (error) {
      console.error('Error fetching hotel:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hotel',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch(`/api/hotels/${params.id}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload images');

      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
      });

      fetchHotel();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(
        `/api/hotels/${params.id}/images?imageId=${imageId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) throw new Error('Failed to delete image');

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      fetchHotel();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container py-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!hotel) {
    return (
      <AdminLayout>
        <div className="container py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Hotel not found</h1>
            <p className="text-muted-foreground mt-2">
              The hotel you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push('/admin/hotels')} className="mt-4">
              Back to Hotels
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{hotel.name}</h1>
            <p className="text-muted-foreground">Manage hotel images</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/hotels')}
            >
              Back to Hotels
            </Button>
            <Button
              disabled={uploading}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Images'}
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {hotel.images.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No images uploaded yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.images.map((image) => (
              <div
                key={image.id}
                className="relative group overflow-hidden rounded-lg aspect-[4/3]"
              >
                <OptimizedImage
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleImageDelete(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 