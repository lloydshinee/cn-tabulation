import { SiteHeader } from "@/components/site-header";
import { PortionList } from "./portion-list";

export default function PortionsPage() {
  return (
    <main>
      <SiteHeader title="Portions" />
      <PortionList />
    </main>
  );
}
