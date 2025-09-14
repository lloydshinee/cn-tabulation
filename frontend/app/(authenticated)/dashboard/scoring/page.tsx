import { SiteHeader } from "@/components/site-header";
import TeamControl from "./TeamControl";
import PortionControl from "./PortionControl";
import ScoringState from "./ScoringState";
import CriteriaControl from "./CriteriaControll";

export default function ScoringPage() {
  return (
    <main>
      <SiteHeader title="Scoring" />
      <section className="w-full p-10 space-y-8">
        <ScoringState />
        <PortionControl />
        <CriteriaControl />
        <TeamControl />
      </section>
    </main>
  );
}
