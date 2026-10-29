import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  /**
   * If true, displays a stacked preview image on mobile viewports (<1024px).
   * Defaults to false for authentication forms.
   */
  showMobileImage?: boolean;
}

export function AuthSplitLayout({
  children,
  showMobileImage = false,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      {/* Two-Part Split Section */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* 1. Left Part: Top Left Branding, Form Contents at Center */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 w-full lg:w-[50%]">
          {/* Top Left Corner: Project Name and Tagline */}
          <header className="w-full flex items-center justify-start pb-4">
            <Link
              href="/"
              className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-6 gap-y-2 group"
            >
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors font-brand italic leading-none">
                KNOVA
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-tight text-muted-foreground font-switzer leading-none">
                Plan.Collaborate.Deliver
              </span>
            </Link>
          </header>

          {/* Center of the Left Part: Form Content */}
          <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto py-6 sm:py-8">
            {children}
          </main>
        </div>

        {/* 2. Right Part: Dedicated Image Showcase (Same background as left, no vertical dividing border/fade) */}
        <div
          className={`${
            showMobileImage ? "flex" : "hidden lg:flex"
          } w-full lg:w-[50%] items-center justify-center lg:justify-start p-6 sm:p-8 lg:py-8 lg:pr-6 lg:pl-0 xl:py-10 xl:pr-8 xl:pl-0 min-h-[480px] bg-background`}
        >
          <div className="relative w-full max-w-[780px] xl:max-w-[850px] 2xl:max-w-[900px] lg:-translate-x-4 xl:-translate-x-6 lg:translate-y-4 xl:translate-y-4">
            {/* Image Container with Proper Dimensions & Aspect Ratio */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/10 bg-background">
              <Image
                src="/images/landing.jpg"
                alt="KNOVA team collaborating around conference table"
                width={820}
                height={535}
                priority
                className="w-full h-auto aspect-[728/475] object-cover object-top block rounded-2xl"
                sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 55vw, 900px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer spanning whole bottom (both left and right part) */}
      <footer className="w-full border-t border-border/40 py-5 text-xs text-muted-foreground bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 flex items-center justify-center text-center">
          <p>
            &copy; 2026{" "}
            <span className="font-brand font-semibold italic">
              KNOVA
            </span>{" "}
            Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
