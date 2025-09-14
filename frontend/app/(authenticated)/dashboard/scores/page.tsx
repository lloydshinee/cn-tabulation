import { SiteHeader } from "@/components/site-header";
import { Portion } from "@/lib/globals";
import axios from "axios";
import PortionScores from "./portion-scores";

export default async function ScoresPage() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/portions`
  );

  const portions = response.data as Portion[];

  return (
    <main>
      <SiteHeader title="Scores" />
      <PortionScores portions={portions} />
    </main>
  );
}
