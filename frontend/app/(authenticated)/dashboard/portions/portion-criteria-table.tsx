import { BACKEND_URL, Criteria, Criterion } from "@/lib/globals";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CriteriaFormDialog from "./criteria-form-dialog";
import CriterionFormDialog from "./criterion-form-dialog";
import DeleteButton from "./delete-btn";
import PercentBadge from "./percent-badge";

export default async function PortionCriteriaTable({
  criteria,
}: {
  criteria: Criteria;
}) {
  const response = await axios.get(`${BACKEND_URL}/criterion/${criteria.id}`);
  const criterions = response.data as Criterion[];

  const totalWeight = criterions.reduce((sum, c) => sum + c.weight, 0);

  return (
    <AccordionItem
      value={`criteria-${criteria.id}`}
      className="border-l-2 border-l-orange-500 rounded-md bg-card p-4"
    >
      <AccordionTrigger className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium">{criteria.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {criteria.weight}%
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Criterions</h4>
            <Badge variant="outline" className="text-xs">
              {criterions.length}
            </Badge>
            <PercentBadge totalPercent={totalWeight} />
          </div>
          <CriterionFormDialog criteriaId={criteria.id} />
        </div>

        {criterions.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted-foreground/10">
                <tr>
                  <th className="w-16 px-2 py-1 text-left font-mono">ID</th>
                  <th className="px-2 py-1 text-left">Name</th>
                  <th className="px-2 py-1 text-left">Description</th>
                  <th className="px-2 py-1 text-left">Weight</th>
                  <th className="w-24 px-2 py-1 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {criterions.map((criterion) => (
                  <tr key={criterion.id} className="border-t">
                    <td className="px-2 py-1 font-mono text-xs">
                      {criterion.id}
                    </td>
                    <td className="px-2 py-1 font-medium">
                      {criterion.name || "Unnamed"}
                    </td>
                    <td className="px-2 py-1 font-medium max-w-3xs truncate">
                      {criterion.description || "No description"}
                    </td>
                    <td className="px-2 py-1">{criterion.weight}%</td>
                    <td className="px-2 py-1">
                      <div className="flex items-center gap-1">
                        <CriterionFormDialog
                          data={criterion}
                          criteriaId={criteria.id}
                        />
                        <DeleteButton
                          id={criterion.id}
                          type="sm"
                          route="criterion"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground border rounded-md border-dashed">
            No criterions found for this criteria
          </div>
        )}

        <div className="flex justify-end w-full gap-2">
          <CriteriaFormDialog data={criteria} portionId={criteria.portionId} />
          <DeleteButton
            title="Criteria"
            type="sm"
            id={criteria.id}
            route="criteria"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
