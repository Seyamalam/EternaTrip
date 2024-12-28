import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        ...(status ? { status: status as "PENDING" | "CONFIRMED" | "CANCELLED" } : {}),
      },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            images: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            price: true,
            images: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
    return NextResponse.json(
      { message: "Internal error" },
      { status: 500 }
    );
  }
} 