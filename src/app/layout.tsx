import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
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
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        <ClerkThemeProvider>
          <StoreProvider>
            <LayoutShell>{children}</LayoutShell>
          </StoreProvider>
        </ClerkThemeProvider>
      </body>
    </html>
  );
}