import { Badge } from "@/components/ui/badge";
import React from "react";

export default function PercentBadge({
  totalPercent,
}: {
  totalPercent: number;
}) {
  let colorClass = "bg-orange-500 text-white"; // default for < 100

  if (totalPercent === 100) {
    colorClass = "bg-green-500 text-white";
  } else if (totalPercent > 100) {
    colorClass = "bg-red-500 text-white";
  }

  return <Badge className={colorClass}>{totalPercent}%</Badge>;
}
