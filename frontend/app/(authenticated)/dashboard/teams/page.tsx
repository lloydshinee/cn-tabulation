import { SiteHeader } from "@/components/site-header";
import TeamsList from "./teams-list";

export default function TeamsPage() {
  return (
    <main>
      <SiteHeader title="Teams" />
      <TeamsList />
    </main>
  );
}
