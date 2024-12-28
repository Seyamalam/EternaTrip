"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TravelHistoryProps {
  bookings: Array<{
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
    totalAmount: number;
    numberOfGuests: number;
    tour?: {
      name: string;
      destination: string;
    };
    hotel?: {
      name: string;
      location: string;
    };
  }>;
}

export function TravelHistory({ bookings }: TravelHistoryProps) {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredBookings = bookings.filter((booking) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "upcoming")
      return new Date(booking.startDate) > new Date();
    if (selectedTab === "past") return new Date(booking.endDate) < new Date();
    return booking.status === selectedTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel History</CardTitle>
        <CardDescription>View all your past and upcoming trips</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-4">
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.tour?.name || booking.hotel?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.tour?.destination || booking.hotel?.location}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                            {format(new Date(booking.endDate), "MMM d, yyyy")}
                          </p>
                          <p className="text-sm">
                            Guests: {booking.numberOfGuests}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(booking.status)} text-white`}
                        >
                          {booking.status}
                        </Badge>
                        <p className="mt-2 font-semibold">
                          ${booking.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 