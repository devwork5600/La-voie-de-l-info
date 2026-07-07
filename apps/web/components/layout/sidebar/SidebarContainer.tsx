

import { getCategoriesByArticleCount } from "@/actions/categories-actions";
import Sidebar from "./Sidebar";

const SidebarContainer = async () => {
  const categories = await getCategoriesByArticleCount(10, false);

  return <Sidebar initialCategories={categories} />;
};

export default SidebarContainer;
