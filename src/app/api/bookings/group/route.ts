import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      tourId,
      hotelId,
      startDate,
      endDate,
      groupSize,
      groupType,
      specialRequirements,
      contactPerson,
      paymentOption,
      totalAmount,
    } = body;

    if (!tourId && !hotelId) {
      return new NextResponse("Either tourId or hotelId must be provided", {
        status: 400,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        tourId: tourId || undefined,
        hotelId: hotelId || undefined,
        startDate,
        endDate,
        status: "pending",
        totalAmount,
        numberOfGuests: groupSize,
        groupBooking: true,
        groupSize,
        specialRequests: specialRequirements,
        paymentPlan: paymentOption === "Installments"
          ? {
              create: {
                totalAmount,
                installments: 3, // Default to 3 installments
                nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              },
            }
          : undefined,
      },
      include: {
        tour: true,
        hotel: true,
        paymentPlan: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[GROUP_BOOKING_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        groupBooking: true,
      },
      include: {
        tour: true,
        hotel: true,
        paymentPlan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[GROUP_BOOKING_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");

    if (!bookingId) {
      return new NextResponse("Booking ID is required", { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    const body = await req.json();
    const { status, paidAmount } = body;

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
        paidAmount,
      },
      include: {
        tour: true,
        hotel: true,
        paymentPlan: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("[GROUP_BOOKING_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 