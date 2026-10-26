import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  /**
   * If true, displays a stacked preview image on mobile viewports (<740px).
   * Typically true for landing page and false for dense authentication forms.
   */
  showMobileImage?: boolean;
}

export function AuthSplitLayout({
  children,
  showMobileImage = false,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col min-[740px]:flex-row bg-background text-foreground">
      {/* Left Column: Content Area (50-55% width on tablet/desktop) */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-8 min-[740px]:p-8 lg:p-12 xl:p-16 min-[740px]:w-[54%] lg:w-[52%] xl:w-[50%] min-h-screen min-[740px]:min-h-0">
        {/* Top Header with Consistent Branding */}
        <header className="flex items-center justify-between pb-6 sm:pb-8">
          <Link
            href="/"
            className="group inline-flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label="NOVA Home"
          >
            <span className="text-2xl sm:text-3xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
              NOVA
            </span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-normal mt-0.5">
              Plan. Collaborate. Deliver.
            </span>
          </Link>
        </header>

        {/* Center Main Content Region */}
        <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto py-2 sm:py-6">
          {children}

          {/* Stacked mobile preview image when requested (e.g. landing page) */}
          {showMobileImage && (
            <div className="mt-8 relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-border/60 shadow-sm block min-[740px]:hidden">
              <Image
                src="/images/login.jpg"
                alt="Team collaborating around a shared workspace."
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          )}
        </main>

        {/* Footer Area */}
        <footer className="pt-6 sm:pt-8 text-xs text-muted-foreground flex items-center justify-between border-t border-border/40 mt-auto">
          <span>&copy; {new Date().getFullYear()} NOVA Platform</span>
          <span className="hidden sm:inline">Modern Team Collaboration</span>
        </footer>
      </div>

      {/* Right Column: Hero Photograph (45-50% width on tablet/desktop) */}
      <div className="hidden min-[740px]:block min-[740px]:w-[46%] lg:w-[48%] xl:w-[50%] relative border-l border-border/40 bg-muted overflow-hidden">
        <div className="sticky top-0 h-screen w-full">
          <Image
            src="/images/login.jpg"
            alt="Team collaborating around a shared workspace."
            fill
            priority
            sizes="(max-width: 1024px) 46vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
