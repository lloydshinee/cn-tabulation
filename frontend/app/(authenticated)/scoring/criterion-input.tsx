"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { BACKEND_URL, Criterion } from "@/lib/globals";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Check, Loader2, AlertCircle, Pencil } from "lucide-react"; // icons

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
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "unsaved"
  >("idle");

  const session = useSession();

  const saveScore = async (value: string) => {
    if (value === "" || isNaN(parseFloat(value))) return;

    const numValue = Math.max(0, Math.min(10, parseFloat(value)));

    try {
      setStatus("saving");

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
        setScoreId(response.data.id);
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500); // fade back after a bit
    } catch (err) {
      console.error("Failed to save score", err);
      setStatus("error");
    }
  };

  const handleScoreChange = (value: string) => {
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 10)
    ) {
      setScore(value);
      setStatus("unsaved");
    }
  };

  // 🔄 Auto-save after typing stops (debounce)
  useEffect(() => {
    if (status !== "unsaved") return;

    const handler = setTimeout(() => {
      saveScore(score);
    }, 1000); // wait 1s after user stops typing

    return () => clearTimeout(handler);
  }, [score, status]);

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
      <div className="flex-shrink-0 flex items-center gap-2">
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={score ?? ""}
          onChange={(e) => handleScoreChange(e.target.value)}
          onBlur={(e) => saveScore(e.target.value)}
          className="w-14 text-center font-medium h-8 text-lg"
        />
        <span className="text-sm text-muted-foreground">/ 10</span>

        {/* 🔔 Status Indicator */}
        {status === "saving" && (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        )}
        {status === "saved" && <Check className="w-4 h-4 text-green-500" />}
        {status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
        {status === "unsaved" && <Pencil className="w-4 h-4 text-yellow-500" />}
      </div>
    </div>
  );
}
