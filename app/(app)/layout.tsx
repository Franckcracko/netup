import { UserProvider } from "@/context/user-context";
import { Navbar } from "../../components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-[#1a1a1a]">
        <Navbar />
        {children}
      </div>
    </UserProvider>
  );
}
