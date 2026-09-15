import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { obtenerUsuarioDesdeRequest } from "@/lib/helpers/usuario"
import { registrarMovimientoStock } from "@/lib/helpers/movimientos-stock"

export async function POST(req: Request) {
  const { ventaId } = await req.json()
  const { negocioId, uid } = await obtenerUsuarioDesdeRequest(req)

  const usuarioSnap = adminDb.collection("usuarios").doc(uid).get();
    if (!usuarioSnap) {
        return NextResponse.json(
            {
                success: false,
                error: "Usuario no encontrado"
            },
            {
                status: 404
            }
        );
    }

    const usuarioData = (await usuarioSnap).data();

    if (usuarioData?.negocioId !== negocioId) {
        return NextResponse.json(
            {
                error: "Usuario no pertenece al negocio",
            },
            { status: 403 }
        );
    }

    const vendedorNombre = usuarioData?.nombreUsuario ?? usuarioData?.email ?? uid;

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

        if (!item.idProducto) continue

        const productoRef = adminDb.collection("productos").doc(item.idProducto)

        const productoSnap = await transaction.get(productoRef)

        if (!productoSnap.exists) continue

        productosData.push({ ref: productoRef, data: productoSnap.data(), cantidad: item.cantidad, nombre: item.nombre })
      }

      if (venta?.estado !== "presupuesto") {
        for (const producto of productosData) {

          const stockActual = producto.data?.stock || 0
          const nuevoStock = stockActual + producto.cantidad

          transaction.update(producto.ref, {
            stock: nuevoStock,
          })
          registrarMovimientoStock({
            tx: transaction,
            negocioId,
            productoId: producto.ref.id,
            productoNombre: producto.nombre,
            tipo: "cancelacion_venta",
            cantidad: +producto.cantidad,
            stockAnterior: stockActual,
            stockNuevo: nuevoStock,
            ventaId: ventaRef.id,
            usuarioId: uid,
            usuarioNombre: vendedorNombre,
            motivo: "Cancelación de venta"
          });
        }
      }

      transaction.update(ventaRef, {
        estado: "cancelada",
        canceladoEn: new Date(),
        canceladoPor: uid
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