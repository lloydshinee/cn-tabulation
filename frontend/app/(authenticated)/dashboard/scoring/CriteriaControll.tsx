"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScoring } from "@/providers/ScoringProvider";
import { useCriteriasByPortions } from "@/hooks/use-criteria-by-portions";
import { Check } from "lucide-react";

export default function CriteriaControl() {
  const { scoring, showCriteria, hideCriteria } = useScoring();

  const portionIds = useMemo(
    () => scoring.portions.map((p) => p.id),
    [scoring.portions]
  );

  const criteriasByPortion = useCriteriasByPortions(portionIds);

  return (
    <Accordion type="multiple" className="w-full space-y-5 bg-card rounded-lg">
      {scoring.portions.map((portion: any) => {
        const criterias = criteriasByPortion[portion.id] || [];

        return (
          <AccordionItem key={portion.id} value={`portion-${portion.id}`}>
            <AccordionTrigger className="px-4 py-2">
              <div className="flex flex-col items-start text-left w-full">
                <CardTitle className="text-base font-semibold">
                  {portion.name} – Criteria
                </CardTitle>
                <Badge variant="outline" className="text-xs mt-1">
                  {criterias.length} available
                </Badge>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-wrap gap-3 p-4">
                {criterias.map((criteria: any) => {
                  const isHidden = portion.hiddenCriterias.includes(
                    criteria.id
                  );

                  return (
                    <Button
                      key={criteria.id}
                      onClick={() =>
                        isHidden
                          ? showCriteria(portion.id, criteria.id)
                          : hideCriteria(portion.id, criteria.id)
                      }
                      disabled={!scoring.start}
                      variant="ghost"
                      className={`
                            rounded-lg border w-full sm:w-[10rem] md:w-[12rem]
                            flex flex-col items-start gap-1
                            overflow-hidden text-left p-3
                            ${
                              isHidden
                                ? "border-gray-300 bg-muted hover:bg-gray-100 text-muted-foreground"
                                : "border-green-600 bg-green-600 hover:bg-green-700 text-white"
                            }
                            transition-all duration-200
                          `}
                    >
                      <div className="flex items-center gap-1.5 w-full">
                        <span className="font-medium text-sm truncate flex-1">
                          {criteria.name}
                        </span>
                        {!isHidden && (
                          <Check className="w-3 h-3 flex-shrink-0" />
                        )}
                      </div>

                      {criteria.description && (
                        <span
                          className={`text-[11px] truncate w-full ${
                            isHidden
                              ? "text-muted-foreground"
                              : "text-green-100"
                          }`}
                        >
                          {criteria.description}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>

              {criterias.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">No criteria available</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
