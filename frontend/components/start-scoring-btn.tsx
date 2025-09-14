"use client";

import { PlayCircle, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useScoring } from "@/providers/ScoringProvider";

export default function StartScoringButton() {
  const { scoring, toggleScoring } = useScoring();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant={scoring.start ? "destructive" : "outline"}
          className="size-8 group-data-[collapsible=icon]:opacity-0"
        >
          {!scoring.start ? <PlayCircle /> : <StopCircle />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {scoring.start ? "Stop scoring?" : "Start scoring?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {scoring.start
              ? "Stopping the scoring will prevent further score submissions. You can restart it later if needed."
              : "Once scoring starts, judges can begin submitting scores. This action can be reversed by stopping scoring."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => toggleScoring()}>
            {scoring.start ? "Stop Scoring" : "Start Scoring"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
