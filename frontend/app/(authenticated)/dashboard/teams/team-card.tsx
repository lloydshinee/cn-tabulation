import { Card } from "@/components/ui/card";
import TeamFormSheet, { Team } from "./team-form-sheet";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Card className="group relative h-80 overflow-hidden border-0 bg-muted/20 shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-105">
      {/* Background Image with Darkened Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${team.imageSrc})`,
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black/80 group-hover:from-black/50 group-hover:via-black/60 group-hover:to-black/70 transition-all duration-500" />

        {/* Additional overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-center items-center p-6 text-center z-10">
        {/* Team ID Badge */}
        <Badge
          variant="outline"
          className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          {team.id.toString().padStart(2, "0")}
        </Badge>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Team Name */}
          <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg group-hover:text-white/95 transition-all duration-300 leading-tight">
            {team.name}
          </h3>

          {/* Description if available */}
          {team.description && (
            <p className="text-white/90 text-lg max-w-xs mx-auto drop-shadow-md group-hover:text-white/80 transition-all duration-300">
              {team.description}
            </p>
          )}

          {/* Team Icon */}
          <div className="flex flex-col items-center justify-center mt-6 gap-3">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="">
              <TeamFormSheet data={team} />
            </div>
          </div>
        </div>

        {/* Bottom Gradient for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 transition-opacity duration-500 pointer-events-none" />

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/30 via-transparent to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
    </Card>
  );
}
