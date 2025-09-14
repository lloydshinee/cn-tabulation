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

// --- Types ---
interface PortionState {
  id: number;
  name: string;
  hiddenCriterias: (string | number)[];
}

interface ScoringState {
  teams: string[];
  portions: PortionState[];
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
  setPortions: (portions: PortionState[]) => void;
  addTeam: (team: string) => void;
  removeTeam: (team: string) => void;
  addPortion: (portionId: number, name: string) => void;
  removePortion: (portionId: number) => void;
  hideCriteria: (portionId: number, criterionId: number | string) => void;
  showCriteria: (portionId: number, criterionId: number | string) => void;
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
  const [scoring, setScoring] = useState<ScoringState>({
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

    // --- Connection Events ---
    s.on("connect", () => {
      console.log(`⚡ Connected as ${user.role} →`, s.id);
    });

    s.on("disconnect", () => {
      console.log("🔌 Disconnected");
    });

    // --- Custom Events ---
    s.on("scoringState", (data: ScoringState) => {
      console.log("📡 Received scoring state:", data);
      setScoring(data);
    });

    s.on("judgesList", (list: Judge[]) => {
      console.log("📡 Judges list updated:", list);
      setJudges(list);
    });

    return () => {
      s.disconnect();
    };
  }, [user]);

  // --- Admin Actions ---
  const toggleScoring = () => {
    if (!socket || user.role !== "ADMIN") return;
    socket.emit("updateScoring", { start: !scoring.start });
  };

  const setTeams = (teams: string[]) => {
    if (!socket || user.role !== "ADMIN") return;
    socket.emit("updateScoring", { teams });
  };

  const setPortions = (portions: PortionState[]) => {
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

  const addPortion = (portionId: number, name: string) => {
    if (!socket || user.role !== "ADMIN") return;

    const exists = scoring.portions.some((p) => p.id === portionId);
    const updated = exists
      ? scoring.portions
      : [...scoring.portions, { id: portionId, name, hiddenCriterias: [] }];

    socket.emit("updateScoring", { portions: updated });
  };

  const removePortion = (portionId: number) => {
    if (!socket || user.role !== "ADMIN") return;
    const updated = scoring.portions.filter((p) => p.id !== portionId);
    socket.emit("updateScoring", { portions: updated });
  };

  const hideCriteria = (portionId: number, criterionId: number | string) => {
    if (!socket || user.role !== "ADMIN") return;

    const updated = scoring.portions.map((p) =>
      p.id === portionId
        ? {
            ...p,
            hiddenCriterias: [...new Set([...p.hiddenCriterias, criterionId])],
          }
        : p
    );

    socket.emit("updateScoring", { portions: updated });
    console.log(`🙈 Hid criterion ${criterionId} in portion ${portionId}`);
  };

  // --- Show (unhide) a criterion inside a portion ---
  const showCriteria = (portionId: number, criterionId: number | string) => {
    if (!socket || user.role !== "ADMIN") return;

    const updated = scoring.portions.map((p) =>
      p.id === portionId
        ? {
            ...p,
            hiddenCriterias: p.hiddenCriterias.filter((c) => c !== criterionId),
          }
        : p
    );

    socket.emit("updateScoring", { portions: updated });
    console.log(`👁️ Shown criterion ${criterionId} in portion ${portionId}`);
  };

  // --- Context Value ---
  const value: ScoringContextType = {
    scoring,
    toggleScoring,
    setTeams,
    setPortions,
    addTeam,
    removeTeam,
    addPortion,
    removePortion,
    hideCriteria, // 👈 now aware of hidden criterias
    showCriteria,
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
