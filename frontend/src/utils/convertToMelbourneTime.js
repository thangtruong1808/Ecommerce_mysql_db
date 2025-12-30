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
export function startExpiryCountdown(timestamp, onExpire) {
  let remainingSeconds = getRemainingSeconds(timestamp);

  // If already expired, call immediately
  if (remainingSeconds <= 0) {
    onExpire();
    return null;
  }

  // If more than 5 seconds remaining, set a timeout to wait until 5 seconds left
  if (remainingSeconds > 5) {
    const timeoutId = setTimeout(() => {
      // Start the final 5-second countdown
      startFinalCountdown(onExpire);
    }, (remainingSeconds - 5) * 1000);

    return timeoutId; // return the timeout ID for cleanup if needed
  } else {
    // If 5 seconds or less, start countdown immediately
    startFinalCountdown(onExpire);
    return null;
  }

  // Helper: starts the last 5-second interval
  function startFinalCountdown(callback) {
    let finalSeconds = Math.min(remainingSeconds, 5);

    const intervalId = setInterval(() => {
      finalSeconds -= 1;
      // console.log("Final countdown:", finalSeconds);

      if (finalSeconds <= 0) {
        clearInterval(intervalId);
        callback();
      }
    }, 1000);
  }
}
