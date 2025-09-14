"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Criterion {
  criterionId: number;
  description: string;
  weight: number;
  rawValue: number;
  weighted: number;
}

interface Criteria {
  criteriaId: number;
  name: string;
  subtotal: number;
  weighted: number;
  rawScores: Criterion[];
}

interface JudgeScore {
  judgeId: number;
  criterias: Criteria[];
  portionSubtotal: number;
}

interface TeamDataType {
  teamId: number;
  teamName: string;
  avgScore: number;
  judgeScores: JudgeScore[];
}

interface TeamDataProps {
  data: TeamDataType;
}

export default function TeamData({ data }: TeamDataProps) {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-[#1a1a1a] border border-gray-800 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-100">
              {data.teamName}
            </CardTitle>
            <Badge className="bg-green-600/90 hover:bg-green-600 text-white px-3 py-1 text-sm rounded-md">
              {data.avgScore.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Judge Scores */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        {data.judgeScores.map((judge) => (
          <AccordionItem
            key={judge.judgeId}
            value={`judge-${judge.judgeId}`}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-200 hover:text-green-500 transition-colors">
              <div className="flex items-center justify-between w-full">
                <span>Judge {judge.judgeId}</span>
                <Badge
                  variant="outline"
                  className="border-green-600/60 text-green-500 text-xs font-semibold"
                >
                  {judge.portionSubtotal.toFixed(2)}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {judge.criterias.map((criteria) => (
                  <Card
                    key={criteria.criteriaId}
                    className="bg-[#121212] border border-gray-700 rounded-md"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-200 text-sm">
                          {criteria.name}
                        </h4>
                        <span className="text-xs font-semibold text-green-500">
                          {criteria.weighted.toFixed(2)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      {criteria.rawScores.map((score) => (
                        <div
                          key={score.criterionId}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-400 truncate">
                            {score.description}
                          </span>
                          <div className="flex items-center gap-2 text-gray-500">
                            <span className="font-medium text-gray-200">
                              {score.rawValue}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              ({score.weight}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
