import { Sidebar } from "./Sidebar";
import { EXPERT_NAV } from "@/constants/nav.constants";

export function ExpertSidebar() {
  return <Sidebar sections={EXPERT_NAV} />;
}