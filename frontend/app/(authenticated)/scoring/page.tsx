// page.tsx
"use client";
import { useScoring } from "@/providers/ScoringProvider";
import ScoringHeader from "./scoring-header";
import ScoringGrid from "./scoring-grid";

export default function ScoringPage() {
  const { scoring } = useScoring();

  return (
    <div className="min-h-screen">
      <ScoringHeader />
      <div className="max-w-6xl mx-auto p-12 space-y-12">
        {scoring.teams.map((team) => (
          <ScoringGrid teamId={team} key={team} />
        ))}
      </div>
    </div>
  );
}
