import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowRight, Users, Layers, Activity, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      {/* Two-Part Split Section */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* 1. Left Part: Top Left Branding, Main Contents at Center */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 w-full lg:w-[50%]">
          {/* Top Left Corner: Project Name and Tagline */}
          <header className="w-full flex items-center justify-start pb-4">
            <Link
              href="/"
              className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-6 gap-y-2 group"
            >
              <span
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors font-brand italic leading-none"
                style={{
                  fontFamily: "'Times New Roman MT', 'Times New Roman', Times, serif",
                  fontStyle: "italic",
                  fontWeight: 900,
                }}
              >
                KNOVA
              </span>
              <span
                className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-tight text-muted-foreground font-switzer leading-none"
                style={{ fontFamily: "'Switzer', sans-serif" }}
              >
                Plan.Collaborate.Deliver
              </span>
            </Link>
          </header>

          {/* Center of the Left Part: Main Contents (shifted slightly to the right) */}
          <main className="flex-1 flex flex-col justify-center max-w-xl w-full my-auto py-8 space-y-6 pl-4 sm:pl-8 lg:pl-12 xl:pl-19">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl xl:text-5xl font-bold tracking-tight text-foreground leading-[1.1] inline-block origin-top-left scale-y-[1.2]">
              <span className="font-switzer" style={{ fontFamily: "'Switzer', sans-serif" }}>
                Bring your team&apos;s work{" "}
              </span>
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
                Get started for free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-7 font-medium"
                )}
              >
                Sign in to workspace
              </Link>
            </div>
          </main>
        </div>

        {/* 2. Right Part: Dedicated Image Showcase (Same background as left, no vertical dividing border/fade) */}
        <div className="w-full lg:w-[50%] flex items-center justify-center lg:justify-start p-6 sm:p-8 lg:py-8 lg:pr-6 lg:pl-0 xl:py-10 xl:pr-8 xl:pl-0 min-h-[460px] bg-background">
          <div className="relative w-full max-w-[780px] xl:max-w-[850px] 2xl:max-w-[900px] lg:-translate-x-4 xl:-translate-x-6">
            {/* Image Container with Proper Dimensions & Aspect Ratio */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/10 bg-background">
              <Image
                src="/images/landing.jpg"
                alt="KNOVA team collaborating around conference table"
                width={820}
                height={500}
                priority
                className="w-full h-auto aspect-[728/440] object-cover block rounded-2xl"
                sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 55vw, 900px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer spanning whole bottom (both left and right part) */}
      <footer className="w-full border-t border-border/40 py-5 text-xs text-muted-foreground bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 flex items-center justify-center text-center">
          <p>&copy; 2026 <span className="font-brand font-semibold italic" style={{ fontFamily: "'Times New Roman MT', 'Times New Roman', Times, serif", fontStyle: "italic" }}>KNOVA</span> Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
