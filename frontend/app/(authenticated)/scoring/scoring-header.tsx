// components/scoring-header.tsx
"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogoutButton from "@/components/logout-btn";
import { BACKEND_URL } from "@/lib/globals";

export default function ScoringHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const user = session?.user as {
    id: string;
    username: string;
    fullName: string;
    role: string;
    imageSrc: string;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-0 z-10 border-b bg-background/20 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`${BACKEND_URL}${user?.imageSrc}`}
                  alt={user?.fullName}
                />
                <AvatarFallback>
                  {user?.fullName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-md font-semibold">
                  {user?.fullName ?? "Loading..."}
                </h1>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role ?? "Judge"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              {mounted && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {currentTime.toLocaleTimeString()}
                </div>
              )}
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
