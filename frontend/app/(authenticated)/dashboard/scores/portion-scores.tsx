"use client";

import { BACKEND_URL, Portion } from "@/lib/globals";
import React, { useEffect, useState } from "react";
import PortionSelect from "./portion-select";
import axios from "axios";
import TeamData from "./team-data";

export default function PortionScores({ portions }: { portions: Portion[] }) {
  const [portionId, setPortionId] = React.useState<string | null>(null);
  const [data, setData] = useState<any[]>();

  const changePortionId = (portionId: string | null) => {
    setPortionId(portionId);
  };

  const fetchPortionScores = async () => {
    if (!portionId) {
      setData([]);
      return;
    }

    const response = await axios.get(
      `${BACKEND_URL}/portions/${portionId}/scores`
    );
    setData(response.data);
  };

  useEffect(() => {
    fetchPortionScores();
  }, [portionId]);

  return (
    <section className="p-8">
      <PortionSelect
        portions={portions}
        portionId={portionId}
        changePortionId={changePortionId}
      />

      {data && data.map((d) => <TeamData data={d} key={d.teamId} />)}
    </section>
  );
}
