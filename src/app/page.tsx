import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-6xl font-bold tracking-tighter">NOVA</h1>
        <p className="text-2xl font-medium text-muted-foreground">
          Plan. Collaborate. Deliver.
        </p>
        <div className="h-px w-24 bg-border mx-auto my-8"></div>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
          Project management for modern teams.
        </p>
        <div className="flex items-center justify-center gap-4 pt-8">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "px-8")}>
            Get Started
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8")}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
