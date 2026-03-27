import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Loctech Easter Discount",
  description: "Easter Luck is Here :Tap an Egg & Save Big!   ",
};

export default async function RootLayout({ children }) {
  // const cookieStore = await cookies();
  // const token = cookieStore.get('token');

  // if (!token) {
  //   redirect('/control');
  // }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Navbar/>
        {children}
      </body>
    </html>
  );
}
