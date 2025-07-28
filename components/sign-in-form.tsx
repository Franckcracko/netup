'use client';

import { useAuth } from "@/hooks/use-auth"
import { Button } from "./ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const SignInForm = () => {
  const { handleLogin } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false })

  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <CardHeader className="my-6">
        <CardTitle className="text-white">Bienvenido de vuelta</CardTitle>
        <CardDescription className="text-gray-400">Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          setIsLoading(true)
          try {
            const newErrors = await handleLogin(loginData)

            if (newErrors) {
              toast.error("Error al iniciar sesión. Por favor, revisa tus credenciales.")
              console.log(newErrors)
            }
          } catch (error) {
            toast.error("Error al iniciar sesión. Inténtalo de nuevo más tarde.")
            console.log(error)
          } finally {
            setIsLoading(false)
          }
        }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-white">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="bg-[#1a1a1a] border-gray-600 text-white"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-white">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="bg-[#1a1a1a] border-gray-600 text-white pr-10"
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full text-white bg-purple-600 hover:bg-purple-700">
            {
            isLoading ? "Cargando..." : "Iniciar Sesión"
            }
          </Button>
        </form>
      </CardContent>
    </>

  )
}