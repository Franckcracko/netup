'use client';

import { getUserByEmail } from "@/data/user";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { createContext, useEffect, useState } from "react";

interface UserContextType {
  user: User | null;
  handleChangeUser: (newUser: User) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode; }) => {
  const { user: userClerk, isLoaded, isSignedIn } = useUser()

  const [user, setUser] = useState<User | null>(null);

  const handleChangeUser = (newUser: User) => {
    setUser(newUser);
  }

  useEffect(() => {
    const getUser = async () => {
      if (!isLoaded) return

      if (isLoaded && !isSignedIn) return

      try {
        const userData = await getUserByEmail(userClerk!.emailAddresses[0]?.emailAddress || "")
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    getUser()
  }, [isLoaded, isSignedIn, userClerk])

  return (
    <UserContext.Provider value={{ user, handleChangeUser }}>
      {children}
    </UserContext.Provider>
  );
};