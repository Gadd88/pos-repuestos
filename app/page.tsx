import { AuthGuard } from "@/components/auth-guard"
import { redirect } from "next/navigation"

export default function HomePage() {
  
  redirect('/admin')

}
