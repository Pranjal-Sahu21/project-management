import type { Metadata } from "next";
import StoreProvider from "./StoreProvider";
import LayoutShell from "../components/LayoutShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Management Platform",
  description: "A premium project management dashboard to track your workspaces, tasks, calendars, and team collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <LayoutShell>{children}</LayoutShell>
        </StoreProvider>
      </body>
    </html>
  );
}
