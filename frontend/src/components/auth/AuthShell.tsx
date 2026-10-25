import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/Logo.png";

interface AuthShellProps {
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}

function AuthShell({ title, intro, aside, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center bg-canvas">
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className={`grid items-center gap-10 ${aside ? "lg:grid-cols-2" : ""}`}>
          {aside ? (
            <aside className="hidden rounded-ui border border-line bg-surface p-8 shadow-ui lg:block">
              {aside}
            </aside>
          ) : null}
          <div className="rounded-ui border border-line bg-surface p-8 shadow-ui">
            <div className="mb-6 text-center">
              <Link to="/" className="inline-block rounded-ui-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <img src={logoImage} alt="Badminton Stores" className="mx-auto h-20 w-auto object-contain" />
              </Link>
            </div>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-ink">{title}</h1>
              {intro ? <div className="mt-2 text-sm text-muted">{intro}</div> : null}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
