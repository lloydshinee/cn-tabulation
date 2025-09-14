"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScoring } from "@/providers/ScoringProvider";
import { Check } from "lucide-react";

interface Portion {
  id: string;
  name: string;
  description?: string;
}

export default function PortionControl() {
  const [portions, setPortions] = useState<Portion[]>([]);
  const { scoring, addPortion, removePortion } = useScoring();

  useEffect(() => {
    async function fetchPortions() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/portions`
        );
        setPortions(res.data);
      } catch (err) {
        console.error("Failed to fetch portions:", err);
      }
    }
    fetchPortions();
  }, []);

  const handlePortionClick = (portionId: string) => {
    if (scoring.portions.includes(portionId)) {
      removePortion(portionId); // deactivate
    } else {
      addPortion(portionId); // activate
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Portions</CardTitle>
          <Badge variant="outline" className="text-xs">
            {portions.length} available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {portions.map((portion) => {
            const isActive = scoring.portions.includes(portion.id);
            return (
              <Button
                key={portion.id}
                onClick={() => handlePortionClick(portion.id)}
                variant={isActive ? "default" : "outline"}
                disabled={!scoring.start}
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
                {/* Portion Info */}
                <div className="flex items-center gap-1.5 w-full">
                  <span className="font-medium text-sm truncate flex-1">
                    {portion.name}
                  </span>
                  {isActive && <Check className="w-3 h-3 flex-shrink-0" />}
                </div>

                {portion.description && (
                  <span
                    className={`
                      text-xs truncate max-w-full text-left
                      ${isActive ? "text-green-100" : "text-muted-foreground"}
                    `}
                  >
                    {portion.description}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Empty State */}
        {portions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No portions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
