import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Base Layout — thin wrapper used only for non-widget, non-dashboard routes.
 * Widget and Dashboard use their own layout components.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        Ga naar hoofdinhoud
      </a>
      <main id="main-content">{children}</main>
    </div>
  );
}
