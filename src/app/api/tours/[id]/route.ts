import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import path from 'path';
import { unlink } from 'fs/promises';

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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id: params.id,
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json(
        { message: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id: params.id },
    });

    if (!existingTour) {
      return NextResponse.json(
        { message: 'Tour not found' },
        { status: 404 }
      );
    }

    // Update tour
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid tour data', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update tour' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        bookings: true,
      },
    });

    if (!existingTour) {
      return NextResponse.json(
        { message: 'Tour not found' },
        { status: 404 }
      );
    }

    // Delete associated images from disk
    for (const image of existingTour.images) {
      try {
        const fullPath = path.join(process.cwd(), 'public', image.url);
        await unlink(fullPath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Delete tour and all related records (images and bookings)
    await prisma.tour.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { message: 'Failed to delete tour' },
      { status: 500 }
    );
  }
} 