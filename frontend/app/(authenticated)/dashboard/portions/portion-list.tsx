import { BACKEND_URL, Portion } from "@/lib/globals";
import axios from "axios";
import { PortionSection } from "./portion-section";
import PortionFormDialog from "./portion-form-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import PortionMenu from "@/components/portion-menu";
import { Accordion } from "@/components/ui/accordion";

export async function PortionList() {
  const response = await axios.get(`${BACKEND_URL}/portions`);
  const portions = response.data as Portion[];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-end">
        <PortionFormDialog />
        <PortionMenu portions={portions} />
      </div>

      {portions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No portions found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Get started by creating your first portion. Portions help you
              organize and manage your criteria effectively.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {portions.map((portion) => (
            <PortionSection key={portion.id} portion={portion} />
          ))}
        </Accordion>
      )}
    </div>
  );
}
