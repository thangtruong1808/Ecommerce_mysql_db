import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const action =
  "inline-flex h-11 items-center justify-center rounded-ui px-4 font-ui text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export default function Maintenance() {
  usePageTitle("Maintenance");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl text-ink">The store is offline for maintenance</h1>
        <p className="mt-3 text-muted">
          Badminton Stores is briefly unavailable while the shop is updated. Please try again soon.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/" className={`${action} bg-primary text-on-primary shadow-ui hover:bg-primary-hover`}>
            Try the shop
          </Link>
        </div>
      </div>
    </div>
  );
}
