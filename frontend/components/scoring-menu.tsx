"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useScoring } from "@/providers/ScoringProvider";
import { useTeam } from "@/hooks/use-team";
import { usePortion } from "@/hooks/use-portion";

// --- Portion Menu Item ---
function PortionMenuItem({
  teamId,
  portionId,
}: {
  teamId: string;
  portionId: number;
}) {
  const portion = usePortion(portionId);

  const handleScrollToPortion = () => {
    const element = document.getElementById(
      `team-${teamId}-portion-${portionId}`
    );

    console.log(element);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <button
      onClick={handleScrollToPortion}
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
    >
      <div className="font-medium">
        {portion ? portion.name : `Portion ${portionId}`}
      </div>
      {portion?.description && (
        <div className="text-xs text-muted-foreground">
          {portion.description}
        </div>
      )}
    </button>
  );
}

// --- Team Menu Item ---
function TeamMenuItem({ teamId }: { teamId: string }) {
  const team = useTeam(teamId);
  const { scoring } = useScoring();

  const handleScrollToTeam = () => {
    const element = document.getElementById(`team-${teamId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!team) return null;

  return (
    <AccordionItem value={teamId}>
      {/* Team clickable */}
      <AccordionTrigger
        className="font-semibold hover:text-primary cursor-pointer"
        onClick={handleScrollToTeam}
      >
        {team.name}
      </AccordionTrigger>

      {/* Portion list */}
      <AccordionContent className="space-y-2">
        {scoring.portions.map((portion) => (
          <PortionMenuItem
            key={portion.id}
            teamId={teamId}
            portionId={portion.id}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

// --- Main Menu ---
export default function ScoringMenu() {
  const { scoring } = useScoring();

  return (
    <div>
      {/* Sticky floating button */}
      <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full shadow-lg"
              variant="secondary"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Scoring Menu</SheetTitle>
            </SheetHeader>

            {/* Teams */}
            <Accordion type="single" collapsible className="mt-4 w-full">
              {scoring.teams.map((teamId) => (
                <TeamMenuItem key={teamId} teamId={teamId} />
              ))}
            </Accordion>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
