import type { Metadata } from "next";
import { Geist, Geist_Mono , Poppins} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const moderniz = localFont({
  src: "../public/fonts/Moderniz.otf",
  variable: "--font-moderniz",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight : "400",
});

export const metadata: Metadata = {
  title: "Quantum",
  description: "Learn and build with us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${moderniz.variable} ${poppins.variable} antialiased bg-background`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
