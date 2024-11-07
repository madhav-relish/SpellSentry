import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginFailedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Login Failed</h1>
        <p className="text-center text-muted-foreground mb-6">
          There was an error signing you in. Please try again.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Back to Login</Link>
        </Button>
      </Card>
    </div>
  );
} 