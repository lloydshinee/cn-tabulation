"use client";

import { useState } from "react";
import PortionSelect from "./portion-select";
import { Portion } from "@/lib/globals";
import JudgeSelect from "./judge-select";
import { User } from "next-auth";
import PortionJudgeScores from "./portion-judge-scores";

export function Scores() {
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [selectedJudge, setSelectedJudge] = useState<User | null>(null);

  const changePortion = (portion: Portion | null) => {
    setSelectedPortion(portion);
  };

  const changeJudge = (judge: User | null) => {
    setSelectedJudge(judge);
  };

  return (
    <section className="p-4 space-y-4">
      <PortionSelect
        selectedPortion={selectedPortion}
        changePortion={changePortion}
      />
      <JudgeSelect selectedJudge={selectedJudge} changeJudge={changeJudge} />
      <PortionJudgeScores portion={selectedPortion} judge={selectedJudge} />
    </section>
  );
}
