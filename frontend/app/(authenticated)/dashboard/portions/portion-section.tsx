import { BACKEND_URL, Criteria, Portion } from "@/lib/globals";
import axios from "axios";
import PortionCriteriaTable from "./portion-criteria-table";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import PortionFormDialog from "./portion-form-dialog";
import CriteriaFormDialog from "./criteria-form-dialog";
import DeleteButton from "./delete-btn";
import PercentBadge from "./percent-badge";

export async function PortionSection({ portion }: { portion: Portion }) {
  const response = await axios.get(`${BACKEND_URL}/criteria/${portion.id}`);
  const criterias = response.data as Criteria[];

  const totalWeight = criterias.reduce((sum, c) => sum + c.weight, 0);

  return (
    <AccordionItem
      value={`portion-${portion.id}`}
      className="border-l-4 border-l-green-500 p-4 bg-card rounded-lg"
    >
      <AccordionTrigger>
        <span className="font-semibold">{portion.name}</span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4">
        {portion.description && (
          <p className="text-sm text-muted-foreground">{portion.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Criteria</h3>
            <Badge variant="secondary">{criterias.length}</Badge>
            <PercentBadge totalPercent={totalWeight} />
          </div>
          <CriteriaFormDialog portionId={portion.id} />
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {criterias.map((criteria) => (
            <PortionCriteriaTable criteria={criteria} key={criteria.id} />
          ))}
        </Accordion>

        <div className="flex justify-end w-full gap-2">
          <PortionFormDialog data={portion} />
          <DeleteButton
            title="Portion"
            type="sm"
            id={portion.id}
            route="portions"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
