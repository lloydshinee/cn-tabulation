"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useScoring } from "@/providers/ScoringProvider";
import StartScoringButton from "@/components/start-scoring-btn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { BACKEND_URL } from "@/lib/globals";
import { useTeam } from "@/hooks/use-team";
import { usePortion } from "@/hooks/use-portion";

/* ---------- Child components ---------- */

function SelectedTeam({ id }: { id: string }) {
  const team = useTeam(id);

  if (!team) return null;

  return (
    <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
      <Avatar className="w-6 h-6">
        {team.imageSrc ? (
          <AvatarImage
            src={`${BACKEND_URL}${team.imageSrc}`}
            alt={team.name}
            className="object-cover"
          />
        ) : (
          <AvatarFallback>{team.name?.[0] || "?"}</AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm truncate max-w-[120px]">
        {team.name || "Unknown"}
      </span>
    </div>
  );
}

function SelectedPortion({ id }: { id: number }) {
  const portion = usePortion(id);

  if (!portion) return null;

  return (
    <Badge variant="secondary" className="text-xs truncate max-w-[120px]">
      {portion.name || "Unknown"}
    </Badge>
  );
}

/* ---------- Main component ---------- */

export default function ScoringState() {
  const { scoring, judges } = useScoring();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* Scoring Status Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Scoring Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <StartScoringButton />
            {scoring.start ? (
              <div>
                <p className="font-semibold text-green-700">Started</p>
                <p className="text-xs text-green-600">Scoring is active</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-gray-700">Not Started</p>
                <p className="text-xs text-gray-600">Waiting to begin</p>
              </div>
            )}
          </div>
        </CardContent>
        {scoring.start && (
          <div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>
        )}
      </Card>

      {/* Current Teams & Portions Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Teams */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Teams</p>
            {scoring.teams.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {scoring.teams.map((id) => (
                  <SelectedTeam key={id} id={id} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No team(s) selected
              </p>
            )}
          </div>

          {/* Portions */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Portions</p>
            {scoring.portions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {scoring.portions.map((portion) => (
                  <SelectedPortion key={portion.id} id={portion.id} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No portion(s) selected
              </p>
            )}
          </div>
        </CardContent>
        {(scoring.teams.length > 0 || scoring.portions.length > 0) && (
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
        )}
      </Card>

      {/* Judges Connected Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Judges Connected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                judges.length > 0 ? "bg-emerald-100" : "bg-gray-100"
              }`}
            >
              <Users
                className={`h-5 w-5 ${
                  judges.length > 0 ? "text-emerald-600" : "text-gray-600"
                }`}
              />
            </div>
            <div>
              <p className="text-2xl font-bold">{judges.length}</p>
              <p className="text-xs text-muted-foreground">
                {judges.length === 1 ? "Judge" : "Judges"} online
              </p>
            </div>
          </div>

          {judges.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-wrap gap-1">
                {judges.slice(0, 3).map((judge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {`Judge ${index + 1}`}
                  </Badge>
                ))}
                {judges.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{judges.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        {judges.length > 0 && (
          <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
        )}
      </Card>
    </div>
  );
}
