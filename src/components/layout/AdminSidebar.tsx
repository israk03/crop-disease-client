import { Sidebar } from "./Sidebar";
import { ADMIN_NAV } from "@/constants/nav.constants";

export function AdminSidebar() {
  return <Sidebar sections={ADMIN_NAV} />;
}