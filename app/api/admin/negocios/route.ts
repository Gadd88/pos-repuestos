import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminDb } from "@/lib/firebase-admin"

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const sessionData = JSON.parse(session.value)

  console.log("Session data:", sessionData)

  if (!sessionData?.esSuperAdmin) {
    return NextResponse.json({ error: "Acción no permitida" }, { status: 403 })
  }

  const snapshot = await adminDb.collection("negocios").get()

  const negocios = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  return NextResponse.json(negocios)
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const sessionData = JSON.parse(session.value)

  if (!sessionData?.esSuperAdmin) {
    return NextResponse.json({ error: "Acción no permitida" }, { status: 403 })
  }

  const { id, activo } = await req.json()

  const negocioRef = await adminDb.collection("negocios").doc(id)
  await adminDb.collection("negocios").doc(id).update({
    activo: !activo,
  })

  return NextResponse.json({ success: true })
}