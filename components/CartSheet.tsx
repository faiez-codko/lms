"use client";

import { ShoppingCart, Trash2, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";

export const CartSheet = () => {
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  const itemCount = cart.items.length;
  
  // Calculate total (assuming price is a string like "$19.99")
  const total = cart.items.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0;
    return acc + price;
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        
        {itemCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-secondary/50 p-6 rounded-full">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-lg">Your cart is empty</p>
                <p className="text-muted-foreground text-sm">Looks like you haven't added any courses yet.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
              <div className="space-y-4 p-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-20 w-32 rounded-md overflow-hidden flex-shrink-0 bg-secondary/50">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                          <ImageIcon className="h-8 w-8 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{item.author}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm">{item.price}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => cart.removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 p-4 border-t">
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <SheetClose asChild>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
