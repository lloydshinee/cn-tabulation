import { SiteHeader } from "@/components/site-header";
import JudgeFormSheet from "./judge-form-sheet";
import { JudgesList } from "./judges-list";

export default function JudgesPage() {
  return (
    <main>
      <SiteHeader title="Judges" />
      <div className="p-6 w-full flex items-center justify-end">
        <JudgeFormSheet />
      </div>
      <JudgesList />
    </main>
  );
}
