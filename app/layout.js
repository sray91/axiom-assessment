import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Axiom Assessment Tool",
  description: "Smart manufacturing assessment and ROI tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          <div className="container mx-auto px-4">
            &copy; {new Date().getFullYear()} Axiom Assessment Tool
          </div>
        </footer>
      </body>
    </html>
  );
}
