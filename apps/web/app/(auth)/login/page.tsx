"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleSignIn = () => {
    signIn("google", {
      //TODO:: Add dynamic behaviour, like if the user was on /scan-website then should get redirected to 
      //that only and not on dashboard
      callbackUrl: "/dashboard",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to SpellSentry</h1>
        <p className="text-center text-muted-foreground mb-6">
          Sign in to start checking your websites
        </p>
        <Button
          className="w-full"
          onClick={handleSignIn}
        >
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
}
