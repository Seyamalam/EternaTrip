import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { FeaturedTours } from '@/components/tours/featured-tours';
import { Testimonials } from '@/components/testimonials/testimonials';
import Link from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="hero-title">
              Discover Your Next Adventure
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Explore breathtaking destinations and create unforgettable memories with our curated travel experiences.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/tours">
                  Explore Tours
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">
              Featured Tours
            </h2>
            <p className="section-subtitle">
              Choose from our most popular destinations
            </p>
          </div>
          <FeaturedTours />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">
              What Our Travelers Say
            </h2>
            <p className="section-subtitle">
              Read about experiences from our satisfied customers
            </p>
          </div>
          <Testimonials />
        </div>
      </section>
    </MainLayout>
  );
}
