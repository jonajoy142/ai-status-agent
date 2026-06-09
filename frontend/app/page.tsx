"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDashboardRoute } from "@/lib/role-router";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    router.replace(getDashboardRoute(user.role));
  }, [router, user.role]);

  return (
    <Card className="mx-auto max-w-xl p-8 text-center reveal-up">
      <CardTitle>Opening your SprintPilot workspace...</CardTitle>
      <CardDescription>Routing you to the dashboard for your current role.</CardDescription>
    </Card>
  );
}
