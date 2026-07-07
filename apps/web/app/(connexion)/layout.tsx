import Footer from "@/components/layout/footer/Footer";
import NavbarTitle from "@/components/layout/navbar/NavbarTitle";

export default function ConnexionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand text-brand-foreground flex h-[75px] items-center border-b border-white/10 px-6 sm:px-10">
        <NavbarTitle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        {children}
      </main>

      <Footer />
    </div>
  );
}
