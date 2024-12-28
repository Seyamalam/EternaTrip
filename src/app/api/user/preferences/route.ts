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

    const preferences = await prisma.userPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("[USER_PREFERENCES_GET]", error);
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
    const {
      preferredDestinations,
      dietaryRestrictions,
      accommodationType,
      budgetRange,
      travelStyle,
    } = body;

    const preferences = await prisma.userPreferences.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        preferredDestinations,
        dietaryRestrictions,
        accommodationType,
        budgetRange,
        travelStyle,
      },
      create: {
        userId: session.user.id,
        preferredDestinations,
        dietaryRestrictions,
        accommodationType,
        budgetRange,
        travelStyle,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("[USER_PREFERENCES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const preferences = await prisma.userPreferences.update({
      where: {
        userId: session.user.id,
      },
      data: body,
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("[USER_PREFERENCES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 