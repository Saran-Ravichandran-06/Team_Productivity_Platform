import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <AuthSplitLayout showMobileImage={true}>
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <span className="flex size-1.5 rounded-full bg-primary" />
          Modern Team Productivity Platform
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
          Bring your team&apos;s work together.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Plan projects, manage tasks, collaborate with your team, and track
          progress from one organized workspace.
        </p>

        {/* Value highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-foreground/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span>Interactive Kanban Boards</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span>Real-time Team Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span>Live Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span>Productivity Analytics</span>
          </div>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 px-7 font-medium shadow-sm gap-2"
            )}
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 px-7 font-medium"
            )}
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
