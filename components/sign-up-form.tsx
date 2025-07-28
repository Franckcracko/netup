'use client';

import { useState } from "react"
import { Button } from "./ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export const SignUpForm = () => {
  const { handleRegister, handleVerify } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [registerData, setRegisterData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  })

  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  if (verifying) {
    return (
      <>
        <CardHeader className="my-6">
          <CardTitle className="text-white">Verifica tu correo</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setIsLoading(true)
              try {
                await handleVerify({ code })
              } catch {
                toast.error("Error al verificar el código. Inténtalo de nuevo.")
              } finally {
                setIsLoading(false)
              }
            }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <Label id="code" className="mb-2">
                Código de verificación
              </Label>
              <Input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} className="mb-1" />
              <p className="text-sm text-gray-400">
                Revisa tu correo electrónico para obtener el código de verificación.
              </p>
            </div>
            <Button type="submit">
              {isLoading ? "Verificando..." : "Verificar Código"}
            </Button>
          </form>
        </CardContent>
      </>
    )
  }

  return (
    <>
      <CardHeader className="my-6">
        <CardTitle className="text-white">Crear cuenta</CardTitle>
        <CardDescription className="text-gray-400">Únete a la comunidad NetUP</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={async (e) => {
          e.preventDefault()
          setIsLoading(true)
          try {
            await handleRegister({
              email: registerData.email,
              fullName: registerData.fullName,
              username: registerData.username,
              password: registerData.password,
            })
            setIsLoading(false)
            setVerifying(true)
          } catch (error) {
            console.log(error)
            toast.error("Error al crear la cuenta. Inténtalo de nuevo.")
            setIsLoading(false)
          }
        }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-white">
              Email
            </Label>
            <Input
              id="register-email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              className="bg-[#1a1a1a] border-gray-600 text-white"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-fullname" className="text-white">
              Nombre Completo
            </Label>
            <Input
              required
              id="register-fullname"
              value={registerData.fullName}
              onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              className="bg-[#1a1a1a] border-gray-600 text-white"
              placeholder="Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-username" className="text-white">
              Nombre de Usuario
            </Label>
            <Input
              required
              id="register-username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              className="bg-[#1a1a1a] border-gray-600 text-white"
              placeholder="juanperez123"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-white">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                required
                id="register-password"
                type={showPassword ? "text" : "password"}
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
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

          <div id="clerk-captcha" />

          <p className="text-sm text-gray-400">
            Al hacer clic en &quot;Crear Cuenta&quot;, aceptas nuestros{" "}
            <Link href="/terms" className="text-purple-500 hover:underline">
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link href="/privacy" className="text-purple-500 hover:underline">
              Política de Privacidad
            </Link>.
          </p>

          <Button type="submit" className="text-white w-full bg-purple-600 hover:bg-purple-700">
            {isLoading ? <Loader className="size-6 animate-spin" /> : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
    </>
  )
}