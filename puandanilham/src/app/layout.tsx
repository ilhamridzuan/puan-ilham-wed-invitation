import type { Metadata } from "next";
import { Pinyon_Script } from "next/font/google";
import "./globals.css";

const pinyonScript = Pinyon_Script({
  weight: "400",
  variable: "--font-pinyon",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Undangan Pernikahan | Puan & Ilham",
  description: "Undangan digital pernikahan Puan & Ilham",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${pinyonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif">{children}</body>
    </html>
  );
}
