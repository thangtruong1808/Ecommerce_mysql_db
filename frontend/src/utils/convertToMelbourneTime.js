// // Converts a timestamp (string or number) to the client's local time
// export default function convertToLocalTime(timestamp) {
//   if (timestamp === null || timestamp === undefined) {
//     return "Invalid timestamp";
//   }

//   const normalized = Number(String(timestamp).trim());

//   if (Number.isNaN(normalized)) {
//     return "Invalid timestamp";
//   }

//   const ts =
//     normalized.toString().length === 10
//       ? normalized * 1000 // seconds → ms
//       : normalized; // milliseconds

//   const date = new Date(ts);

//   if (Number.isNaN(date.getTime())) {
//     return "Invalid Date";
//   }

//   // Automatically detect client's timezone
//   const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//   return date.toLocaleString(undefined, {
//     timeZone: clientTimeZone,
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
// }

// Returns remaining seconds until the timestamp expires
export function getRemainingSeconds(timestamp) {
  if (timestamp === null || timestamp === undefined) {
    return 0;
  }

  const normalized = Number(String(timestamp).trim());
  if (Number.isNaN(normalized)) {
    return 0;
  }

  const ts =
    normalized.toString().length === 10 ? normalized * 1000 : normalized;

  const now = Date.now();
  const diffMs = ts - now;

  return Math.max(0, Math.floor(diffMs / 1000));
}

// Starts a countdown until expiry
export function startExpiryCountdown(timestamp, onExpire) {
  let remainingSeconds = getRemainingSeconds(timestamp);

  // Initial check
  if (remainingSeconds === 0) {
    onExpire();
    return;
  }

  const intervalId = setInterval(() => {
    remainingSeconds -= 1;

    console.log("Remaining seconds:", remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      onExpire(); // 🔔 alert / logout here
    }
  }, 1000);

  return intervalId; // allows cleanup if needed
}
