'use client';

import { useAuth } from "@/hooks/use-auth"
import { Button } from "./ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const SignInForm = () => {
  const { handleLogin } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false })
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <>
      <CardHeader className="my-6">
        <CardTitle className="text-white">Bienvenido de vuelta</CardTitle>
        <CardDescription className="text-gray-400">Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          try {
            const newErrors = await handleLogin(loginData)

            if (newErrors) {
              setErrors(newErrors)
              console.error("Login errors:", newErrors)
            }
          } catch (error) {
            console.error("Error during login:", error)
            setErrors({ general: "Error al iniciar sesión. Inténtalo de nuevo." })
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
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
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
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full text-white bg-purple-600 hover:bg-purple-700">
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </>

  )
}