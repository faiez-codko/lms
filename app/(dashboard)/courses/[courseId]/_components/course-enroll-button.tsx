"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Check, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    categoryId: string | null;
    category: {
        name: string;
    } | null;
  }
}

export const CourseEnrollButton = ({
  price,
  courseId,
  course,
}: CourseEnrollButtonProps) => {
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isInCart = isMounted ? cart.items.some((item) => item.id === courseId) : false;

  const onClick = () => {
    if (isInCart) {
        // Optional: Maybe remove from cart or go to checkout
    } else {
        const cartItem = {
            id: course.id,
            title: course.title,
            author: "Unknown", // You might want to pass author/user name from props if available
            thumbnail: course.imageUrl || "",
            price: course.price ? `$${course.price}` : "Free",
            rating: 0, // Default or fetch
            students: 0, // Default or fetch
            category: course.category?.name || "Uncategorized",
        }
        cart.addItem(cartItem);
    }
  }

  if (!isMounted) {
      return (
        <Button className="w-full mb-4 h-10 font-medium" size="lg">
            Add to Cart
        </Button>
      )
  }

  return (
    <Button
      onClick={onClick}
      disabled={isInCart}
      className="w-full mb-4 h-10 font-medium"
      size="lg"
      variant={isInCart ? "secondary" : "default"}
    >
        {isInCart ? (
            <>
                <Check className="h-4 w-4 mr-2" />
                Added to Cart
            </>
        ) : (
            <>
                Enroll for ${price}
            </>
        )}
    </Button>
  );
};
