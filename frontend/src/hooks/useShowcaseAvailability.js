/**
 * Determines whether the showcase app should be available
 * (inside business hours and API health check passing).
 */

import { useCallback, useEffect, useState } from "react";
import {
  checkApiHealth,
  getShowcaseHoursConfig,
  isShowcaseHoursEnabled,
  isWithinBusinessHours,
} from "../utils/showcaseBusinessHours";

const POLL_INTERVAL_MS = 60_000;

/**
 * @typedef {'checking' | 'available' | 'unavailable'} AvailabilityStatus
 * @typedef {'outside-hours' | 'server-unavailable' | null} UnavailableReason
 */

/**
 * @returns {{
 *   status: AvailabilityStatus,
 *   reason: UnavailableReason,
 *   retry: () => Promise<void>,
 *   isRetrying: boolean,
 * }}
 */
export default function useShowcaseAvailability() {
  const enabled = isShowcaseHoursEnabled();
  const [status, setStatus] = useState(
    /** @type {AvailabilityStatus} */ (enabled ? "checking" : "available")
  );
  const [reason, setReason] = useState(
    /** @type {UnavailableReason} */ (null)
  );
  const [isRetrying, setIsRetrying] = useState(false);

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
    setIsRetrying(true);
    setStatus("checking");
    await evaluate();
    setIsRetrying(false);
  }, [evaluate]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    evaluate();

    const intervalId = setInterval(evaluate, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [enabled, evaluate]);

  return { status, reason, retry, isRetrying };
}
