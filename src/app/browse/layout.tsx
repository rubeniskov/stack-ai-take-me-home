import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <nav className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Stack AI - Take Me Home</Link>
            </nav>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </header>
        <main className="flex-1 flex flex-col gap-20">{children}</main>
      </div>
    </div>
  );
}
