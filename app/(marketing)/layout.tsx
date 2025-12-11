import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-slate-900">
      <Navbar />
      <main className="h-full pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
