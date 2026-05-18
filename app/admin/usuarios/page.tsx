"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUsuarioStore } from "@/lib/stores/usuarios-store";
import { UsuariosTabla } from "@/components/usuarios/usuarios-tabla";
import { UsuarioNuevoModal } from "@/components/usuarios/usuarios-modal";

export default function UsuariosPage() {
  const { obtenerUsuarios, loading } = useUsuarioStore();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between md:items-center flex-col md:flex-row gap-4">
          <h1 className="neo-heading text-3xl">
            Gestión de Vendedores
          </h1>

          <Button
            className="neo-button bg-purple-600"
            onClick={() => setOpenModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Vendedor
          </Button>
        </div>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <UsuariosTabla />
        )}
      </main>

      {openModal && (
        <UsuarioNuevoModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
}