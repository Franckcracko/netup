'use client';

import { createUser, verifyUsername } from "@/app/actions";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { isLoaded, signIn, setActive } = useSignIn()
  const { isLoaded: isLoadedSignUp, signUp, setActive: setActiveSignUp } = useSignUp()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  }

  const validateFullName = (name: string) => {
    return name.trim().split(" ").length >= 2
  }

  const validateUsername = (username: string) => {
    return /^[a-zA-Z0-9]+$/.test(username) && username.length >= 3
  }

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const newErrors: Record<string, string> = {}

    if (!isLoaded) return

    if (!validateEmail(email)) {
      newErrors.email = "Email inválido"
    }
    if (!password) {
      newErrors.password = "Contraseña requerida"
    }


    if (Object.keys(newErrors).length > 0) {
      return newErrors
    }

    const signInAttempt = await signIn.create({
      identifier: email,
      password,
    })

    // If sign-in process is complete, set the created session as active
    // and redirect the user
    if (signInAttempt.status === 'complete') {
      await setActive({ session: signInAttempt.createdSessionId })
      router.replace(searchParams.get('redirect_url') || "/")
    } else {
      // If the status is not complete, check why. User may need to
      // complete further steps.
      throw new Error(JSON.stringify(signInAttempt, null, 2))
    }
  }

  const handleVerify = async ({ code }: { code: string }) => {
    if (!isLoadedSignUp) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActiveSignUp({ session: signUpAttempt.createdSessionId })
        router.replace(searchParams.get('redirect_url') || "/")
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2))
    }
  }

  const handleRegister = async ({
    email,
    fullName,
    username,
    password,
  }: {
    email: string;
    fullName: string;
    username: string;
    password: string;
  }) => {
    const newErrors: Record<string, string> = {}

    if (!isLoadedSignUp) return

    if (!validateEmail(email)) {
      newErrors.email = "Email inválido"
    }
    if (!validateFullName(fullName)) {
      newErrors.fullName = "Debe incluir nombre y apellido"
    }
    if (!validateUsername(username)) {
      newErrors.username = "Solo letras y números, mínimo 3 caracteres"
    }
    if (!validatePassword(password)) {
      newErrors.password = "Mínimo 8 caracteres, incluir mayúsculas y números"
    }

    if (Object.keys(newErrors).length > 0) {
      return newErrors
    }

    // Check if the username is available
    const isUsernameAvailable = await verifyUsername(username)

    if (!isUsernameAvailable) {
      toast.error("El nombre de usuario no está disponible")
      newErrors.username = "Nombre de usuario no disponible"
      return newErrors
    }

    await signUp.create({
      emailAddress: email,
      password,
    })

    await createUser({
      email,
      fullName,
      username,
    })

    // Send the user an email with the verification code
    await signUp.prepareEmailAddressVerification({
      strategy: 'email_code',
    })
  }

  return {
    handleLogin,
    handleRegister,
    validateEmail,
    validatePassword,
    validateFullName,
    validateUsername,
    handleVerify
  }
}