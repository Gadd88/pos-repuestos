import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario"
import { ProductoType } from "@/lib/types"

export async function POST(req: Request) {
  const { ventaId } = await req.json()
  const { negocioId } = await obtenerUsuarioDesdeRequest(req)

  try {
    await adminDb.runTransaction(async (transaction) => {
      const ventaRef = adminDb.collection("ventas").doc(ventaId)
      const ventaSnap = await transaction.get(ventaRef)

      if (!ventaSnap.exists) {
        throw new Error("Venta no existe")
      }

      const venta = ventaSnap.data()

      if (venta?.negocioId !== negocioId) {
        throw new Error("Forbidden")
      }
      if (venta?.estado === "cancelada") {
        throw new Error("Venta ya cancelada")
      }

      const productosData = []

      
      for (const item of venta?.items) {
        
        if(!item.idProducto) continue

        const productoRef = adminDb.collection("productos").doc(item.idProducto)

        const productoSnap = await transaction.get(productoRef)

        if (!productoSnap.exists) continue

        productosData.push({ ref: productoRef, data: productoSnap.data(), cantidad: item.cantidad })
      }

         for (const producto of productosData) {

        const stockActual = producto.data?.stock || 0
        const nuevoStock = stockActual + producto.cantidad

        transaction.update(producto.ref, {
          stock: nuevoStock,
        })
      }

      transaction.update(ventaRef, {
        estado: "cancelada",
        canceladoEn: new Date(),
      })
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Error al cancelar venta:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}