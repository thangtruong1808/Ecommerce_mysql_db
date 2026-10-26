import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CategoryBulkBar,
  CategoryPageBar,
  CategorySelectBox,
  CategorySortHeader,
  CategoryToolbar,
} from "../../components/admin/categoryListChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import ReviewEditModal, { type ReviewEditInput } from "../../components/admin/ReviewEditModal";
import ReviewTableRow, { type AdminReview } from "../../components/admin/ReviewTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 12;

interface ReviewsResponse {
  reviews?: AdminReview[];
  pagination?: { pages?: number; total?: number };
}

export default function ReviewManagement() {
  usePageTitle("Review Management");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const reviewsRef = useRef<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
  const [editReview, setEditReview] = useState<AdminReview | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(reviews);
  const requestId = useRef(0);

  const fetchReviews = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(entriesPerPage),
        sortBy,
        sortOrder,
      });
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (ratingFilter) {
        params.append("rating", ratingFilter);
      }
      const response = await axios.get<ReviewsResponse>(`/api/admin/reviews?${params}`);
      const list = Array.isArray(response.data?.reviews) ? response.data.reviews : null;
      if (id !== requestId.current) {
        return;
      }
      if (!list) {
        const message = "Reviews could not be loaded";
        toast.error(message);
        if (reviewsRef.current.length === 0) {
          setReviews([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      reviewsRef.current = list;
      setReviews(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      if (id !== requestId.current) {
        return;
      }
      const message = messageFrom(loadError, "Reviews could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (reviewsRef.current.length === 0) {
        setReviews([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, entriesPerPage, searchTerm, ratingFilter, sortBy, sortOrder, reloadKey]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleUpdate = async (data: ReviewEditInput) => {
    if (!editReview) {
      return;
    }
    try {
      await axios.put(`/api/admin/reviews/${editReview.id}`, data);
      toast.success("Review updated successfully");
      setEditReview(null);
      await fetchReviews();
    } catch (updateError: unknown) {
      if (!shouldSuppress401Toast(updateError)) {
        toast.error(messageFrom(updateError, "Failed to update review"));
      }
      throw updateError;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/reviews/${deleteTarget.id}`);
      toast.success("Review deleted successfully");
      setDeleteTarget(null);
      await fetchReviews();
    } catch (deleteError: unknown) {
      if (!shouldSuppress401Toast(deleteError)) {
        toast.error(messageFrom(deleteError, "Failed to delete review"));
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (bulkBusy) {
      return;
    }
    const ids = Array.from(selected).map((id) => Number(id));
    setBulkBusy(true);
    try {
      for (const id of ids) {
        await axios.delete(`/api/admin/reviews/${id}`);
      }
      toast.success(`${ids.length} review(s) deleted successfully`);
      clear();
      await fetchReviews();
    } catch (deleteError: unknown) {
      if (!shouldSuppress401Toast(deleteError)) {
        toast.error(messageFrom(deleteError, "Failed to delete reviews"));
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && reviews.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex items-center gap-2 border-b border-line pb-4">
          <FaStar className="shrink-0 text-2xl text-secondary" aria-hidden="true" />
          <h1 className="font-ui text-3xl font-semibold">Review Management</h1>
        </div>
        <CategoryToolbar
          searchId="review-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          searchPlaceholder="Search by user, product, or comment..."
          filterId="review-rating-filter"
          filterLabel="Rating"
          filterValue={ratingFilter}
          onFilterChange={(value: string) => {
            setRatingFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Ratings" },
            { value: "5", label: "5 Stars" },
            { value: "4", label: "4 Stars" },
            { value: "3", label: "3 Stars" },
            { value: "2", label: "2 Stars" },
            { value: "1", label: "1 Star" },
          ]}
        />
        <CategoryPageBar
          position="top"
          pageSizeId="review-page-size"
          paginationLabel="Reviews pagination"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value: number) => {
            setEntriesPerPage(value);
            setPage(1);
          }}
        />
        {loading && reviews.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Reviews could not be loaded"
            description={error}
            action={<Button id="reviews-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}
        {!showLoadError && !(loading && reviews.length === 0) ? (
          <div className="min-w-0 overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <CategorySelectBox
                        pressed={reviews.length > 0 && selectedCount === reviews.length}
                        label="Select all reviews on this page"
                        onClick={() => selectAll(selectedCount < reviews.length)}
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">#</th>
                    <CategorySortHeader label="ID Review" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Product" field="product_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Product ID" field="product_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="User" field="user_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="User ID" field="user_id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Rating" field="rating" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Comment" field="comment" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {reviews.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="font-ui text-lg font-medium text-muted">
                          {searchTerm ? `No reviews found matching "${searchTerm}"` : "No reviews found"}
                        </p>
                        {searchTerm ? <p className="mt-2 font-ui text-sm text-muted">Try adjusting your search terms or clear the search to see all reviews.</p> : null}
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review, index) => (
                      <ReviewTableRow
                        key={review.id}
                        review={review}
                        rowNumber={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(review.id)}
                        onToggle={toggle}
                        onEdit={() => setEditReview(review)}
                        onDelete={() => setDeleteTarget(review)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <CategoryPageBar
          position="bottom"
          pageSizeId="review-page-size-bottom"
          paginationLabel="Reviews pagination"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value: number) => {
            setEntriesPerPage(value);
            setPage(1);
          }}
        />
        <ReviewEditModal review={editReview} isOpen={Boolean(editReview)} onClose={() => setEditReview(null)} onSave={handleUpdate} />
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="review"
          isOpen={Boolean(deleteTarget)}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
        />
        <CategoryBulkBar
          selectedCount={selectedCount}
          busy={bulkBusy}
          actions={[{ type: "delete", label: "Delete Selected" }]}
          onAction={(actionType: string) => {
            if (actionType === "delete") {
              void handleBulkDelete();
            }
          }}
          onCancel={clear}
        />
      </div>
    </AdminLayout>
  );
}
