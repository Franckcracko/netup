"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageCircle, Heart } from "lucide-react"
import { SignInForm } from "@/components/sign-in-form"
import { SignUpForm } from "@/components/sign-up-form"
import { useAuth } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn } = useAuth()

  const router = useRouter()

  if (!isLoaded) return null // Prevent rendering until auth state is loaded

  if (isLoaded && isSignedIn) {
    router.replace(searchParams.get('redirect_url') || "/")
    return null
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">NetUP</h1>
          </div>
          <p className="text-gray-400">Conecta, comparte y descubre</p>
        </div>

        <Card className="rounded-lg bg-[#2d2d2d] border-gray-700 pt-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a]">
              <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-purple-600">
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <SignInForm />
            </TabsContent>

            <TabsContent value="register">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-purple-400" />
              <span>Conecta</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span>Comparte</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Descubre</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
