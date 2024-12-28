"use client";

import { useEffect, useState } from "react";
import { UserPreferencesForm } from "@/components/profile/user-preferences-form";
import { TravelHistory } from "@/components/profile/travel-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preferences, setPreferences] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch user preferences
      fetch("/api/user/preferences")
        .then((res) => res.json())
        .then(setPreferences)
        .catch(console.error);

      // Fetch user bookings
      fetch("/api/bookings/user")
        .then((res) => res.json())
        .then(setBookings)
        .catch(console.error);
    }
  }, [session?.user?.id]);

  const handlePreferencesSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      const updatedPreferences = await response.json();
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="history">Travel History</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Travel Preferences</CardTitle>
              <CardDescription>
                Customize your travel preferences to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserPreferencesForm
                initialData={preferences}
                onSubmit={handlePreferencesSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <TravelHistory bookings={bookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 