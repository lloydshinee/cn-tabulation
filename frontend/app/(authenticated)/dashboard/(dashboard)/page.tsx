import { SiteHeader } from "@/components/site-header";
import { BACKEND_URL, Portion } from "@/lib/globals";
import axios from "axios";
import { PortionRanking } from "./PortionRanking";

export default async function DashboardPage() {
  const response = await axios.get(`${BACKEND_URL}/portions`);
  const portions = response.data as Portion[];

  return (
    <main>
      <SiteHeader title="Dashboard" />
      <section className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {portions.map((portion) => (
          <PortionRanking portion={portion} key={portion.id} />
        ))}
      </section>
    </main>
  );
}
