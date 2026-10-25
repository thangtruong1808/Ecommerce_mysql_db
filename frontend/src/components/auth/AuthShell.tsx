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
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <div className="rounded-ui-lg border border-line bg-surface p-6 shadow-ui sm:p-8">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-block rounded-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <img src={logoImage} alt="Badminton Stores" className="mx-auto h-16 w-auto object-contain" />
          </Link>
        </div>
        <div className="mb-6 text-center">
          <h1 className="font-display text-4xl text-ink">{title}</h1>
          {intro ? <div className="mt-3 font-ui text-sm text-muted">{intro}</div> : null}
        </div>
        {children}
      </div>
      {aside ? (
        <aside className="mt-4 rounded-ui-lg border border-line bg-canvas px-5 py-4">{aside}</aside>
      ) : null}
    </div>
  );
}

export default AuthShell;
