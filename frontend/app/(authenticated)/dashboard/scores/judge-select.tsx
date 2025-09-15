"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Check } from "lucide-react";
import { User } from "next-auth";
import React, { useEffect, useState } from "react";

export default function JudgeSelect({
  selectedJudge,
  changeJudge,
}: {
  selectedJudge: User | null;
  changeJudge: (judge: User | null) => void;
}) {
  const [judges, setJudges] = useState<User[]>([]);

  useEffect(() => {
    async function fetchJudges() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/judges`
        );
        setJudges(res.data);
      } catch (err) {
        console.error("Failed to fetch judges:", err);
      }
    }
    fetchJudges();
  }, []);

  const handleJudgeClick = (judge: User) => {
    const isActive = judge.id == selectedJudge?.id;
    if (isActive) {
      changeJudge(null); // deactivate
    } else {
      changeJudge(judge); // activate
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Judges</CardTitle>
          <Badge variant="outline" className="text-xs">
            {judges.length} available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {judges.map((judge) => {
            const isActive = judge.id == selectedJudge?.id;

            return (
              <Button
                key={judge.id}
                onClick={() => handleJudgeClick(judge)}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`
                  relative flex flex-col items-start gap-1 h-auto p-3 min-w-0 max-w-full
                  ${
                    isActive
                      ? "bg-green-600 hover:bg-green-700 border-green-600"
                      : "hover:bg-gray-50"
                  }
                  transition-all duration-200
                `}
              >
                {/* User Info */}
                <div className="flex items-center gap-1.5 w-full">
                  <span className="font-medium text-sm truncate flex-1">
                    {judge.fullName}
                  </span>
                  {isActive && <Check className="w-3 h-3 flex-shrink-0" />}
                </div>
              </Button>
            );
          })}
        </div>
        {/* Empty State */}
        {judges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No judges available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
