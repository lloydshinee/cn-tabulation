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
    <Accordion
      type="multiple"
      className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {scoring.portions.map((portion: any) => {
        const criterias = criteriasByPortion[portion.id] || [];

        return (
          <AccordionItem
            key={portion.id}
            value={`portion-${portion.id}`}
            className="bg-card rounded-lg border-l-2 border-l-green-500 w-full"
          >
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
                            flex flex-col items-start gap-1 hover:bg-none
                            overflow-hidden text-left p-3
                            ${
                              !isHidden
                                ? "bg-green-600 hover:bg-green-700 border-green-600"
                                : "hover:bg-gray-50"
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
