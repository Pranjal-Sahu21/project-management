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
  title: "Project Management Platform",
  description:
    "A premium project management dashboard to track your workspaces, tasks, calendars, and team collaboration.",
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