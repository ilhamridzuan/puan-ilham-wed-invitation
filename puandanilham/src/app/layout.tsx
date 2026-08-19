import type { Metadata } from "next";
import { Pinyon_Script } from "next/font/google";
import "./globals.css";

const pinyonScript = Pinyon_Script({
  weight: "400",
  variable: "--font-pinyon",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jemputan Majelis Perkahwinan | Puan & Ilham",
  description: "Anda dijemput hadir ke Majelis Perkahwinan Puan & Ilham pada 4 September 2026. Klik untuk RSVP dan informasi lengkap.",
  openGraph: {
    title: "Jemputan Majelis Perkahwinan Puan & Ilham",
    description: "Anda dijemput hadir ke Majelis Perkahwinan Puan & Ilham",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jemputan Majelis Perkahwinan Puan & Ilham",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${pinyonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif">
        <div className="flex-1 flex flex-col w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
