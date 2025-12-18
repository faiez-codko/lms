"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema, registerSchema, LoginSchema, RegisterSchema } from "@/schema/auth";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const AuthModal = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    image: string | null;
  } | null>(null);

  const form = useForm<LoginSchema | RegisterSchema>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isLogin ? {} : { name: "" }),
    },
  });

  useEffect(() => {
    let active = true;
    axios
      .get("/api/auth/me")
      .then((res) => {
        if (!active) return;
        setUser(res.data.user);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (data: LoginSchema | RegisterSchema) => {
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await axios.post("/api/auth/login", data);
      } else {
        await axios.post("/api/auth/register", data);
      }
      setOpen(false);
      window.location.reload();
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    form.reset(); // Reset form when switching modes
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      window.location.reload();
    } catch {
    }
  };

  if (user && !trigger) {
    const initial =
      (user.name?.[0] || user.email?.[0] || "U").toUpperCase();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-2">
            <Avatar>
              <AvatarImage src={user.image || undefined} alt={user.name || "Profile"} />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <span className="ml-2 hidden sm:inline text-sm font-medium text-white hover:text-primary bg-primary/10 px-2 rounded-full">
              {user.name || user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {user.name || user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "USER" && (
            <DropdownMenuItem asChild>
            <Link href="/my-courses">My Courses</Link>
          </DropdownMenuItem>)}
          {user.role === "TEACHER" && (
            <DropdownMenuItem asChild>
              <Link href="/teacher">Teacher Portal</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={logout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
            trigger
        ) : (
            <Button variant="outline" className="gap-2 rounded-lg border-border/60 font-medium px-4 h-10 hover:bg-secondary/50">
                <LogIn className="h-4 w-4" />
                Login
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin ? "Enter your credentials to access your account" : "Enter your information to create an account"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
            {/* Social Login */}
            <Button variant="outline" className="w-full gap-2 h-11">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                        d="M12.0003 20.45C16.6366 20.45 20.5062 17.2762 21.6366 13.0455H12.0003V10.9545H23.8639C23.9573 11.6443 24.0003 12.3557 24.0003 13.0909C24.0003 19.117 18.6185 24 12.0003 24C5.37286 24 0 18.6274 0 12C0 5.37258 5.37286 0 12.0003 0C15.0294 0 17.7689 1.02676 19.9242 2.76634L17.5818 5.10874C16.2085 4.09341 14.3033 3.31818 12.0003 3.31818C7.45031 3.31818 3.65574 6.84591 3.36395 11.4545H12.0003V13.5455H3.36395C3.65574 18.1541 7.45031 21.6818 12.0003 21.6818V20.45Z"
                        fill="currentColor"
                    />
                    <path
                        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                        fill="#4285F4"
                        className="hidden"
                    />
                     {/* Simplified Google Icon Path for visual representation */}
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                {!isLogin && (
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          type="text"
                          {...form.register("name" as any)} 
                        />
                        {(form.formState.errors as any).name && (
                           <p className="text-sm text-destructive">{(form.formState.errors as any).name?.message}</p>
                        )}
                    </div>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      placeholder="m@example.com" 
                      type="email" 
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                       <p className="text-sm text-destructive">{form.formState.errors.email?.message as string}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      {...form.register("password")}
                    />
                    {form.formState.errors.password && (
                       <p className="text-sm text-destructive">{form.formState.errors.password?.message as string}</p>
                    )}
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button className="w-full h-11 mt-2" type="submit" disabled={loading}>
                    {isLogin ? "Login" : "Create Account"}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button 
                    onClick={toggleMode}
                    className="font-medium text-primary hover:underline"
                    type="button"
                >
                    {isLogin ? "Sign up" : "Login"}
                </button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
