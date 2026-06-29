import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Our Team",
  description:
    "Get in touch with the Zynero product team. Request a sales demo, ask for tech support, or provide feedback on our project management tool.",
  keywords: [
    "Contact Zynero",
    "Zynero support",
    "Request project management demo",
    "SaaS help desk",
    "Zynero email support",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Our Team | Zynero",
    description: "Have questions about Zynero? Drop us a message, and our product specialists will guide you through.",
    url: "https://zynero-delta.vercel.app/contact",
    type: "website",
  },
  twitter: {
    title: "Contact Our Team | Zynero",
    description: "Have questions about Zynero? Drop us a message, and our product specialists will guide you through.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
