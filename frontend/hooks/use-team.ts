"use client";

import { Team } from "@/app/(authenticated)/dashboard/teams/team-form-sheet";
import axios from "axios";
import { useEffect, useState } from "react";

export function useTeam(teamId: string | null) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const fetchTeam = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamId}`
    );
    setCurrentTeam(response.data as Team);
  };

  useEffect(() => {
    if (!teamId) {
      setCurrentTeam(null);
      return;
    }
    fetchTeam();
  }, [teamId]);

  return currentTeam;
}
