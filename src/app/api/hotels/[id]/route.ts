import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: params.id,
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
          },
        },
      },
    });

    if (!hotel) {
      return NextResponse.json(
        { message: 'Hotel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json(
      { message: 'Failed to fetch hotel' },
      { status: 500 }
    );
  }
} 