import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Gavel, UserIcon } from "lucide-react";
import { User } from "next-auth";
import JudgeFormSheet from "./judge-form-sheet";

export function JudgeCard({ judge }: { judge: User }) {
  const initials = judge.fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <CardContent className="relative p-6">
        {/* Header with avatar and role badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${judge.imageSrc}`}
                  alt={judge.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Status indicator */}
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background shadow-sm" />
            </div>
          </div>

          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300"
          >
            <Gavel className="w-3 h-3 mr-1" />
            {judge.role}
          </Badge>
        </div>

        {/* Judge information */}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              {judge.fullName}
            </h3>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <UserIcon className="w-3 h-3" />
              <span className="text-sm">@{judge.username}</span>
            </div>
          </div>

          {/* Judge ID */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Judge ID:{" "}
              <span className="font-mono font-medium text-foreground">
                #{judge.id.toString().padStart(3, "0")}
              </span>
            </p>
          </div>
          <div className="w-full flex justify-end">
            <JudgeFormSheet data={judge} />
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </CardContent>
    </Card>
  );
}
