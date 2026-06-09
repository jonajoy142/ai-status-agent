"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function AuthCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      window.localStorage.setItem("sprintpilot.accessToken", token);
      window.localStorage.setItem("sprintpilot.loggedIn", "true");
      document.cookie = "sprintpilot_session=1; path=/; max-age=2592000; SameSite=Lax";
    }
    router.replace("/");
  }, [params, router]);

  return <Card className="mx-auto max-w-xl p-8 text-center"><CardTitle>Finishing sign in...</CardTitle><CardDescription>Routing you to your SprintPilot workspace.</CardDescription></Card>;
}
