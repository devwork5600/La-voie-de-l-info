import { redirect } from "next/navigation";

import AuthorNav from "./components/AuthorNav";
import AuthorSidebar from "./components/AuthorSidebar";

import { getUser } from "@/lib/auth/auth-session";

export default async function AuthorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user || (user.role !== "AUTHOR" && user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="bg-muted/30 flex min-h-screen flex-col">
      <AuthorNav />
      <AuthorSidebar />
      <main className="grow">{children}</main>
    </div>
  );
}
