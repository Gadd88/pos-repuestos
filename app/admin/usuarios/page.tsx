"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useUsuarioStore } from "@/lib/stores/usuarios-store";
import { UsuariosTabla } from "@/components/usuarios/usuarios-tabla";
import { UsuarioNuevoModal } from "@/components/usuarios/usuarios-modal";
import Link from "next/link";

export default function UsuariosPage() {
    const { obtenerUsuarios, loading } = useUsuarioStore();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    return (
        <>
            <div className="container mx-auto px-4 py-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Link href="/admin">
                        <Button
                            variant="outline"
                            className="neo-button font-semibold bg-transparent"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            VOLVER AL DASHBOARD
                        </Button>
                    </Link>
                    <div className="ms-auto">
                        <h1
                            className="neo-heading text-4xl"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            Gestión de Vendedores
                        </h1>
                    </div>
                </div>
                <div className="flex justify-between md:items-center flex-col md:flex-row gap-4">
                    <Button
                        className="neo-button bg-purple-600"
                        onClick={() => setOpenModal(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Vendedor
                    </Button>
                </div>

                {loading ? (
                    <div className="container">
                        <p>Cargando usuarios...</p>
                    </div>
                ) : (
                    <UsuariosTabla />
                )}
            </div>

            {openModal && (
                <UsuarioNuevoModal onClose={() => setOpenModal(false)} />
            )}
        </>
    );
}
