// components/portion-grid.tsx
"use client";

import { usePortion } from "@/hooks/use-portion";
import { useCriterias } from "@/hooks/use-criteria";
import CriteriaCard from "./criteria-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScoring } from "@/providers/ScoringProvider";

interface PortionGridProps {
  portionId: number;
  teamId: string | null;
}

export default function PortionGrid({ portionId, teamId }: PortionGridProps) {
  const currentPortion = usePortion(portionId);
  const criterias = useCriterias(currentPortion?.id || 0);
  const { scoring } = useScoring();

  if (!currentPortion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium">Loading portion...</div>
          <div className="text-sm text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }

  if (!criterias || criterias.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium">No criteria found</div>
          <div className="text-sm text-muted-foreground">
            for {currentPortion.name}
          </div>
        </div>
      </div>
    );
  }

  // find hidden criterias for this portion
  const portionState = scoring.portions.find(
    (p: any) => p.id === currentPortion.id
  );
  const hidden = portionState?.hiddenCriterias || [];

  // filter out hidden criterias
  const visibleCriterias = criterias.filter((c) => !hidden.includes(c.id));

  if (visibleCriterias.length === 0) return;

  return (
    <div className="space-y-6" id={`team-${teamId}-portion-${portionId}`}>
      <Card className="mb-8">
        <CardHeader className="text-center pb-4">
          <div className="space-y-2 pb-10">
            <Badge variant="secondary" className="mx-auto w-fit">
              Competition Portion
            </Badge>
            <CardTitle className="text-3xl font-bold">
              {currentPortion.name}
            </CardTitle>
            {currentPortion.description && (
              <p className="text-muted-foreground text-lg">
                {currentPortion.description}
              </p>
            )}
          </div>

          {/* Criteria Grid */}
          {teamId && (
            <div className="flex flex-wrap flex-col md:flex-row gap-6">
              {visibleCriterias.length > 0 &&
                visibleCriterias.map((criteria) => (
                  <div className="flex-1" key={criteria.id}>
                    <CriteriaCard criteria={criteria} teamId={teamId} />
                  </div>
                ))}
            </div>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}
