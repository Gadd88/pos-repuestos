"use client"

import { useProductosStore } from "@/lib/stores/products-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { ProductoType } from "@/lib/types"

interface ProductDeleteDialogProps {
  productId: ProductoType['id'] | null
  onClose: () => void
}

export function ProductDeleteDialog({ productId, onClose }: ProductDeleteDialogProps) {
  const { eliminarProducto, obtenerProductoPorId } = useProductosStore()
  const producto = productId ? obtenerProductoPorId(productId) : null

  const handleDelete = async () => {
    if (productId) {
      await eliminarProducto(productId)
      onClose()
    }
  }

  return (
    <Dialog open={!!productId} onOpenChange={onClose}>
      <DialogContent className="neo-card max-w-md">
        <DialogHeader>
          <DialogTitle
            className="neo-heading text-xl flex items-center gap-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            <Trash2 className="w-5 h-5 text-destructive" />
            ELIMINAR PRODUCTO
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Estas seguro que quiere eliminar "{producto?.nombre}"? Esta acción no puede deshacerse.
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
            className="neo-button font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ELIMINAR PRODUCTO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
