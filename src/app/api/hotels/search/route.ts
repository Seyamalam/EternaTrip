import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const price = searchParams.get('price') || 'all';
    const rating = searchParams.get('rating') || 'all';

    // Build where clause
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Add price filter
    if (price !== 'all') {
      const [min, max] = price === '301+' 
        ? [301, 999999] 
        : price.split('-').map(Number);
      where.price = {
        gte: min,
        ...(max ? { lte: max } : {}),
      };
    }

    // Add rating filter
    if (rating !== 'all') {
      const minRating = parseInt(rating.replace('+', ''));
      where.rating = {
        gte: minRating,
      };
    }

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error searching hotels:', error);
    return NextResponse.json(
      { message: 'Failed to search hotels' },
      { status: 500 }
    );
  }
} 