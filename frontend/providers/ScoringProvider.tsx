"use client";

import { User } from "next-auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface ScoringState {
  teams: string[]; // multiple teams
  portions: string[]; // multiple portions
  start: boolean;
}

interface Judge {
  userId: string;
  done: boolean;
}

interface ScoringContextType {
  scoring: ScoringState;
  toggleScoring: () => void;
  setTeams: (teams: string[]) => void;
  setPortions: (portions: string[]) => void;
  addTeam: (team: string) => void;
  removeTeam: (team: string) => void;
  addPortion: (portion: string) => void;
  removePortion: (portion: string) => void;
  judges: Judge[];
  socket: Socket | null;
}

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

interface ScoringProviderProps {
  children: ReactNode;
  user: User;
}

export const ScoringProvider: React.FC<ScoringProviderProps> = ({
  children,
  user,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [scoring, setScoringState] = useState<ScoringState>({
    teams: [],
    portions: [],
    start: false,
  });

  const [judges, setJudges] = useState<Judge[]>([]);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      query: {
        role: user.role,
        userId: user.id,
      },
    });

    setSocket(s);

    s.on("connect", () => {
      console.log(`⚡ Connected as ${user.role} →`, s.id);
    });

    s.on("reconnect", (attempt) => {
      console.log("Judge reconnected after", attempt, "attempts");
    });

    s.on("scoringState", (data: ScoringState) => {
      console.log("📡 Received scoring state:", data);
      setScoringState(data);
    });

    s.on("judgesList", (list: Judge[]) => {
      console.log("📡 Judges list updated:", list);
      setJudges(list);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // --- Actions (Admins only) ---
  const toggleScoring = () => {
    if (!socket || user.role !== "ADMIN") return;
    socket.emit("updateScoring", { start: !scoring.start });
  };

  const setTeams = (teams: string[]) => {
    if (!socket || user.role !== "ADMIN") return;
    socket.emit("updateScoring", { teams });
  };

  const setPortions = (portions: string[]) => {
    if (!socket || user.role !== "ADMIN") return;
    socket.emit("updateScoring", { portions });
  };

  const addTeam = (team: string) => {
    if (!socket || user.role !== "ADMIN") return;
    const updated = [...new Set([...scoring.teams, team])];
    socket.emit("updateScoring", { teams: updated });
  };

  const removeTeam = (team: string) => {
    if (!socket || user.role !== "ADMIN") return;
    const updated = scoring.teams.filter((t) => t !== team);
    socket.emit("updateScoring", { teams: updated });
  };

  const addPortion = (portion: string) => {
    if (!socket || user.role !== "ADMIN") return;
    const updated = [...new Set([...scoring.portions, portion])];
    socket.emit("updateScoring", { portions: updated });
  };

  const removePortion = (portion: string) => {
    if (!socket || user.role !== "ADMIN") return;
    const updated = scoring.portions.filter((p) => p !== portion);
    socket.emit("updateScoring", { portions: updated });
  };

  const value: ScoringContextType = {
    scoring,
    toggleScoring,
    setTeams,
    setPortions,
    addTeam,
    removeTeam,
    addPortion,
    removePortion,
    judges,
    socket,
  };

  return (
    <ScoringContext.Provider value={value}>{children}</ScoringContext.Provider>
  );
};

export const useScoring = (): ScoringContextType => {
  const context = useContext(ScoringContext);
  if (!context) {
    throw new Error("useScoring must be used within a ScoringProvider");
  }
  return context;
};
