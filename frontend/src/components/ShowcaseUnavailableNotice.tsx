import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { Button } from "./ui";
import usePageTitle from "../hooks/usePageTitle";
import type { UnavailableReason } from "../hooks/useShowcaseAvailability";
import { formatBusinessHoursLabel, getNextAvailabilityHint } from "../utils/showcaseBusinessHours";

const CONTACT_EMAIL = "thangtruong1808@gmail.com";
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Demo access request — Badminton Stores portfolio",
)}`;

const primaryLink =
  "inline-flex h-11 items-center justify-center gap-2 rounded-ui bg-primary px-4 font-ui text-sm font-semibold text-on-primary shadow-ui hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

const outlineLink =
  "inline-flex h-11 items-center justify-center gap-2 rounded-ui border border-line bg-surface px-4 font-ui text-sm font-semibold text-ink hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

interface ShowcaseUnavailableNoticeProps {
  reason: UnavailableReason;
  onRetry: () => void | Promise<void>;
  isRetrying?: boolean;
}

export default function ShowcaseUnavailableNotice({
  reason,
  onRetry,
  isRetrying = false,
}: ShowcaseUnavailableNoticeProps) {
  usePageTitle("Live Demo Available by Request");

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-ink sm:py-16">
      <main className="w-full max-w-lg rounded-ui-lg border border-line bg-surface p-6 text-center shadow-ui sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FaEnvelope className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Live Demo Available by Request</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          This project is a portfolio showcase built to demonstrate my full-stack development skills
          to potential employers and hiring teams.
        </p>
        <div className="mt-6 rounded-ui border border-line bg-surface-muted px-4 py-4 text-left sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Request demo access</p>
          <p className="mt-2 text-sm leading-relaxed text-ink sm:text-base">
            The live environment is activated on request. If you would like to explore the application,
            please email me at{" "}
            <a href={CONTACT_MAILTO} className="font-semibold text-primary hover:text-primary-hover">
              {CONTACT_EMAIL}
            </a>{" "}
            and I will gladly enable access so you can try it out.
          </p>
          {reason === "outside-hours" ? (
            <div className="mt-3 text-sm leading-relaxed text-muted">
              <p>Showcase hours: {formatBusinessHoursLabel()}.</p>
              <p className="mt-1">{getNextAvailabilityHint()}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted" role="status">
              The server did not respond. Check again, or email me to arrange a demo.
            </p>
          )}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted sm:text-sm">
          Thank you for your interest. In the meantime, you are welcome to review the source code on
          GitHub or connect with me on LinkedIn.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
          <a href={CONTACT_MAILTO} className={primaryLink}>
            <FaEnvelope className="h-4 w-4" aria-hidden="true" />
            Email me
          </a>
          <Button type="button" variant="outline" loading={isRetrying} onClick={() => void onRetry()}>
            Check again
          </Button>
        </div>
        <div className="mt-3 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="https://www.linkedin.com/in/thang-truong-00b245200/"
            target="_blank"
            rel="noopener noreferrer"
            className={outlineLink}
          >
            <FaLinkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href="https://github.com/thangtruong1808/Ecommerce_mysql_db"
            target="_blank"
            rel="noopener noreferrer"
            className={outlineLink}
          >
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        </div>
        <p className="mt-6 text-xs text-muted">
          Badminton Stores — Full-Stack E-commerce Portfolio Showcase
        </p>
      </main>
    </div>
  );
}
