import Link from "next/link";
import React from "react";
import { User } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t-4 border-border mt-8 py-4 mb-2">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} RepuestoStock. Todos los
                derechos reservados.
            </div>
            <div className="flex justify-center items-center mx-auto px-4 text-center text-sm text-muted-foreground mt-2 neo-card w-fit">
                Creado por
                <Link
                    href="https://ar.linkedin.com/in/matias-saade"
                    target="_blank"
                    className="font-bold text-sky-600 flex items-center gap-1"
                >
                    <User className="w-4 h-4 ml-1 text-sky-700" />
                    Matias Saade
                </Link>
            </div>
        </footer>
    );
}
