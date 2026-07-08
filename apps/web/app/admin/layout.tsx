import { redirect } from "next/navigation";

import AdminNav from "./components/AdminNav";
import AdminSidebar from "./components/AdminSidebar";

import { getUser } from "@/lib/auth/auth-session";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="bg-muted/30 flex min-h-screen flex-col">
      <AdminNav />
      <AdminSidebar />
      <main className="grow">{children}</main>
    </div>
  );
}
