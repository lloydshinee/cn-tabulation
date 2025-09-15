import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useTeam } from "@/hooks/use-team";
import { BACKEND_URL } from "@/lib/globals";

export default function TeamSection({ data }: { data: any }) {
  const team = useTeam(data.teamId);

  if (!team) return;

  const scoreData = data;

  return (
    <div className="space-y-4">
      {/* Team Header */}
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`${BACKEND_URL}${team.imageSrc}`} alt={team.name} />
          <AvatarFallback className="text-sm">
            {team.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{scoreData.teamName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {scoreData.portionName}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{scoreData.subtotal}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Tables - One per Criteria */}
      {scoreData.criteriaBreakdown.map((criteria: any) => (
        <Card key={criteria.criteriaId}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{criteria.name}</span>
              <span className="text-base font-normal text-blue-600">
                {criteria.subtotal}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criterion</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Weighted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.criterions.map((criterion: any) => (
                  <TableRow key={criterion.criterionId}>
                    <TableCell className="font-medium">
                      {criterion.name}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {criterion.value}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      {criterion.calculation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
