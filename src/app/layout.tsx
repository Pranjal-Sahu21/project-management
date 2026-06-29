import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Manrope } from "next/font/google";
import StoreProvider from "./StoreProvider";
import LayoutShell from "../components/LayoutShell";
import ClerkThemeProvider from "../components/ClerkThemeProvider";
// @ts-ignore
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zynero-delta.vercel.app"),
  title: {
    default: "Zynero | Premium Project Management for High-Velocity Teams",
    template: "%s | Zynero",
  },
  description:
    "Zynero is a premium, real-time project management platform to orchestrate team tasks, project workloads, calendars, discussion comments, and visual analytics dashboards.",
  keywords: [
    "Zynero",
    "project management",
    "task manager dashboard",
    "collaboration tool",
    "developer task board",
    "team productivity tracker",
    "SaaS dashboard",
    "real-time comments",
    "agile analytics",
    "Clerk authentication",
    "Prisma database",
    "Chart.js project insights",
  ],
  authors: [{ name: "Zynero Inc." }],
  creator: "Zynero Inc.",
  publisher: "Zynero Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zynero-delta.vercel.app",
    title: "Zynero | Premium Project Management for High-Velocity Teams",
    description: "Zynero is a premium, real-time project management platform to orchestrate team tasks, project workloads, calendars, discussion comments, and visual analytics dashboards.",
    siteName: "Zynero",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Zynero Project Management Platform Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zynero | Premium Project Management for High-Velocity Teams",
    description: "Zynero is a premium, real-time project management platform to orchestrate team tasks, project workloads, calendars, discussion comments, and visual analytics dashboards.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <ClerkThemeProvider>
          <StoreProvider>
            <LayoutShell>{children}</LayoutShell>
          </StoreProvider>
        </ClerkThemeProvider>
      </body>
    </html>
  );
}