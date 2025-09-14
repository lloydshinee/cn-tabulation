"use client";

import { Criteria } from "@/lib/globals";
import axios from "axios";
import { useEffect, useState } from "react";

export function useCriteriasByPortions(portionIds: number[]) {
  const [criteriasByPortion, setCriteriasByPortion] = useState<
    Record<number, Criteria[]>
  >({});

  useEffect(() => {
    // safeguard
    if (!portionIds || portionIds.length === 0) {
      setCriteriasByPortion({});
      return;
    }

    async function fetchAll() {
      try {
        const results = await Promise.all(
          portionIds.map(async (id) => {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/criteria/${id}`
            );
            return [id, res.data] as [number, Criteria[]];
          })
        );

        const data: Record<number, Criteria[]> = {};
        results.forEach(([id, criterias]) => {
          data[id] = criterias;
        });

        setCriteriasByPortion(data);
      } catch (err) {
        console.error("Failed to fetch criterias:", err);
      }
    }

    fetchAll();
  }, [JSON.stringify(portionIds)]); // 👈 stable dependency

  return criteriasByPortion;
}
