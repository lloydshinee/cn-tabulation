// components/scoring-grid.tsx
"use client";
import { useScoring } from "@/providers/ScoringProvider";
import PortionGrid from "./portion-grid";
import { useTeam } from "@/hooks/use-team";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BACKEND_URL } from "@/lib/globals";

interface ScoringGridProps {
  teamId: string | null;
}

export default function ScoringGrid({ teamId }: ScoringGridProps) {
  const { scoring } = useScoring();
  const currentTeam = useTeam(teamId);

  if (!scoring.portions || scoring.portions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium">No portions selected</div>
          <div className="text-sm text-muted-foreground">
            Please select a portion to score
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12" id={`team-${teamId}`}>
      {/* Portion + Team Info Card */}
      {currentTeam && (
        <div className="flex flex-col items-center gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-2 ring-border">
              <AvatarImage
                src={`${BACKEND_URL}${currentTeam.imageSrc}`}
                alt={currentTeam.name}
              />
              <AvatarFallback className="text-lg font-semibold">
                {currentTeam.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold">{currentTeam.name}</h3>
              {currentTeam.description && (
                <p className="text-muted-foreground mt-1">
                  {currentTeam.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {scoring.portions.map((portion) => (
        <PortionGrid key={portion.id} portionId={portion.id} teamId={teamId} />
      ))}
    </div>
  );
}
