"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Portion } from "@/lib/globals";

interface PortionMenuProps {
  portions: Portion[];
}

export default function PortionMenu({ portions }: PortionMenuProps) {
  // We'll scroll into view when clicked
  const handleScroll = (id: number) => {
    const element = document.getElementById(`portion-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div>
      {/* Sticky Button on Right Side */}
      <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full shadow-lg"
              variant="secondary"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Portions</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {portions.map((portion) => (
                <button
                  key={portion.id}
                  onClick={() => handleScroll(portion.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="font-medium">{portion.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {portion.description}
                  </div>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
