/**
 * Full-screen notice when the showcase is outside business hours
 * or the server is temporarily unavailable.
 */

import {
  FaClock,
  FaGithub,
  FaLinkedin,
  FaRedo,
  FaStore,
} from "react-icons/fa";
import {
  formatBusinessHoursLabel,
  getNextAvailabilityHint,
} from "../utils/showcaseBusinessHours";

/**
 * @param {Object} props
 * @param {'outside-hours' | 'server-unavailable'} [props.reason]
 * @param {() => void | Promise<void>} [props.onRetry]
 * @param {boolean} [props.isRetrying]
 */
const ShowcaseUnavailableNotice = ({
  reason = "outside-hours",
  onRetry,
  isRetrying = false,
}) => {
  const scheduleLabel = formatBusinessHoursLabel();
  const nextHint = getNextAvailabilityHint();

  const isOutsideHours = reason === "outside-hours";

  const title = isOutsideHours
    ? "Showcase Temporarily Offline"
    : "We’ll Be Back Shortly";

  const description = isOutsideHours
    ? "This e-commerce project is a portfolio showcase for employers. To manage hosting costs, it runs on a scheduled server that is only online during business hours."
    : "Our showcase server is starting up or temporarily unavailable. This usually happens outside scheduled hours or while the instance is waking up.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            {isOutsideHours ? (
              <FaClock className="h-8 w-8" aria-hidden="true" />
            ) : (
              <FaStore className="h-8 w-8" aria-hidden="true" />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            {description}
          </p>

          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-4 mb-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Scheduled showcase hours
            </p>
            <p className="text-sm sm:text-base font-medium text-gray-800">
              {scheduleLabel}
            </p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {nextHint}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
            Thank you for your interest. If you are a recruiter or hiring
            manager, feel free to connect on LinkedIn or review the source
            code on GitHub while you wait.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <FaRedo
                  className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {isRetrying ? "Checking..." : "Check Again"}
              </button>
            )}
            <a
              href="https://www.linkedin.com/in/thang-truong-00b245200/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaLinkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href="https://github.com/thangtruong1808/Ecommerce_mysql_db"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaGithub className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </div>

          <p className="text-xs text-gray-400">
            Badminton Stores — Full-Stack E-commerce Portfolio Showcase
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseUnavailableNotice;
