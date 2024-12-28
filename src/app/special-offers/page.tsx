import { MainLayout } from '@/components/layout/main-layout';
import { SpecialOffers } from '@/components/special-offers/special-offers';

export default function SpecialOffersPage() {
  return (
    <MainLayout>
      <div className="container py-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Special Offers & Deals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take advantage of our limited-time offers and save on your next adventure
          </p>
        </section>

        {/* Newsletter Section */}
        <section className="mb-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Get Exclusive Deals First
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about special
            promotions, seasonal deals, and exclusive discounts.
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* Current Offers */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Current Offers</h2>
          <SpecialOffers />
        </section>

        {/* Terms and Conditions */}
        <section className="mt-16">
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • All offers are subject to availability and may be withdrawn at any time.
              </p>
              <p>
                • Discounts cannot be combined with other promotions or offers.
              </p>
              <p>
                • Blackout dates may apply during peak seasons and holidays.
              </p>
              <p>
                • Some restrictions and minimum stay requirements may apply.
              </p>
              <p>
                • Prices are per person based on double occupancy unless otherwise noted.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 