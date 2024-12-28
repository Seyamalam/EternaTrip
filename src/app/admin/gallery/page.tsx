'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { ImageGallery } from '@/components/gallery/image-gallery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface Tour {
  id: string;
  title: string;
}

interface Image {
  id: string;
  url: string;
  alt: string;
  tourId: string;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AdminGalleryPage() {
  const [selectedTour, setSelectedTour] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch tours and images
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tours
        const toursRes = await fetch('/api/tours');
        const toursData = await toursRes.json();
        setTours(toursData);

        // Fetch images
        const imagesRes = await fetch('/api/images');
        const imagesData = await imagesRes.json();
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [toast]);

  const filteredImages = selectedTour === 'all'
    ? images
    : images.filter(img => img.tourId === selectedTour);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || selectedTour === 'all') return;

    // Validate files before uploading
    const invalidFiles = Array.from(files).filter(
      file => !ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      toast({
        title: 'Invalid files',
        description: `Some files were not uploaded because they exceed 3MB or are not in the correct format (JPEG, PNG, or WebP)`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('tourId', selectedTour);
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const res = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Upload failed');
      }

      const newImages = await res.json();
      setImages(prev => [...newImages, ...prev]);

      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
      });

      // Refresh the page to show new images
      router.refresh();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      const res = await fetch(`/api/images?id=${imageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setImages(prev => prev.filter(img => img.id !== imageId));
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      // Refresh the page to update the gallery
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Gallery Management</h1>
            <p className="text-muted-foreground">
              Upload, organize, and manage tour images
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Supported formats: JPEG, PNG, WebP. Maximum file size: 3MB.
              Images will be automatically compressed and optimized.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="tour-filter">Filter by Tour</Label>
              <select
                id="tour-filter"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedTour}
                onChange={(e) => setSelectedTour(e.target.value)}
              >
                <option value="all">All Tours</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="invisible">Upload</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
                disabled={selectedTour === 'all' || uploading}
              />
              <Button asChild disabled={selectedTour === 'all' || uploading}>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </label>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
              <ImageGallery
                images={filteredImages}
                columns={4}
                className="max-w-7xl mx-auto"
              />
            </TabsContent>
            <TabsContent value="list">
              <div className="space-y-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="relative h-20 w-20">
                      <OptimizedImage
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover rounded-md"
                        sizes="80px"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{image.alt}</p>
                      <p className="text-sm text-muted-foreground">
                        Tour ID: {image.tourId}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleImageDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete image</span>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
} 