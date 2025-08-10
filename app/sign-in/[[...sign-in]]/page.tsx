import { SignIn } from "@clerk/nextjs"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  )
}
