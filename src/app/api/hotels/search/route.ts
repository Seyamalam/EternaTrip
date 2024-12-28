import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 1000000;

    const hotels = await prisma.hotel.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        AND: [
          {
            location: {
              contains: location,
              mode: "insensitive",
            },
          },
          {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
        ],
      },
      include: {
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error searching hotels:", error);
    return NextResponse.json(
      { message: "Error searching hotels" },
      { status: 500 }
    );
  }
} 