import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/ClientProvider";
import ReactQueryProvider from "./components/ReactQueryProvider";
import GlobalSnackbar from "./components/GlobalSnackbar";
import FloatingCart from "./components/floater/FloatingCart";
import DeliveryNotice from "./components/DeliveryNotice";

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
  verification: {
    google: "PPQZKyGutSkswX5meYXCXHa7d1owezZSJWaRnUPOUIk",
  },
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
      { url: "/brand-favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/brand-favicon.png", type: "image/png", sizes: "16x16" },
      { url: "/brand-favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/brand-favicon.png", type: "image/png" }],
    apple: [{ url: "/brand-favicon.png", type: "image/png", sizes: "180x180" }],
    other: [{ url: "/brand-favicon.png", type: "image/png", sizes: "192x192" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PQVSM5QJ');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="icon" type="image/png" sizes="32x32" href="/brand-favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/brand-favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/brand-favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/brand-favicon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PQVSM5QJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ClientProvider>
          <ReactQueryProvider>
            <DeliveryNotice />
            <GlobalSnackbar />
            {children}
            <FloatingCart />
          </ReactQueryProvider>
        </ClientProvider>
      </body>
    </html>
  );
}