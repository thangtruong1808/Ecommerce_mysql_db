import type { ReactNode } from "react";
import ShowcaseUnavailableNotice from "./ShowcaseUnavailableNotice";
import useShowcaseAvailability from "../hooks/useShowcaseAvailability";

interface ShowcaseAvailabilityGateProps {
  children: ReactNode;
}

export default function ShowcaseAvailabilityGate({ children }: ShowcaseAvailabilityGateProps) {
  const { status, reason, retry, isRetrying } = useShowcaseAvailability();

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-ink">
        <p className="inline-flex items-center gap-3 text-sm text-muted">
          <span
            className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent motion-safe:animate-spin"
            aria-hidden="true"
          />
          Checking whether the showcase is open
        </p>
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <ShowcaseUnavailableNotice
        reason={reason ?? "outside-hours"}
        onRetry={retry}
        isRetrying={isRetrying}
      />
    );
  }

  return children;
}
