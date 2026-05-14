import { adminDb } from "@/lib/firebase-admin";

export const getProductoById = async (id: string) => {
  const doc = await adminDb.collection("productos").doc(id).get();
    console.log(doc.data())
  if (!doc.exists) return null;

  return JSON.parse(JSON.stringify(doc.data()));
};