import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeMastery | Master the Art of Profitable Trading",
  description: "Join thousands of traders learning technical analysis, risk management, and psychology. The #1 LMS for aspiring professional traders.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trademastery.com",
    siteName: "TradeMastery",
    title: "TradeMastery | Master the Art of Profitable Trading",
    description: "Join thousands of traders learning technical analysis, risk management, and psychology. The #1 LMS for aspiring professional traders.",
    images: [
      {
        url: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=stock%20market%20candlestick%20chart%20dark%20mode%20dashboard%20modern%20ui&image_size=landscape_16_9",
        width: 1200,
        height: 630,
        alt: "TradeMastery Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeMastery | Master the Art of Profitable Trading",
    description: "Join thousands of traders learning technical analysis, risk management, and psychology. The #1 LMS for aspiring professional traders.",
    images: ["https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=stock%20market%20candlestick%20chart%20dark%20mode%20dashboard%20modern%20ui&image_size=landscape_16_9"],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-slate-900">
      <Navbar />
      <main className="h-full ">
        {children}
      </main>
      <Footer />
    </div>
  );
}
