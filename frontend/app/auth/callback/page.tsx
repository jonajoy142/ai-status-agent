import { Suspense } from "react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { AuthCallbackClient } from "./auth-callback-client";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}

function CallbackFallback() {
  return <Card className="mx-auto max-w-xl p-8 text-center"><CardTitle>Finishing sign in...</CardTitle><CardDescription>Routing you to your SprintPilot workspace.</CardDescription></Card>;
}
