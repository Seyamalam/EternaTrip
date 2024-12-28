"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Wishlist } from "@/components/profile/wishlist";
import { toast } from "sonner";

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

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist();
    }
  }, [session?.user?.id]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/user/wishlist");
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      const data = await response.json();
      setWishlistItems(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist items");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/user/wishlist?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleBook = (type: "tour" | "hotel", id: string) => {
    router.push(`/${type}s/${id}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Wishlist
        items={wishlistItems}
        onRemove={handleRemove}
        onBook={handleBook}
      />
    </div>
  );
} 