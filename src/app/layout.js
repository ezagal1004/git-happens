import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  title: "Git Tutorial: Adult Swim Edition - Learn Version Control Without Losing Your Mind",
  description: "A profanity-laden, interactive Git tutorial that teaches real version control workflows through corporate dysfunction and dark humor. Master cloning, committing, branching, and merging while questioning your life choices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} ${vt323.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}