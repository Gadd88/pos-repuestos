"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { UsuarioType } from "@/lib/types";
import { toast } from "sonner";
import { useEliminarUsuario } from "@/features/usuarios/useUsuarios";

interface UsuarioDeleteDialogProps {
    usuario: UsuarioType | null;
    onClose: () => void;
}

export function UsuarioDeleteDialog({
    usuario,
    onClose,
}: UsuarioDeleteDialogProps) {
    const { mutateAsync: eliminarUsuario, isPending } = useEliminarUsuario();

    const handleDelete = async () => {
        if (usuario) {
            await eliminarUsuario(usuario.id ?? usuario.uid);
            toast.success("Vendedor eliminado correctamente", {
                style: {
                    background: "blanchedalmond",
                    fontWeight: "bold",
                },
            });
            onClose();
        }
    };

    return (
        <Dialog open={!!usuario} onOpenChange={onClose}>
            <DialogContent className="neo-card max-w-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[95%]">
                <DialogHeader>
                    <DialogTitle
                        className="neo-heading text-xl flex items-center gap-2"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        <Trash2 className="w-5 h-5 text-destructive" />
                        ELIMINAR Vendedor
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Estas seguro que quiere eliminar el usuario del
                        vendedor: "{usuario?.nombreUsuario}"? Esta acción no
                        puede deshacerse.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="neo-button font-bold bg-transparent"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        CANCELAR
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="neo-button font-bold"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                        {isPending ? "ELIMINANDO..." : "ELIMINAR VENDEDOR"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
