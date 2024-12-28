import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for tour data
const tourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().int().min(1, 'Duration must be at least 1 day'),
  maxPeople: z.number().int().min(1, 'Maximum people must be at least 1'),
  location: z.string().min(1, 'Location is required'),
  featured: z.boolean().default(false),
});

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? '' },
    });

    if (!user?.email || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const validatedData = tourSchema.parse(body);

    // Create tour
    const tour = await prisma.tour.create({
      data: validatedData,
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid tour data', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to create tour' },
      { status: 500 }
    );
  }
} 