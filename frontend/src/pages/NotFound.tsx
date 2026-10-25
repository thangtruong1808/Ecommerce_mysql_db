import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const action =
  "inline-flex h-11 items-center justify-center rounded-ui px-4 font-ui text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

function NotFound() {
  usePageTitle("Page Not Found");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="font-ui text-sm font-semibold uppercase tracking-wide text-muted">404</p>
        <h1 className="mt-3 font-display text-4xl text-ink">Page not found</h1>
        <p className="mt-3 text-muted">
          That address is not part of the store. It may have moved, or the link may be out of date.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className={`${action} bg-primary text-on-primary shadow-ui hover:bg-primary-hover`}>
            Go home
          </Link>
          <Link to="/products" className={`${action} border border-line bg-surface text-ink hover:bg-surface-muted`}>
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
