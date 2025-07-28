import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex items-center justify-center min-h-screen w-full">
      <Loader className="animate-spin size-10 text-purple-500" />
      <span className="ml-2 text-gray-500">Cargando perfil...</span>
    </main>
  )
}