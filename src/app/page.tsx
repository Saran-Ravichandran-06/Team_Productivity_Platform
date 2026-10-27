import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowRight, Users, Layers, Activity, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      {/* Top Header */}
      <header className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-baseline gap-2.5 group">
            <span className="text-2xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
              KNOVA
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-normal">
              Plan. Collaborate. Deliver.
            </span>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pr-2">
              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl xl:text-5xl font-bold tracking-tight text-foreground leading-[1.1] inline-block origin-top-left scale-y-[1.2]">
                Bring your team&apos;s work{" "}
                <span className="font-serif italic font-extrabold tracking-wide">
                  Together.
                </span>
              </h1>
              <br></br>
              {/* Supporting description */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Plan projects, manage tasks, collaborate with your team, and track
                progress from one organized, real-time workspace.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-foreground/90">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Layers className="size-3.5" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Interactive Kanban</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Activity className="size-3.5" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Real-time Activity</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Users className="size-3.5" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Team Collaboration</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <BarChart3 className="size-3.5" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Productivity Analytics</span>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 px-7 font-medium shadow-sm gap-2"
                  )}
                >
                  Get Started Free
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-7 font-medium"
                  )}
                >
                  Sign In to Workspace
                </Link>
              </div>

              {/* Subtext info */}
              <p className="text-xs text-muted-foreground pt-1">
                Free local workspace • Role-based permissions • Instant setup
              </p>
            </div>

            {/* Right Showcase Column */}
            <div className="lg:col-span-7 relative w-full flex items-center justify-center lg:justify-end">
              {/* Ambient warm backlight reflecting conference table */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/10 via-primary/5 to-transparent rounded-3xl blur-3xl -z-10 pointer-events-none" />

              {/* Showcase Container */}
              <div className="relative w-full max-w-[728px] overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-2xl shadow-black/10">
                {/* Complete 16:9 Uncropped Image */}
                <Image
                  src="/images/landing.jpg"
                  alt="KNOVA team collaborating around conference table"
                  width={728}
                  height={408}
                  priority
                  className="w-full h-auto aspect-[728/408] object-contain block"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 728px"
                />

                {/* Progressive Gradual Blur Overlay on the Left End */}
                <div
                  className="absolute inset-y-0 left-0 w-28 sm:w-40 md:w-52 lg:w-64 pointer-events-none z-10"
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    maskImage:
                      "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.15) 70%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.15) 70%, transparent 100%)",
                  }}
                />

                {/* Smooth Seamless Color Fade at the Left End */}
                <div
                  className="absolute inset-y-0 left-0 w-20 sm:w-28 md:w-36 lg:w-44 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(to right, var(--background) 0%, color-mix(in oklch, var(--background) 70%, transparent) 40%, transparent 100%)",
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-6 text-xs text-muted-foreground bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-start">
          <p>&copy; {new Date().getFullYear()} KNOVA Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
