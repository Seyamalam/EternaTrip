import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        userId: session.user.id,
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
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { tourId, hotelId } = body;

    if (!tourId && !hotelId) {
      return new NextResponse("Either tourId or hotelId must be provided", {
        status: 400,
      });
    }

    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        OR: [
          { tourId: tourId || undefined },
          { hotelId: hotelId || undefined },
        ],
      },
    });

    if (existingItem) {
      return new NextResponse("Item already in wishlist", { status: 400 });
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        tourId: tourId || undefined,
        hotelId: hotelId || undefined,
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
    });

    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return new NextResponse("Wishlist item ID is required", { status: 400 });
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!wishlistItem || wishlistItem.userId !== session.user.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    await prisma.wishlistItem.delete({
      where: {
        id: itemId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 