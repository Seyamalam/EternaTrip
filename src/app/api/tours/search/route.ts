import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const price = searchParams.get('price') || 'all';
    const duration = searchParams.get('duration') || 'all';
    const sort = searchParams.get('sort') || 'price-asc';

    // Build where clause
    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Add price filter
    if (price !== 'all') {
      const [min, max] = price === '1001+' 
        ? [1001, 999999] 
        : price.split('-').map(Number);
      where.price = {
        gte: min,
        ...(max ? { lte: max } : {}),
      };
    }

    // Add duration filter
    if (duration !== 'all') {
      const [min, max] = duration === '8+' 
        ? [8, 999] 
        : duration.split('-').map(Number);
      where.duration = {
        gte: min,
        ...(max ? { lte: max } : {}),
      };
    }

    // Determine sort order
    let orderBy: any = {};
    switch (sort) {
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'duration-asc':
        orderBy = { duration: 'asc' };
        break;
      case 'duration-desc':
        orderBy = { duration: 'desc' };
        break;
      default: // price-asc
        orderBy = { price: 'asc' };
    }

    const tours = await prisma.tour.findMany({
      where,
      orderBy,
      include: {
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error searching tours:', error);
    return NextResponse.json(
      { message: 'Failed to search tours' },
      { status: 500 }
    );
  }
} 