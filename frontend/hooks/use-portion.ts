"use client";

import { Portion } from "@/lib/globals";
import axios from "axios";
import { useEffect, useState } from "react";

export function usePortion(name: string | null) {
  const [currentPortion, setCurrentPortion] = useState<Portion | null>(null);

  const fetchPortion = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/portions/${name}`
    );
    setCurrentPortion(response.data);
  };

  useEffect(() => {
    if (!name) {
      setCurrentPortion(null);
      return;
    }
    fetchPortion();
  }, [name]);

  return currentPortion;
}
