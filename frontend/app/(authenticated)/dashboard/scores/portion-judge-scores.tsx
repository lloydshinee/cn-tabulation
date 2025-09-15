"use client";
import { BACKEND_URL, Portion } from "@/lib/globals";
import axios from "axios";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import TeamSection from "./team-section";
import { Card, CardContent } from "@/components/ui/card";
import { FileX, Users, ClipboardList } from "lucide-react";

export default function PortionJudgeScores({
  portion,
  judge,
}: {
  portion: Portion | null;
  judge: User | null;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/portions/${portion!.id}/score/${judge!.id}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (portion && judge) {
      fetchScores();
    } else {
      setData([]);
    }
  }, [portion, judge]);

  // Loading state
  if (loading) {
    return (
      <section>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading scores...
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // No portion or judge selected
  if (!portion || !judge) {
    return (
      <section>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Selection Made
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
              Please select both a portion and a judge to view the scoring data.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // No data available
  if (data.length === 0) {
    return (
      <section>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileX className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Scores Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
              No scoring data found for <strong>{portion.name}</strong> judged
              by <strong>{judge.name}</strong>.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Scores may not have been submitted yet.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Has data - show team sections
  return (
    <section>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>
              Showing {data.length} team{data.length !== 1 ? "s" : ""} for{" "}
              <strong>{portion.name}</strong>
            </span>
          </div>
          {data.map((d) => (
            <TeamSection data={d} key={d.teamId} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
