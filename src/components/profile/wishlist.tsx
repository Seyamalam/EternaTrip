"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Tour {
  id: string;
  name: string;
  destination: string;
  price: number;
  image: string;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  image: string;
}

interface WishlistItem {
  id: string;
  tour?: Tour;
  hotel?: Hotel;
}

interface WishlistProps {
  items: WishlistItem[];
  onRemove: (id: string) => void;
  onBook: (type: "tour" | "hotel", id: string) => void;
}

export function Wishlist({ items, onRemove, onBook }: WishlistProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Wishlist</CardTitle>
            <CardDescription>
              Save your favorite tours and hotels for later
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView("grid")}>
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("list")}>
                List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {items.map((item) => {
            const isTour = !!item.tour;
            const data = isTour ? item.tour : item.hotel;
            if (!data) return null;

            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{data.name}</h3>
                  <p className="text-sm text-gray-500">
                    {isTour ? (data as Tour).destination : (data as Hotel).location}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="font-semibold">
                      ${isTour ? (data as Tour).price : (data as Hotel).pricePerNight}
                      {!isTour && <span className="text-sm">/night</span>}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        onBook(isTour ? "tour" : "hotel", data.id)
                      }
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 