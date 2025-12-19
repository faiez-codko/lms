"use client";

import { useCart } from "@/hooks/use-cart";
import { useUser } from "@/hooks/use-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageIcon, Loader2, Lock, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/AuthModal";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
});

export default function CheckoutPage() {
  const cart = useCart();
  const { user, fetchUser } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchUser();
  }, [fetchUser]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name || "");
      form.setValue("email", user.email || "");
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsCheckingOut(true);
    // Simulate API call
    console.log(values);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    // Redirect or show success
    alert("Order placed successfully! (Mock)");
    cart.clearCart();
  };

  if (!isMounted) return null;

  const total = cart.items.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0;
    return acc + price;
  }, 0);

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Add some courses to your cart to proceed with checkout.
          </p>
          <Link href="/browse">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/browse"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Link>
          <h1 className="text-3xl font-bold mt-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Details */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/20 p-4 rounded-lg flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      {user ? (
                        <>
                          <p className="font-medium text-sm">Logged in as {user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-sm">Already have an account?</p>
                          <p className="text-xs text-muted-foreground">
                            Sign in for a faster checkout
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {!user && (
                    <div className="flex gap-2">
                       <AuthModal />
                    </div>
                  )}
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john@example.com"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Hidden submit button to allow Enter key to submit, 
                        but actual submit is in the right column summary for better UX or bottom of form */}
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
                    Payment integration will be added here (Stripe/PayPal)
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-slate-50 dark:bg-slate-900 border-2">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-24 rounded-md overflow-hidden flex-shrink-0">
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
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.author}
                        </p>
                      </div>
                      <div className="font-bold text-sm">{item.price}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (Estimated)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                    className="w-full h-12 text-lg" 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isCheckingOut}
                >
                  {isCheckingOut && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isCheckingOut ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground px-4">
                    By clicking "Pay", you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
