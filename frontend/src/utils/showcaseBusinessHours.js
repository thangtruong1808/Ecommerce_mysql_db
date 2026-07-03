/**
 * Showcase business hours helpers (Australia/Sydney by default).
 * Used when the demo EC2 instance is scheduled off outside office hours.
 */

const DAY_NAME_TO_NUM = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const DEFAULT_TIMEZONE = "Australia/Sydney";
const DEFAULT_START = "13:00";
const DEFAULT_END = "18:00";
const DEFAULT_DAYS = [1, 2, 3, 4, 5];

/**
 * Whether the showcase availability gate is active.
 * Disabled in local dev unless VITE_SHOWCASE_HOURS_ENABLED=true.
 */
export function isShowcaseHoursEnabled() {
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_SHOWCASE_HOURS_ENABLED !== "true"
  ) {
    return false;
  }
  return import.meta.env.VITE_SHOWCASE_HOURS_ENABLED !== "false";
}

/**
 * @returns {{ timezone: string, start: string, end: string, days: number[] }}
 */
export function getShowcaseHoursConfig() {
  const daysRaw =
    import.meta.env.VITE_SHOWCASE_BUSINESS_DAYS || "1,2,3,4,5";
  const days = daysRaw
    .split(",")
    .map((d) => Number(d.trim()))
    .filter((d) => !Number.isNaN(d));

  return {
    timezone: import.meta.env.VITE_SHOWCASE_TIMEZONE || DEFAULT_TIMEZONE,
    start: import.meta.env.VITE_SHOWCASE_HOURS_START || DEFAULT_START,
    end: import.meta.env.VITE_SHOWCASE_HOURS_END || DEFAULT_END,
    days: days.length ? days : DEFAULT_DAYS,
  };
}

/**
 * @param {Date} date
 * @param {string} timeZone
 */
function getZonedTimeParts(date, timeZone) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(date);

  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  const [hours, minutes] = timeStr.split(":").map(Number);

  return {
    dayNum: DAY_NAME_TO_NUM[weekday] ?? -1,
    minutesOfDay: hours * 60 + minutes,
  };
}

/**
 * @param {string} hhmm
 */
function parseHHmm(hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * @param {Date} [now]
 * @param {ReturnType<typeof getShowcaseHoursConfig>} [config]
 */
export function isWithinBusinessHours(now = new Date(), config = getShowcaseHoursConfig()) {
  const { timezone, start, end, days } = config;
  const { dayNum, minutesOfDay } = getZonedTimeParts(now, timezone);

  if (!days.includes(dayNum)) {
    return false;
  }

  const startMinutes = parseHHmm(start);
  const endMinutes = parseHHmm(end);

  return minutesOfDay >= startMinutes && minutesOfDay < endMinutes;
}

/**
 * Human-readable schedule for the notice UI.
 */
export function formatBusinessHoursLabel(config = getShowcaseHoursConfig()) {
  const { timezone, start, end } = config;
  const dayLabel = "Monday to Friday";

  const formatTime = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    const minutes = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
    return `${hour12}${minutes} ${period}`;
  };

  const tzShort =
    timezone === "Australia/Sydney" ? "Sydney" : timezone.replace(/_/g, " ");

  return `${dayLabel}, ${formatTime(start)} – ${formatTime(end)} (${tzShort} time)`;
}

/**
 * Short hint for when the showcase opens next.
 */
export function getNextAvailabilityHint(config = getShowcaseHoursConfig()) {
  const now = new Date();
  if (isWithinBusinessHours(now, config)) {
    return "We are currently within scheduled showcase hours.";
  }

  const { timezone, start, days } = config;
  const startMinutes = parseHHmm(start);
  const [startH, startM] = start.split(":").map(Number);

  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    const { dayNum, minutesOfDay } = getZonedTimeParts(candidate, timezone);

    if (!days.includes(dayNum)) {
      continue;
    }

    if (offset === 0 && minutesOfDay >= startMinutes) {
      continue;
    }

    const dayName = new Intl.DateTimeFormat("en-AU", {
      timeZone: timezone,
      weekday: "long",
    }).format(candidate);

    const period = startH >= 12 ? "PM" : "AM";
    const hour12 = startH % 12 || 12;
    const minutes =
      startM === 0 ? "" : `:${String(startM).padStart(2, "0")}`;

    if (offset === 0) {
      return `Please check back today at ${hour12}${minutes} ${period} (${timezone.replace(/_/g, " ")}).`;
    }

    if (offset === 1) {
      return `Please check back tomorrow at ${hour12}${minutes} ${period} (${timezone.replace(/_/g, " ")}).`;
    }

    return `Please check back on ${dayName} at ${hour12}${minutes} ${period} (${timezone.replace(/_/g, " ")}).`;
  }

  return "Please check back during our scheduled showcase hours.";
}

/**
 * @param {number} [timeoutMs]
 */
export async function checkApiHealth(timeoutMs = 8000) {
  let apiBase = import.meta.env.VITE_API_URL || "";

  if (apiBase.endsWith("/api")) {
    apiBase = apiBase.slice(0, -4);
  } else if (apiBase.endsWith("/api/")) {
    apiBase = apiBase.slice(0, -5);
  }

  const url = apiBase ? `${apiBase}/api/health` : "/api/health";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      credentials: "include",
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data?.status === "OK";
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}
