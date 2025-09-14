"use client";

import { Criterion } from "@/lib/globals";
import axios from "axios";
import { useEffect, useState } from "react";

export function useCriterions(criteriaId: number | null) {
  const [criterions, setCriterions] = useState<Criterion[] | null>(null);

  const fetchCriterions = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/criterion/${criteriaId}`
    );
    setCriterions(response.data);
  };

  useEffect(() => {
    if (!criteriaId) {
      setCriterions(null);
      return;
    }
    fetchCriterions();
  }, [criteriaId]);

  return criterions;
}
