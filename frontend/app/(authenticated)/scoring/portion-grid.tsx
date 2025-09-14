// components/portion-grid.tsx
"use client";
import { usePortion } from "@/hooks/use-portion";
import { useCriterias } from "@/hooks/use-criteria";
import CriteriaCard from "./criteria-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PortionGridProps {
  portionId: string;
  teamId: string | null;
}

export default function PortionGrid({ portionId, teamId }: PortionGridProps) {
  const currentPortion = usePortion(portionId);
  const criterias = useCriterias(currentPortion?.id || 0);

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

  return (
    <div className="space-y-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {criterias.map((criteria) => (
                <CriteriaCard
                  key={criteria.id}
                  criteria={criteria}
                  teamId={teamId}
                />
              ))}
            </div>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}
