import { getRootCategoriesWithChildren } from "@/actions/categories-actions";
import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/navbar/Navbar";
import Sidebar from "@/components/layout/sidebar/Sidebar";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getRootCategoriesWithChildren();
  return (
    <>
      <Navbar initialCategories={categories} />
      <Sidebar initialCategories={categories} />
      <div className="pt-[75px]">{children}</div>
      <Footer />
    </>
  );
}
