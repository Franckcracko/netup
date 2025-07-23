'use client';

import { LogOut, Users } from "lucide-react"
import { Button } from "./ui/button";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <header className="bg-[#2d2d2d] border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">NetUP</h1>
          </div>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </Link>
            <Link href="/friends">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                Amigos
              </Button>
            </Link>
            <SignOutButton>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </SignOutButton>
          </div>

          {/* Navegación Mobile */}
          <div className="flex md:hidden items-center gap-1">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                <Users className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/friends">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                <Users className="w-5 h-5" />
              </Button>
            </Link>
            <SignOutButton>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                <LogOut className="w-5 h-5" />
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </header>
  )
}