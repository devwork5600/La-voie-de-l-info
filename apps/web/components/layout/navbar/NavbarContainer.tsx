import { getCategoriesByArticleCount } from "@/actions/categories-actions";
import Navbar from "./Navbar";

const NavbarContainer = async () => {
  const categories = await getCategoriesByArticleCount(7, false);

  return <Navbar initialCategories={categories} />;
};

export default NavbarContainer;
