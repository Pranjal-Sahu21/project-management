"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

export default function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ClerkProvider
      appearance={{
        theme: isDark ? dark : undefined,
        variables: isDark
          ? {
              colorBackground: "#09090b",
              colorNeutral: "#374151",
              borderRadius: "0.375rem",
            }
          : {
              borderRadius: "0.375rem",
            },
        elements: isDark
          ? {
              socialButtonsBlockButtonText: {
                color: "#ffffff",
              },
              socialButtonsBlockButton: {
                backgroundColor: "#27272a",
                borderColor: "#374151",
                "&:hover": {
                  backgroundColor: "#3f3f46",
                },
              },
              dividerText: {
                color: "#a1a1aa",
              },
              dividerLine: {
                backgroundColor: "#374151",
              },

              // User button dropdown
              userButtonPopoverCard: {
                backgroundColor: "#09090b",
                borderColor: "#374151",
              },
              userButtonPopoverActionButton: {
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#27272a",
                },
              },
              userButtonPopoverActionButtonText: {
                color: "#ffffff",
              },
              userButtonPopoverActionButtonIcon: {
                color: "#a1a1aa",
              },
              userButtonPopoverFooter: {
                borderColor: "#374151",
              },
              userPreviewMainIdentifier: {
                color: "#ffffff",
              },
              userPreviewSecondaryIdentifier: {
                color: "#a1a1aa",
              },
            }
          : {},
      }}
    >
      {children}
    </ClerkProvider>
  );
}
