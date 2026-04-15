import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface WidgetLayoutProps {
  children?: ReactNode;
}

/**
 * Widget Layout — warm cream background, centered card, no navigation.
 * Used for the guest-facing reservation widget at /widget.
 * Uses inline styles for iframe isolation — intentional pattern.
 */
export function WidgetLayout({ children }: WidgetLayoutProps) {
  const { t: tShared } = useTranslation("shared");
  const { t: tWidget } = useTranslation("widget");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-8 px-4"
      style={{ backgroundColor: "#FAF7F0" }}
    >
      <a
        href="#widget-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        {tWidget("skipLink")}
      </a>
      <div className="w-full max-w-lg">
        <main id="widget-main">{children ?? <Outlet />}</main>
      </div>
      <footer className="mt-8 text-center text-xs" style={{ color: "#9CA3AF" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LanguageSwitcher variant="footer" />
          <p>
            © {new Date().getFullYear()}. {tShared("branding.builtWith")}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
