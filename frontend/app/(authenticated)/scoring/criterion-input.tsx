"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { BACKEND_URL, Criterion } from "@/lib/globals";
import axios from "axios";
import { useSession } from "next-auth/react";

interface CriterionInputProps {
  criterion: Criterion;
  teamId: string | null;
}

export default function CriterionInput({
  criterion,
  teamId,
}: CriterionInputProps) {
  const [score, setScore] = useState<string>("");
  const [scoreId, setScoreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const session = useSession();

  const handleScoreChange = (value: string) => {
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 10)
    ) {
      setScore(value);
    }
  };

  const handleScoreBlur = async (value: string) => {
    if (value !== "" && !isNaN(parseFloat(value))) {
      const numValue = Math.max(0, Math.min(10, parseFloat(value)));
      const finalValue = numValue.toString();
      setScore(finalValue);

      try {
        setLoading(true);

        if (scoreId) {
          // 🔄 Update existing score
          await axios.put(`${BACKEND_URL}/scores/${scoreId}`, {
            value: numValue,
          });
        } else {
          // ➕ Insert new score
          const response = await axios.post(`${BACKEND_URL}/scores`, {
            value: numValue,
            teamId,
            criterionId: criterion.id,
            userId: session.data?.user.id,
          });
          setScoreId(response.data.id); // save ID for future updates
        }
      } catch (err) {
        console.error("Failed to save score", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/scores`, {
          params: {
            criterionId: criterion.id,
            teamId,
            userId: session.data?.user.id,
          },
        });

        const existingScore = response.data;
        if (existingScore) {
          setScore(existingScore.value.toString());
          setScoreId(existingScore.id);
        } else {
          setScore("");
          setScoreId(null);
        }
      } catch (error) {
        console.error("Failed to fetch score", error);
      }
    };

    if (teamId && session.data?.user.id) {
      fetchScore();
    }
  }, [teamId, criterion.id, session.data?.user.id]);

  if (!session) return null;

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
      <div className="flex-1 min-w-0 flex flex-col items-start">
        <p className="font-medium text-sm leading-tight mb-1">
          {criterion.name}
        </p>
        {criterion.weight !== 100 && (
          <p className="text-xs text-muted-foreground">
            Weight: {criterion.weight}%
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={score ?? ""}
            disabled={loading}
            onChange={(e) => handleScoreChange(e.target.value)}
            onBlur={(e) => handleScoreBlur(e.target.value)}
            className="w-14 text-center font-medium h-8 text-lg"
          />
          <div className="text-center">
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
