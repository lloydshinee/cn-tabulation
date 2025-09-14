"use client";

import { Criteria } from "@/lib/globals";
import axios from "axios";
import { useEffect, useState } from "react";

export function useCriterias(portionId: number | null) {
  const [criterias, setCriterias] = useState<Criteria[] | null>(null);

  const fetchCriterias = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/criteria/${portionId}`
    );
    setCriterias(response.data);
  };

  useEffect(() => {
    if (!portionId) {
      setCriterias(null);
      return;
    }
    fetchCriterias();
  }, [portionId]);

  return criterias;
}
