/**
 * Gates the app behind business-hours and API availability checks.
 */

import LoadingSpinner from "./LoadingSpinner";
import ShowcaseUnavailableNotice from "./ShowcaseUnavailableNotice";
import useShowcaseAvailability from "../hooks/useShowcaseAvailability";

/**
 * @param {{ children: import('react').ReactNode }} props
 */
const ShowcaseAvailabilityGate = ({ children }) => {
  const { status, reason, retry, isRetrying } = useShowcaseAvailability();

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner message="" />
        </div>
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <ShowcaseUnavailableNotice
        reason={reason || "outside-hours"}
        onRetry={retry}
        isRetrying={isRetrying}
      />
    );
  }

  return children;
};

export default ShowcaseAvailabilityGate;
