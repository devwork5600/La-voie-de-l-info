"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Eye, Users, Wallet } from "lucide-react";

import { getAdminOverviewStats } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STAT_META = [
  {
    key: "userCount" as const,
    title: "Utilisateurs",
    description: "Comptes créés",
    icon: Users,
  },
  {
    key: "subscriberCount" as const,
    title: "Abonnés",
    description: "Abonnements actifs",
    icon: Wallet,
  },
  {
    key: "articleCount" as const,
    title: "Articles",
    description: "Total publiés",
    icon: BookOpen,
  },
  {
    key: "totalVisits" as const,
    title: "Vues",
    description: "Total des vues",
    icon: Eye,
  },
];

export default function AdminOverviewStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminOverviewStats"],
    queryFn: getAdminOverviewStats,
  });

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        Impossible de charger les statistiques.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_META.map(({ key, title, description, icon: Icon }) => (
        <Card key={key} className="border-t-primary border-t-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              {title}
            </CardTitle>
            <Icon className="text-primary size-4" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-playfair text-2xl font-bold">
                {data?.[key]?.toLocaleString("fr-FR") ?? 0}
              </div>
            )}
            <p className="text-muted-foreground text-xs">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
