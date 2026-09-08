import Navbar from "./Navbar";

import { getCategoriesByArticleCount } from "@/actions/categories-actions";

const NavbarContainer = async () => {
  const categories = await getCategoriesByArticleCount(7, false);

  return <Navbar initialCategories={categories} />;
};

export default NavbarContainer;
