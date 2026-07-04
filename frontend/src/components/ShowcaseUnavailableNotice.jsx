/**
 * Full-screen notice shown when the showcase server is not currently active.
 * The live demo is activated on request to keep hosting costs low, so visitors
 * are invited to reach out by email to try the application.
 */

import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaRedo,
} from "react-icons/fa";

const CONTACT_EMAIL = "thangtruong1808@gmail.com";
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Demo access request — Badminton Stores portfolio"
)}`;

/**
 * @param {Object} props
 * @param {'outside-hours' | 'server-unavailable'} [props.reason]
 * @param {() => void | Promise<void>} [props.onRetry]
 * @param {boolean} [props.isRetrying]
 */
const ShowcaseUnavailableNotice = ({ onRetry, isRetrying = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <FaEnvelope className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Live Demo Available by Request
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            This project is a portfolio showcase built to demonstrate my
            full-stack development skills to potential employers and hiring
            teams.
          </p>

          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-4 sm:px-5 mb-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Request demo access
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              The live environment is activated on request. If you would like to
              explore the application, please email me at{" "}
              <a
                href={CONTACT_MAILTO}
                className="font-semibold text-blue-600 hover:text-blue-700 break-words"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              and I will gladly enable access so you can try it out.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
            Thank you for your interest. In the meantime, you are welcome to
            review the source code on GitHub or connect with me on LinkedIn.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6">
            <a
              href={CONTACT_MAILTO}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <FaEnvelope className="h-4 w-4" aria-hidden="true" />
              Email Me
            </a>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <FaRedo
                  className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {isRetrying ? "Checking..." : "Check Again"}
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6">
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
