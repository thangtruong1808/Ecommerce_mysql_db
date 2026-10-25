import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const action =
  "inline-flex h-10 items-center justify-center rounded-ui-sm px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

function NotFound() {
  usePageTitle("Page Not Found");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-muted">404</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-muted">
          That address is not part of the store. It may have moved, or the link may be out of date.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className={`${action} bg-primary text-on-primary hover:bg-primary-hover`}>
            Go home
          </Link>
          <Link to="/products" className={`${action} bg-secondary text-on-secondary hover:bg-secondary-hover`}>
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
