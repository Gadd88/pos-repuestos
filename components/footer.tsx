import Link from "next/link";
import React from "react";
import {} from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t-4 border-border mt-8 py-4 max-h-20">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} RepuestoStock. Todos los
                derechos reservados.
            </div>
            <div className="container flex justify-center gap-1 mx-auto px-4 text-center text-sm text-muted-foreground mt-2">
                Creado por
                <Link
                    href="https://ar.linkedin.com/in/matias-saade"
                    target="_blank"
                    className="font-bold text-sky-600"
                >
                    Matias Saade
                </Link>
            </div>
        </footer>
    );
}
