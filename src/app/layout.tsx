import type { Metadata, Viewport } from "next";
import { Cinzel, EB_Garamond, IM_Fell_English, Tangerine } from "next/font/google";
import { getSettings } from "@/lib/data";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark",
};

const fell = IM_Fell_English({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const garamond = EB_Garamond({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const tangerine = Tangerine({
  variable: "--font-script-face",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cinzel = Cinzel({
  variable: "--font-heading-face",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.displayName} — ${settings.tagline}`,
      template: `%s · ${settings.displayName}`,
    },
    description: settings.bio,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fell.variable} ${garamond.variable} ${tangerine.variable} ${cinzel.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
