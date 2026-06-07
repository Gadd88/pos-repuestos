import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/auth-zustand";
import { Toaster } from "sonner";
import Footer from "@/components/footer";
import { AdminHeader } from "@/components/admin/admin-header";

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-montserrat",
    weight: ["400", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-open-sans",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "POS - Inventario de Repuestos",
    description: "Sistema de inventario y control de stock para locales de repuestos de motos",
    generator: "Matias Saade",
    manifest: "/manifest.json",
    // themeColor: "#0ea5e9",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${montserrat.variable} ${openSans.variable} antialiased`}
        >
            <body className="min-h-screen bg-background font-sans flex flex-col">
                <AuthInitializer>
                    <AdminHeader />
                    <Toaster position="top-center"/>
                    <main className="flex flex-1">
                        {children}
                    </main>
                    <div id="modal" />
                    <Footer />
                </AuthInitializer>
            </body>
        </html>
    );
}
