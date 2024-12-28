import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Configuration for the amount of seed data
const USERS_COUNT = 50;
const TOURS_COUNT = 30;
const HOTELS_COUNT = 25;
const REVIEWS_PER_ITEM = 5;
const TESTIMONIALS_COUNT = 15;
const IMAGES_PER_ITEM = 4;
const BOOKINGS_PER_USER = 3;

// Default user profiles
const defaultUsers = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'ADMIN',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    email: 'manager@example.com',
    name: 'Tour Manager',
    password: 'manager123',
    role: 'MANAGER',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
  },
  {
    email: 'guide@example.com',
    name: 'Tour Guide',
    password: 'guide123',
    role: 'GUIDE',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
  },
  {
    email: 'user@example.com',
    name: 'Regular User',
    password: 'user123',
    role: 'USER',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  },
  {
    email: 'test@example.com',
    name: 'Test User',
    password: 'test123',
    role: 'USER',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  }
];

// Helper function to generate a random number within a range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.hotelBooking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.image.deleteMany();
  await prisma.hotelImage.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned up existing data');

  // Create default users
  const defaultUserProfiles = await Promise.all(
    defaultUsers.map(async (user) => {
      const hashedPassword = await hash(user.password, 12);
      return prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          password: hashedPassword,
          role: user.role,
          image: user.image,
          preferences: {
            create: {
              preferredDestinations: ['Paris, France', 'Tokyo, Japan', 'New York, USA'],
              dietaryRestrictions: ['None'],
              accommodationType: ['Hotel', 'Resort'],
              budgetRange: '$1000-$2000',
              travelStyle: ['Luxury', 'Cultural'],
            },
          },
        },
      });
    })
  );

  console.log('👥 Created default user profiles');

  // Create regular users
  const users = await Promise.all(
    Array(USERS_COUNT).fill(null).map(async () => {
      const password = await hash('password123', 12);
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password,
          image: faker.image.avatar(),
          role: 'USER',
          preferences: {
            create: {
              preferredDestinations: Array(randomInt(2, 5))
                .fill(null)
                .map(() => faker.location.country()),
              dietaryRestrictions: getRandomItems(
                ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 'None'],
                randomInt(0, 2)
              ),
              accommodationType: getRandomItems(
                ['Hotel', 'Resort', 'Villa', 'Apartment', 'Hostel'],
                randomInt(1, 3)
              ),
              budgetRange: faker.helpers.arrayElement([
                '$0-$1000',
                '$1000-$2000',
                '$2000-$5000',
                '$5000+',
              ]),
              travelStyle: getRandomItems(
                ['Adventure', 'Luxury', 'Budget', 'Cultural', 'Relaxation'],
                randomInt(1, 3)
              ),
            },
          },
        },
      });
    })
  );

  // Combine all users for later use
  const allUsers = [...defaultUserProfiles, ...users];

  console.log('👥 Created regular users');

  // Create tours
  const tourLocations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'Rome, Italy',
    'Cairo, Egypt',
    'Sydney, Australia',
    'London, UK',
    'Barcelona, Spain',
    'Dubai, UAE',
    'Bali, Indonesia',
  ];

  const tours = await Promise.all(
    Array(TOURS_COUNT).fill(null).map(async () => {
      const tour = await prisma.tour.create({
        data: {
          title: faker.helpers.arrayElement([
            'Cultural Heritage Tour',
            'Adventure Expedition',
            'City Discovery',
            'Historical Journey',
            'Nature Explorer',
            'Urban Adventure',
          ]) + ' in ' + faker.location.city(),
          description: faker.lorem.paragraphs(3),
          location: faker.helpers.arrayElement(tourLocations),
          price: parseFloat(faker.commerce.price({ min: 500, max: 5000 })),
          duration: randomInt(3, 14),
          maxPeople: randomInt(10, 30),
          featured: Math.random() > 0.7,
          images: {
            create: Array(IMAGES_PER_ITEM).fill(null).map(() => ({
              url: faker.image.urlLoremFlickr({ category: 'travel' }),
              alt: faker.lorem.words(3),
            })),
          },
        },
      });

      // Add reviews for each tour
      await Promise.all(
        getRandomItems(users, REVIEWS_PER_ITEM).map((user) =>
          prisma.review.create({
            data: {
              rating: randomInt(3, 5),
              comment: faker.lorem.paragraph(),
              tourId: tour.id,
              userId: user.id,
            },
          })
        )
      );

      return tour;
    })
  );

  console.log('🗺️ Created tours with reviews and images');

  // Create hotels
  const hotelAmenities = [
    'Free WiFi',
    'Swimming Pool',
    'Spa',
    'Fitness Center',
    'Restaurant',
    'Room Service',
    'Bar',
    'Business Center',
    'Parking',
    'Airport Shuttle',
  ];

  const hotels = await Promise.all(
    Array(HOTELS_COUNT).fill(null).map(async () => {
      return prisma.hotel.create({
        data: {
          name: faker.company.name() + ' Hotel',
          description: faker.lorem.paragraphs(2),
          location: faker.helpers.arrayElement(tourLocations),
          price: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
          rating: Number(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })),
          amenities: getRandomItems(hotelAmenities, randomInt(5, 8)),
          featured: Math.random() > 0.7,
          images: {
            create: Array(IMAGES_PER_ITEM).fill(null).map(() => ({
              url: faker.image.urlLoremFlickr({ category: 'hotel' }),
              alt: faker.lorem.words(3),
            })),
          },
        },
      });
    })
  );

  console.log('🏨 Created hotels with images');

  // Create testimonials
  await Promise.all(
    Array(TESTIMONIALS_COUNT).fill(null).map(() =>
      prisma.testimonial.create({
        data: {
          name: faker.person.fullName(),
          rating: randomInt(4, 5),
          comment: faker.lorem.paragraph(),
        },
      })
    )
  );

  console.log('💬 Created testimonials');

  // Create bookings and wishlists for users
  await Promise.all(
    users.map(async (user) => {
      // Create tour bookings
      const userTours = getRandomItems(tours, BOOKINGS_PER_USER);
      await Promise.all(
        userTours.map((tour) =>
          prisma.booking.create({
            data: {
              userId: user.id,
              tourId: tour.id,
              startDate: faker.date.future(),
              endDate: faker.date.future({ years: 1 }),
              status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled']),
              totalAmount: parseFloat(faker.commerce.price({ min: 500, max: 5000 })),
              paidAmount: parseFloat(faker.commerce.price({ min: 0, max: 5000 })),
              numberOfGuests: randomInt(1, 5),
              groupBooking: Math.random() > 0.7,
              groupSize: Math.random() > 0.7 ? randomInt(5, 15) : null,
              specialRequests: Math.random() > 0.5 ? faker.lorem.sentence() : null,
              paymentPlan: Math.random() > 0.7
                ? {
                    create: {
                      totalAmount: parseFloat(faker.commerce.price({ min: 1000, max: 5000 })),
                      installments: randomInt(3, 6),
                      paidInstallments: randomInt(0, 2),
                      nextDueDate: faker.date.future(),
                      status: faker.helpers.arrayElement(['active', 'completed', 'defaulted']),
                    },
                  }
                : undefined,
            },
          })
        )
      );

      // Create hotel bookings
      const userHotels = getRandomItems(hotels, BOOKINGS_PER_USER);
      await Promise.all(
        userHotels.map((hotel) =>
          prisma.hotelBooking.create({
            data: {
              userId: user.id,
              hotelId: hotel.id,
              checkIn: faker.date.future(),
              checkOut: faker.date.future({ years: 1 }),
              guests: randomInt(1, 4),
              totalPrice: parseFloat(faker.commerce.price({ min: 200, max: 2000 })),
              status: faker.helpers.arrayElement(['PENDING', 'CONFIRMED', 'CANCELLED']),
            },
          })
        )
      );

      // Create wishlist items
      const wishlistTours = getRandomItems(tours, randomInt(1, 5));
      const wishlistHotels = getRandomItems(hotels, randomInt(1, 5));

      await Promise.all([
        ...wishlistTours.map((tour) =>
          prisma.wishlistItem.create({
            data: {
              userId: user.id,
              tourId: tour.id,
            },
          })
        ),
        ...wishlistHotels.map((hotel) =>
          prisma.wishlistItem.create({
            data: {
              userId: user.id,
              hotelId: hotel.id,
            },
          })
        ),
      ]);
    })
  );

  console.log('📚 Created bookings and wishlists');
  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 