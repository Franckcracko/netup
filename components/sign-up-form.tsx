'use client';

import { useState } from "react"
import { Button } from "./ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";

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

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (verifying) {
    return (
      <>
        <h1>Verifica tu correo</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            await handleVerify({ code })
          }}
        >
          <Label id="code">Enter your verification code</Label>
          <Input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} />
          <Button type="submit">Verify</Button>
        </form>
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
          try {
            await handleRegister({
              email: registerData.email,
              fullName: registerData.fullName,
              username: registerData.username,
              password: registerData.password,
            })
            setVerifying(true)
          } catch (error) {
            console.error("Error during registration:", error)
            setErrors({ general: "Error al crear la cuenta. Inténtalo de nuevo." })
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
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-fullname" className="text-white">
              Nombre Completo
            </Label>
            <Input
              id="register-fullname"
              value={registerData.fullName}
              onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              className="bg-[#1a1a1a] border-gray-600 text-white"
              placeholder="Juan Pérez"
            />
            {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-username" className="text-white">
              Nombre de Usuario
            </Label>
            <Input
              id="register-username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              className="bg-[#1a1a1a] border-gray-600 text-white"
              placeholder="juanperez123"
            />
            {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-white">
              Contraseña
            </Label>
            <div className="relative">
              <Input
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
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          <div id="clerk-captcha" />

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Crear Cuenta
          </Button>
        </form>
      </CardContent>
    </>
  )
}