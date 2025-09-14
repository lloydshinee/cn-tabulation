"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/globals";
import { Team } from "@/app/(authenticated)/dashboard/teams/team-form-sheet";

interface RankingContextType {
  teams: Team[];
}

const RankingContext = createContext<RankingContextType | undefined>(undefined);

interface RankingProviderProps {
  children: ReactNode;
}

export function RankingProvider({ children }: RankingProviderProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await axios.get(`${BACKEND_URL}/teams`);
      setTeams(response.data);
    };

    fetchTeams();
  }, []);

  const value: RankingContextType = {
    teams,
  };
  return (
    <RankingContext.Provider value={value}>{children}</RankingContext.Provider>
  );
}

export const useRanking = (): RankingContextType => {
  const context = useContext(RankingContext);
  if (!context)
    throw new Error("useRanking must be used within a RankingProvider");
  return context;
};
