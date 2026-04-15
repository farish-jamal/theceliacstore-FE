import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/ClientProvider";
import ReactQueryProvider from "./components/ReactQueryProvider";
import GlobalSnackbar from "./components/GlobalSnackbar";
import FloatingCart from "./components/floater/FloatingCart";
import WhatsAppStrip from "./components/WhatsAppStrip";
import Header from "./components/layout/Header";

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
 <div className="fixed top-0 left-0 right-0 z-50">
      <Header />
    </div>
    <div className="h-[36px]" />
    <GlobalSnackbar />
    {children}
    <FloatingCart />
    <WhatsAppStrip />
    <a
      href="https://wa.me/919810107887"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-28 right-4 z-40 w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center"
      aria-label="Chat with us on WhatsApp"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.121 1.527 5.847L.057 23.998l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.358-.213-3.743.981 1-3.645-.234-.374A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
      </svg>
    </a>
  </ReactQueryProvider>
</ClientProvider>
      </body>
    </html>
  );
}