"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScoring } from "@/providers/ScoringProvider";
import { BACKEND_URL } from "@/lib/globals";
import { Check } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description?: string;
  imageSrc?: string;
}

export default function TeamControl() {
  const [teams, setTeams] = useState<Team[]>([]);
  const { scoring, addTeam, removeTeam } = useScoring();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`
        );
        setTeams(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch teams:", error);
      }
    };
    fetchTeams();
  }, []);

  const handleTeamClick = (teamId: string) => {
    if (scoring.teams.includes(teamId)) {
      removeTeam(teamId); // deactivate
    } else {
      addTeam(teamId); // activate
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Teams</CardTitle>
          <Badge variant="outline" className="text-xs">
            {teams.length} available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => {
            const isActive = scoring.teams.includes(team.id);
            return (
              <Button
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                variant={isActive ? "default" : "outline"}
                disabled={!scoring.start}
                size="sm"
                className={`
                  relative flex items-center gap-2 h-auto p-3 min-w-0 max-w-full
                  ${
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                      : "hover:bg-gray-50"
                  }
                  transition-all duration-200
                `}
              >
                {/* Team Image */}
                {team.imageSrc && (
                  <div className="flex-shrink-0">
                    <Image
                      src={`${BACKEND_URL}${team.imageSrc}`}
                      alt={team.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-cover rounded-full"
                    />
                  </div>
                )}

                {/* Team Info */}
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">
                      {team.name}
                    </span>
                    {isActive && <Check className="w-3 h-3 flex-shrink-0" />}
                  </div>
                  {team.description && (
                    <span
                      className={`
                        text-xs truncate max-w-full
                        ${isActive ? "text-blue-100" : "text-muted-foreground"}
                      `}
                    >
                      {team.description}
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Empty State */}
        {teams.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No teams available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
