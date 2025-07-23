import { Navbar } from "../../components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      {children}
    </div>
  );
}
