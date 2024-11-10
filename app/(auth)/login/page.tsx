import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - Lumina",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Button
        variant="ghost"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        asChild
      >
        <Link href="/home">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/home" className="flex items-center gap-2">
            Lumina
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Lumina has completely transformed how I keep track of my shows and movies. 
              The AI recommendations are spot-on!"
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/signup"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}