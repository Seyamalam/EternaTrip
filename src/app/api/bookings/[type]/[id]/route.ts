import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    let booking;

    if (params.type === 'tour') {
      booking = await prisma.booking.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
        include: {
          tour: {
            select: {
              title: true,
              location: true,
            },
          },
        },
      });
    } else if (params.type === 'hotel') {
      booking = await prisma.hotelBooking.findFirst({
        where: {
          id: params.id,
          userId: user.id,
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
    } else {
      return NextResponse.json(
        { message: 'Invalid booking type' },
        { status: 400 }
      );
    }

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
} 