'use client';

import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded, isSignedIn } = useAuth()

  const searchParams = useSearchParams()

  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(searchParams.get('redirect_url') || "/")
    }
  }, [isLoaded, isSignedIn])

  return children;
}
