import type { Metadata } from "next";
import { Vollkorn, Nunito, Caveat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { PeekingCat } from "@/components/peeking-cat";
import "./globals.css";

const vollkorn = Vollkorn({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clarassoaps.github.io"),
  title: "Clara's Soap - Handcrafted Soaps for All Seasons",
  description:
    "Luxurious, natural handmade soaps crafted with love. Featuring lavender, cedarwood, peppermint, and seasonal favorites.",
  icons: { icon: "/logo_icon.png", apple: "/logo_icon.png" },
  openGraph: {
    type: "website",
    title: "Clara's Soap - Handcrafted Soaps for All Seasons",
    description:
      "Luxurious, natural handmade soaps crafted with love. Featuring lavender, cedarwood, peppermint, and seasonal favorites.",
    images: ["/banner_logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clara's Soap - Handcrafted Soaps for All Seasons",
    description: "Luxurious, natural handmade soaps crafted with love.",
    images: ["/banner_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vollkorn.variable} ${nunito.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="data-theme"
          storageKey="theme"
          defaultTheme="light"
          enableSystem={false}
        >
          <CartProvider>
            <Navbar />
            <PeekingCat />
            <main className="flex-1 pt-28">{children}</main>
            <Footer />
            <CartSidebar />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--fern)",
                  color: "#fff",
                  border: "none",
                },
              }}
            />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
