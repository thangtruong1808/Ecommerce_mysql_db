const DAY_NAME_TO_NUM: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_TIMEZONE = "Australia/Sydney";
const DEFAULT_START = "13:00";
const DEFAULT_END = "18:00";
const DEFAULT_DAYS = [1, 2, 3, 4, 5];
const DEFAULT_START_MINUTES = 13 * 60;
const DEFAULT_END_MINUTES = 18 * 60;

export interface ShowcaseHoursConfig {
  timezone: string;
  start: string;
  end: string;
  days: number[];
}

export function isShowcaseHoursEnabled(): boolean {
  if (import.meta.env.DEV && import.meta.env.VITE_SHOWCASE_HOURS_ENABLED !== "true") {
    return false;
  }
  return import.meta.env.VITE_SHOWCASE_HOURS_ENABLED !== "false";
}

export function getShowcaseHoursConfig(): ShowcaseHoursConfig {
  const daysRaw = import.meta.env.VITE_SHOWCASE_BUSINESS_DAYS || "1,2,3,4,5";
  const days = daysRaw
    .split(",")
    .map((day: string) => Number(day.trim()))
    .filter((day: number) => Number.isInteger(day) && day >= 0 && day <= 6);

  return {
    timezone: import.meta.env.VITE_SHOWCASE_TIMEZONE || DEFAULT_TIMEZONE,
    start: import.meta.env.VITE_SHOWCASE_HOURS_START || DEFAULT_START,
    end: import.meta.env.VITE_SHOWCASE_HOURS_END || DEFAULT_END,
    days: days.length ? days : DEFAULT_DAYS,
  };
}

function readZonedParts(date: Date, timeZone: string): { dayNum: number; minutesOfDay: number } {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(date);

  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);

  const [rawHours, rawMinutes] = timeStr.split(":").map(Number);
  const hours = rawHours === 24 ? 0 : rawHours;

  return {
    dayNum: DAY_NAME_TO_NUM[weekday] ?? -1,
    minutesOfDay: hours * 60 + rawMinutes,
  };
}

function getZonedTimeParts(date: Date, timeZone: string): { dayNum: number; minutesOfDay: number } {
  try {
    return readZonedParts(date, timeZone);
  } catch {
    return readZonedParts(date, DEFAULT_TIMEZONE);
  }
}

function parseHHmm(hhmm: string, fallback: number): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) {
    return fallback;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return fallback;
  }
  return hours * 60 + minutes;
}

export function isWithinBusinessHours(
  now = new Date(),
  config: ShowcaseHoursConfig = getShowcaseHoursConfig(),
): boolean {
  const { dayNum, minutesOfDay } = getZonedTimeParts(now, config.timezone);
  if (!config.days.includes(dayNum) || !Number.isFinite(minutesOfDay)) {
    return false;
  }
  const startMinutes = parseHHmm(config.start, DEFAULT_START_MINUTES);
  const endMinutes = parseHHmm(config.end, DEFAULT_END_MINUTES);
  return minutesOfDay >= startMinutes && minutesOfDay < endMinutes;
}

function formatClock(hhmm: string, fallback: string): string {
  const minutes = parseHHmm(hhmm, parseHHmm(fallback, 0));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const minuteLabel = mins === 0 ? "" : `:${String(mins).padStart(2, "0")}`;
  return `${hour12}${minuteLabel} ${period}`;
}

function formatDays(days: number[]): string {
  const sorted = [...new Set(days)].filter((day) => day >= 0 && day <= 6).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return "scheduled days";
  }
  const consecutive = sorted.every((day, index) => index === 0 || day === sorted[index - 1] + 1);
  if (sorted.length === 1) {
    return DAY_LABELS[sorted[0]];
  }
  if (consecutive) {
    return `${DAY_LABELS[sorted[0]]} to ${DAY_LABELS[sorted[sorted.length - 1]]}`;
  }
  return sorted.map((day) => DAY_LABELS[day]).join(", ");
}

export function formatBusinessHoursLabel(config: ShowcaseHoursConfig = getShowcaseHoursConfig()): string {
  const tzShort = config.timezone === "Australia/Sydney" ? "Sydney" : config.timezone.replace(/_/g, " ");
  return `${formatDays(config.days)}, ${formatClock(config.start, DEFAULT_START)} – ${formatClock(config.end, DEFAULT_END)} (${tzShort} time)`;
}

export function getNextAvailabilityHint(config: ShowcaseHoursConfig = getShowcaseHoursConfig()): string {
  const now = new Date();
  if (isWithinBusinessHours(now, config)) {
    return "We are currently within scheduled showcase hours.";
  }

  const startMinutes = parseHHmm(config.start, DEFAULT_START_MINUTES);
  const place = config.timezone.replace(/_/g, " ");
  const clock = formatClock(config.start, DEFAULT_START);

  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    const { dayNum, minutesOfDay } = getZonedTimeParts(candidate, config.timezone);
    if (!config.days.includes(dayNum)) {
      continue;
    }
    if (offset === 0 && minutesOfDay >= startMinutes) {
      continue;
    }

    if (offset === 0) {
      return `Please check back today at ${clock} (${place}).`;
    }
    if (offset === 1) {
      return `Please check back tomorrow at ${clock} (${place}).`;
    }

    const dayName = new Intl.DateTimeFormat("en-AU", {
      timeZone: config.timezone === "" ? DEFAULT_TIMEZONE : config.timezone,
      weekday: "long",
    }).format(candidate);
    return `Please check back on ${dayName} at ${clock} (${place}).`;
  }

  return "Please check back during our scheduled showcase hours.";
}

export async function checkApiHealth(timeoutMs = 8000): Promise<boolean> {
  let apiBase = import.meta.env.VITE_API_URL || "";
  if (!/^https?:\/\//i.test(apiBase)) {
    apiBase = "";
  } else if (apiBase.endsWith("/api")) {
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
    const data = (await response.json()) as { status?: string };
    return data?.status === "OK";
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}
