"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, ShoppingCart, Check, PlayCircle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/hooks/use-cart";
import { MouseEvent, useEffect, useState } from "react";

interface CourseProps {
  id: number | string;
  title: string;
  author: string;
  thumbnail: string | null;
  price: string;
  rating: number;
  students: number;
  category: string;
  progress?: number | null;
}

export const CourseCard = ({ course, isAdmin, isAuthenticated =false }: { course: CourseProps; isAdmin?: boolean; isAuthenticated?: boolean }) => {
  const cart = useCart();
  // Hydration fix: Only check cart status after mount
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isInCart = isMounted ? cart.items.some((item) => item.id === course.id) : false;

  const onAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    cart.addItem(course);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card h-full flex flex-col">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <ImageIcon className="h-12 w-12 text-slate-500" />
          </div>
        )}
        <div className="absolute top-2 right-2">
           <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-bold">
               {course.price}
           </div>
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
             <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {course.title}
                </h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <User className="h-3 w-3" />
            <span>{course.author}</span>
            </div>

            <div className="flex items-center gap-1 mb-2">
                <span className="font-bold text-sm">{course.rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">({course.students.toLocaleString()})</span>
            </div>
            
            <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full w-fit mb-4">
                {course.category}
            </div>
        </div>

        {isAuthenticated && course.progress !== undefined && course.progress !== null ? (
          <div className="mt-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
               <span>{course.progress}% Complete</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        ) : !isAdmin && (
          <Button 
              onClick={onAddToCart} 
              disabled={isInCart}
              variant={isInCart ? "secondary" : "default"}
              className="w-full gap-2 mt-auto py-6"
              size="sm"
          >
              {isInCart ? (
                  <>
                      <Check className="h-4 w-4" />
                      Added
                  </>
              ) : (
                  <>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                  </>
              )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
