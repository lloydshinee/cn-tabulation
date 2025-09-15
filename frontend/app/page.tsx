import axios from "axios";
import { User } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gavel, Users, Trophy, Wifi } from "lucide-react";
import { BACKEND_URL } from "@/lib/globals";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function JudgesList() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/judges`
    );
    const judges = response.data as User[];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {judges.map((judge, index) => (
          <Card
            key={judge.id || index}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`${BACKEND_URL}${judge.imageSrc}`}
                    alt={judge.fullName || ""}
                  />
                  <AvatarFallback className="bg-primary/10">
                    <Gavel className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{judge.fullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    @{judge.username}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } catch (_error: any) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load judges</p>
      </div>
    );
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <Badge
              variant="outline"
              className="text-lg px-4 py-2 border-primary/30"
            >
              Live Scoring System
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Cultural Night
            <br />
            Tabulation
          </h1>

          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Live functionalities, local internet tabulation
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Wifi className="h-5 w-5" />
              <span className="font-medium">Real-time scoring & updates</span>
            </div>
            <Button asChild size="lg" className="mt-4">
              <Link href="/login">Login</Link>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  Live Scoring
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Real-time tabulation with instant score updates
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  Multi-Judge
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Multiple judges can score simultaneously
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Wifi className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  Local Network
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Works on local internet for reliable performance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Judges Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Gavel className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="text-base px-4 py-2">
                Panel of Judges
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Meet Our Esteemed Judges
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals dedicated to fair and accurate scoring
            </p>
          </div>

          <Card className="shadow-xl border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-center text-xl flex items-center justify-center gap-2 text-card-foreground">
                <Users className="h-5 w-5 text-primary" />
                Active Judges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <JudgesList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
