import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkApiHealth,
  getShowcaseHoursConfig,
  isShowcaseHoursEnabled,
  isWithinBusinessHours,
} from "../utils/showcaseBusinessHours";

const POLL_INTERVAL_MS = 60_000;

export type AvailabilityStatus = "checking" | "available" | "unavailable";
export type UnavailableReason = "outside-hours" | "server-unavailable";

export default function useShowcaseAvailability() {
  const enabled = isShowcaseHoursEnabled();
  const [status, setStatus] = useState<AvailabilityStatus>(enabled ? "checking" : "available");
  const [reason, setReason] = useState<UnavailableReason | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryingRef = useRef(false);

  const evaluate = useCallback(async () => {
    if (!enabled) {
      setStatus("available");
      setReason(null);
      return;
    }

    const config = getShowcaseHoursConfig();
    if (!isWithinBusinessHours(new Date(), config)) {
      setStatus("unavailable");
      setReason("outside-hours");
      return;
    }

    const healthy = await checkApiHealth();
    if (!healthy) {
      setStatus("unavailable");
      setReason("server-unavailable");
      return;
    }

    setStatus("available");
    setReason(null);
  }, [enabled]);

  const retry = useCallback(async () => {
    if (retryingRef.current) {
      return;
    }
    retryingRef.current = true;
    setIsRetrying(true);
    try {
      await evaluate();
    } finally {
      retryingRef.current = false;
      setIsRetrying(false);
    }
  }, [evaluate]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    void evaluate();
    const intervalId = window.setInterval(() => {
      void evaluate();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [enabled, evaluate]);

  return { status, reason, retry, isRetrying };
}
