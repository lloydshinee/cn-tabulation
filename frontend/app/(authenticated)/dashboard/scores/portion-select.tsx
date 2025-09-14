"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Portion {
  id: number;
  name: string;
  description: string;
}

export default function PortionSelect({
  portions,
  changePortionId,
  portionId,
}: {
  portions: Portion[];
  portionId: string | null;
  changePortionId: (portionId: string | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const selectedPortion = portions.find(
    (portion) => portion.id.toString() === portionId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedPortion ? selectedPortion.name : "Select portion..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search portion..." className="h-9" />
          <CommandList>
            <CommandEmpty>No portion found.</CommandEmpty>
            <CommandGroup>
              {portions.map((portion) => (
                <CommandItem
                  key={portion.id}
                  value={portion.id.toString()}
                  onSelect={(currentValue: any) => {
                    changePortionId(
                      currentValue === portionId ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{portion.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {portion.description}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      portionId === portion.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
