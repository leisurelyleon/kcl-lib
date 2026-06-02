import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "kcl-diff — semantic diff for KCL",
  description:
    "Structural diff for KCL (Zoo's CAD language), powered by Zoo's own kcl-lib parser compiled to WebAssembly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
