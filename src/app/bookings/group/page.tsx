"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GroupBookingForm } from "@/components/booking/group-booking-form";
import { toast } from "sonner";

export default function GroupBookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");
  const hotelId = searchParams.get("hotelId");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/bookings/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tourId: tourId || undefined,
          hotelId: hotelId || undefined,
          totalAmount: calculateTotalAmount(data),
        }),
      });

      if (!response.ok) throw new Error("Failed to create booking");

      const booking = await response.json();
      toast.success("Group booking created successfully!");
      router.push(`/bookings/${booking.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    }
  };

  const calculateTotalAmount = (data: any) => {
    // This is a simplified calculation - you should implement your own pricing logic
    const basePrice = 100; // Base price per person
    const numberOfDays = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return basePrice * data.groupSize * numberOfDays;
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Group Booking</h1>
        <GroupBookingForm
          onSubmit={handleSubmit}
          tourId={tourId || undefined}
          hotelId={hotelId || undefined}
        />
      </div>
    </div>
  );
} 