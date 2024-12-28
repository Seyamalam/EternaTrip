import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bookingSchema = z.object({
  hotelId: z.string(),
  checkIn: z.string().or(z.date()),
  checkOut: z.string().or(z.date()),
  guests: z.number().int().min(1),
  totalPrice: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = bookingSchema.parse(body);

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: validatedData.hotelId },
    });

    if (!hotel) {
      return NextResponse.json(
        { message: 'Hotel not found' },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await prisma.hotelBooking.create({
      data: {
        hotel: {
          connect: { id: validatedData.hotelId },
        },
        user: {
          connect: { id: user.id },
        },
        checkIn: new Date(validatedData.checkIn),
        checkOut: new Date(validatedData.checkOut),
        guests: validatedData.guests,
        totalPrice: validatedData.totalPrice,
        status: 'PENDING',
      },
      include: {
        hotel: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating hotel booking:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid booking data', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const bookings = await prisma.hotelBooking.findMany({
      where: {
        user: {
          email: session.user.email,
        },
        ...(status ? { status: status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' } : {}),
      },
      include: {
        hotel: {
          select: {
            name: true,
            location: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching hotel bookings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 