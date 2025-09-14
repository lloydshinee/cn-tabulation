import { auth } from "@/auth";
import { RankingProvider } from "@/providers/RankingProvider";
import { ScoringProvider } from "@/providers/ScoringProvider";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user.role) {
    redirect("/login");
  }

  return (
    <ScoringProvider user={session.user}>
      <RankingProvider>{children}</RankingProvider>
    </ScoringProvider>
  );
}
