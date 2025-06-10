import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/ClientProvider";
import ReactQueryProvider from "./components/ReactQueryProvider";
import GlobalSnackbar from "./components/GlobalSnackbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Celiac Store | Gluten-Free, Lactose-Free, Organic Food India",
  description:
    "The Celiac Store is India's one-stop shop for gluten-free, lactose-free, and organic food. Founded by a fellow celiac, we offer top Indian & International brands for healthy, delicious living. Shop online or visit our Delhi NCR store.",
  keywords: [
    "celiac store",
    "gluten free india",
    "lactose free food",
    "organic food india",
    "gluten free shop",
    "healthy food delhi",
    "international gluten free brands",
    "celiac disease food",
    "gluten free snacks",
    "lactose free snacks",
    "organic brands india",
  ],
  openGraph: {
    title: "The Celiac Store | Gluten-Free, Lactose-Free, Organic Food India",
    description:
      "The Celiac Store is India's one-stop shop for gluten-free, lactose-free, and organic food. Founded by a fellow celiac, we offer top Indian & International brands for healthy, delicious living. Shop online or visit our Delhi NCR store.",
    url: "https://theceliacstore.in/",
    siteName: "The Celiac Store",
    images: [
      {
        url: "/celiac-brand-logo.png",
        width: 512,
        height: 512,
        alt: "The Celiac Store Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/celiac-brand-logo.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: [
      { url: "/celiac-brand-logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/celiac-brand-logo.png", type: "image/png", sizes: "512x512" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ClientProvider>
          <ReactQueryProvider>
            <GlobalSnackbar />
            {children}
          </ReactQueryProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
