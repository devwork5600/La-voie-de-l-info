import Sidebar from "./Sidebar";

import { getCategoriesByArticleCount } from "@/actions/categories-actions";

const SidebarContainer = async () => {
  const categories = await getCategoriesByArticleCount(10, false);

  return <Sidebar initialCategories={categories} />;
};

export default SidebarContainer;
