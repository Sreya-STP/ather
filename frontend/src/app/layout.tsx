import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aether — AI Career Coach & Startup Mentor",
  description: "Personalized career guidance, skill gap analysis, learning roadmaps, interview prep, and startup strategy powered by Claude AI.",
  keywords: ["AI career coach", "startup mentor", "skill gap analysis", "interview prep", "career roadmap"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
