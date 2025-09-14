// components/criteria-card.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Criteria } from "@/lib/globals";
import CriterionInput from "./criterion-input";
import { useCriterions } from "@/hooks/use-criterions";

interface CriteriaCardProps {
  criteria: Criteria;
  teamId: string | null;
}

export default function CriteriaCard({ criteria, teamId }: CriteriaCardProps) {
  const criterions = useCriterions(criteria.id);

  if (!criterions) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (criterions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {criteria.name}
            <Badge variant="secondary">{criteria.weight}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No criterions found for this criteria
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200"
      id={`criteria-${criteria.id}-${teamId}`}
    >
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{criteria.name}</CardTitle>
          <Badge variant="secondary">{criteria.weight}%</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {criterions.map((criterion, index) => (
          <div key={criterion.id}>
            <CriterionInput criterion={criterion} teamId={teamId} />
            {index < criterions.length - 1 && (
              <Separator className="my-2 opacity-30" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
