import { Link } from "react-router-dom";
import type { Voucher } from "@shared/commerce";
import VoucherCard from "./VoucherCard";
import { Button, EmptyState, Skeleton } from "./ui";

type LoadStatus = "loading" | "ready" | "error";

interface VoucherSectionProps {
  vouchers: Voucher[];
  status: LoadStatus;
  onRetry: () => void;
  retrying: boolean;
}

const shopLink =
  "inline-flex items-center rounded-ui-sm text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export default function VoucherSection({
  vouchers,
  status,
  onRetry,
  retrying,
}: VoucherSectionProps) {
  if (status === "ready" && vouchers.length === 0) {
    return null;
  }

  const shown = vouchers.slice(0, 6);

  return (
    <section aria-labelledby="home-vouchers">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 id="home-vouchers" className="text-2xl font-bold text-ink">
          Special offers
        </h2>
        <Link to="/products" className={shopLink}>
          Shop now
        </Link>
      </div>
      {status === "loading" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-44" />
          ))}
          <p className="sr-only">Loading vouchers</p>
        </div>
      ) : null}
      {status === "error" ? (
        <EmptyState
          title="Vouchers could not be loaded"
          description="The current offers did not come back. Try again."
          action={
            <Button type="button" loading={retrying} onClick={onRetry}>
              Try again
            </Button>
          }
        />
      ) : null}
      {status === "ready" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((voucher) => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
