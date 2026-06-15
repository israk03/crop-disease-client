import { Sidebar } from "./Sidebar";
import { FARMER_NAV } from "@/constants/nav.constants";

export function FarmerSidebar() {
  return <Sidebar sections={FARMER_NAV} />;
}