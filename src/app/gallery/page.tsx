'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { ImageGallery } from '@/components/gallery/image-gallery';

// This will be replaced with actual API data
const GALLERY_IMAGES = [
  {
    id: '1',
    url: '/placeholder.jpg',
    alt: 'Beautiful beach view',
  },
  {
    id: '2',
    url: '/placeholder.jpg',
    alt: 'Mountain landscape',
  },
  {
    id: '3',
    url: '/placeholder.jpg',
    alt: 'Cultural site',
  },
  {
    id: '4',
    url: '/placeholder.jpg',
    alt: 'Local cuisine',
  },
  {
    id: '5',
    url: '/placeholder.jpg',
    alt: 'Adventure activity',
  },
  {
    id: '6',
    url: '/placeholder.jpg',
    alt: 'Wildlife encounter',
  },
  {
    id: '7',
    url: '/placeholder.jpg',
    alt: 'Sunset view',
  },
  {
    id: '8',
    url: '/placeholder.jpg',
    alt: 'Historical monument',
  },
  {
    id: '9',
    url: '/placeholder.jpg',
    alt: 'Traditional dance',
  },
];

export default function GalleryPage() {
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Our Gallery</h1>
            <p className="text-muted-foreground">
              Explore our collection of stunning destinations and memorable moments
            </p>
          </div>

          <ImageGallery
            images={GALLERY_IMAGES}
            columns={3}
            className="max-w-7xl mx-auto"
          />
        </div>
      </div>
    </MainLayout>
  );
} 