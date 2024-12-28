# Travel Tours Platform

A modern travel and hotel booking platform built with Next.js 13+, TypeScript, Prisma, and PostgreSQL. The platform offers a comprehensive solution for booking tours and hotels, with features for both users and administrators.

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn/ui
- **Styling**: TailwindCSS with custom components

## Core Features

### 1. Authentication & Authorization
- Secure user authentication using NextAuth.js
- Role-based access control (User/Admin)
- Protected routes with middleware
- Email verification support
- Session management

### 2. Tour Management
- Browse and search tours
- Advanced filtering options (price, duration, location)
- Tour details with image galleries
- Featured tours section
- Tour reviews and ratings
- Tour booking system

### 3. Hotel Management
- Hotel listings with detailed information
- Room availability checking
- Price comparison
- Amenities listing
- Hotel image galleries
- Hotel booking system

### 4. Booking System
- Tour and hotel booking
- Group booking support
- Flexible payment plans
- Booking status tracking
- Special requests handling
- Guest management

### 5. User Features
- User dashboard
- Personal preferences
- Wishlist management
- Booking history
- Travel preferences
- Review submission

### 6. Admin Panel
- Dashboard with analytics
- Tour and hotel management
- User management
- Booking management
- Gallery management
- Settings configuration

## API Structure

### Authentication Endpoints
- `/api/auth/*` - NextAuth.js authentication endpoints

### Tour Endpoints
- `GET /api/tours` - List all tours
- `POST /api/tours` - Create new tour (admin only)
- `GET /api/tours/[id]` - Get tour details
- `GET /api/tours/search` - Search tours with filters

### Hotel Endpoints
- `GET /api/hotels` - List all hotels
- `POST /api/hotels` - Create new hotel (admin only)
- `GET /api/hotels/[id]` - Get hotel details

### Booking Endpoints
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[type]/[id]` - Get specific booking details
- `PATCH /api/bookings/group` - Update group booking

### User Endpoints
- `GET /api/user/preferences` - Get user preferences
- `POST /api/user/preferences` - Update user preferences
- `GET /api/user/wishlist` - Get user wishlist
- `POST /api/user/wishlist` - Manage wishlist items

## Security Measures

1. **Authentication**
   - JWT-based authentication
   - Secure session management
   - Protected API routes
   - Role-based access control

2. **Data Protection**
   - Input validation using Zod
   - SQL injection prevention with Prisma
   - XSS protection
   - CSRF protection

3. **API Security**
   - Rate limiting
   - Request validation
   - Error handling
   - Secure headers

## Database Schema

### Core Models

1. **User**
   - Authentication details
   - Profile information
   - Role management
   - Preferences

2. **Tour**
   - Tour details
   - Pricing
   - Capacity management
   - Image galleries

3. **Hotel**
   - Hotel information
   - Amenities
   - Pricing
   - Image galleries

4. **Booking**
   - Booking details
   - Payment information
   - Guest information
   - Status tracking

### Supporting Models
- UserPreferences
- WishlistItem
- Review
- Image
- PaymentPlan
- Testimonial

## Getting Started

1. **Prerequisites**
   - Node.js 16+
   - PostgreSQL
   - npm or yarn

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env

   # Run database migrations
   npx prisma migrate dev

   # Seed the database
   npm run seed

   # Start the development server
   npm run dev
   ```

3. **Default User Profiles**
   
   The seed script creates the following default user profiles:

   | Role    | Email               | Password  | Description                    |
   |---------|---------------------|-----------|--------------------------------|
   | Admin   | admin@example.com   | admin123  | Full access to all features   |
   | Manager | manager@example.com | manager123| Manage tours and bookings     |
   | Guide   | guide@example.com   | guide123  | Handle tour operations        |
   | User    | user@example.com    | user123   | Regular user account          |
   | Test    | test@example.com    | test123   | Test user account             |

4. **Environment Variables**
   ```
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Running in Production
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
