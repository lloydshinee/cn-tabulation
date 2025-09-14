import axios from "axios";
import React from "react";
import { TeamCard } from "./team-card";
import { Trophy } from "lucide-react";
import TeamFormSheet, { Team } from "./team-form-sheet";

export default async function TeamsList() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`
  );

  const teams = response.data;

  return (
    <div className="container mx-auto px-6 py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
        <TeamFormSheet />
      </div>

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map((team: Team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center p-4 bg-muted/50 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Teams Yet
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Teams will appear here once they are registered for the competition.
          </p>
        </div>
      )}
    </div>
  );
}
