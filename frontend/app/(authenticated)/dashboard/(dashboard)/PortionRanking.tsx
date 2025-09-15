"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, Portion } from "@/lib/globals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RankingTeam {
  teamId: number;
  teamName: string;
  avgSubtotal: number;
  judgeCalculations: string[];
}

interface CriteriaRanking {
  criteriaId: number;
  name: string;
  ranking: RankingTeam[];
}

interface PortionRankingData {
  portionId: number;
  portionName: string;
  portionRanking: RankingTeam[];
  criteriaRanking: CriteriaRanking[];
}

export function PortionRanking({ portion }: { portion: Portion }) {
  const [data, setData] = useState<PortionRankingData | null>(null);

  const fetchRanking = async () => {
    const response = await axios.get(`${BACKEND_URL}/ranking/${portion.id}`);
    setData(response.data);
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground">
        Loading rankings...
      </div>
    );
  }

  return (
    <Card className="border-l-green-600 border-l-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {data.portionName} Rankings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portion overall ranking */}
        <section>
          <h3 className="text-sm font-medium mb-2">Overall</h3>
          <ol className="space-y-1 text-sm">
            {data.portionRanking.map((team, i) => (
              <li
                key={team.teamId}
                className="flex justify-between border-b border-border/40 pb-1 last:border-none"
              >
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground w-5 text-right">
                    {i + 1}.
                  </span>
                  <span>{team.teamName}</span>
                </span>
                <span className="font-medium">
                  {team.avgSubtotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {data.criteriaRanking.length > 1 && (
          <Accordion type="multiple" className="w-full">
            {data.criteriaRanking.map((criteria) => (
              <AccordionItem
                key={criteria.criteriaId}
                value={`criteria-${criteria.criteriaId}`}
              >
                <AccordionTrigger className="text-sm font-medium">
                  {criteria.name}
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="space-y-1 text-sm">
                    {criteria.ranking.map((team, i) => (
                      <li
                        key={team.teamId}
                        className="flex justify-between border-b border-border/40 pb-1 last:border-none"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground w-5 text-right">
                            {i + 1}.
                          </span>
                          <span>{team.teamName}</span>
                        </span>
                        <span className="font-medium">
                          {team.avgSubtotal.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
