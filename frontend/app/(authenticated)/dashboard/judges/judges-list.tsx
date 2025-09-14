import { Users } from "lucide-react";
import { JudgeCard } from "./judge-card";
import axios from "axios";
import { User } from "next-auth";

export async function JudgesList() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/judges`
  );

  const judges = response.data as User[];

  return (
    <div className="space-y-8 p-4">
      {/* Judges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {judges.map((judge) => (
          <JudgeCard key={judge.id} judge={judge} />
        ))}
      </div>

      {/* Empty State */}
      {judges.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Judges Found
          </h3>
          <p className="text-muted-foreground">
            There are currently no judges in the system.
          </p>
        </div>
      )}
    </div>
  );
}
