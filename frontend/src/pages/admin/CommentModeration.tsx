import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaComments } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CategoryBulkBar,
  CategoryPageBar,
  CategorySelectBox,
  CategorySortHeader,
  CategoryToolbar,
} from "../../components/admin/categoryListChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import CommentTableRow, { type AdminComment } from "../../components/admin/CommentTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 10;

interface CommentsResponse {
  comments?: AdminComment[];
  pagination?: { pages?: number; total?: number };
}

export default function CommentModeration() {
  usePageTitle("Comment Moderation");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const commentsRef = useRef<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(comments);
  const requestId = useRef(0);

  const fetchComments = useCallback(async () => {
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
      if (approvalFilter !== "") {
        params.append("isApproved", approvalFilter);
      }
      const response = await axios.get<CommentsResponse>(`/api/admin/comments?${params}`);
      const list = Array.isArray(response.data?.comments) ? response.data.comments : null;
      if (id !== requestId.current) {
        return;
      }
      if (!list) {
        const message = "Comments could not be loaded";
        toast.error(message);
        if (commentsRef.current.length === 0) {
          setComments([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      commentsRef.current = list;
      setComments(list);
      setTotalPages(Number(response.data.pagination?.pages) || 1);
      setTotalItems(Number(response.data.pagination?.total) || 0);
      setError("");
    } catch (loadError: unknown) {
      if (id !== requestId.current) {
        return;
      }
      const message = messageFrom(loadError, "Comments could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (commentsRef.current.length === 0) {
        setComments([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, entriesPerPage, searchTerm, approvalFilter, sortBy, sortOrder, reloadKey]);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const runAction = async (commentId: number, work: () => Promise<void>, success: string) => {
    if (actingId !== null || deleting || bulkBusy) {
      return;
    }
    setActingId(commentId);
    try {
      await work();
      toast.success(success);
      await fetchComments();
    } catch (actionError: unknown) {
      if (!shouldSuppress401Toast(actionError)) {
        toast.error(messageFrom(actionError, "Failed to update comment"));
      }
    } finally {
      setActingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/comments/${deleteTarget.id}`);
      toast.success("Comment deleted successfully");
      setDeleteTarget(null);
      await fetchComments();
    } catch (deleteError: unknown) {
      if (!shouldSuppress401Toast(deleteError)) {
        toast.error(messageFrom(deleteError, "Failed to delete comment"));
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkApprove = async () => {
    if (bulkBusy || actingId !== null) {
      return;
    }
    const ids = Array.from(selected).map((id) => Number(id));
    setBulkBusy(true);
    try {
      await axios.post("/api/admin/comments/bulk-approve", { commentIds: ids });
      toast.success(`${ids.length} comment(s) approved successfully`);
      clear();
      await fetchComments();
    } catch (approveError: unknown) {
      if (!shouldSuppress401Toast(approveError)) {
        toast.error(messageFrom(approveError, "Failed to approve comments"));
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && comments.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex items-center gap-2 border-b border-line pb-4">
          <FaComments className="shrink-0 text-2xl text-primary" aria-hidden="true" />
          <h1 className="font-ui text-3xl font-semibold">Comment Moderation</h1>
        </div>
        <CategoryToolbar
          searchId="comment-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          searchPlaceholder="Search comments by user, product, or comment text..."
          filterId="comment-approval-filter"
          filterLabel="Approval"
          filterValue={approvalFilter}
          onFilterChange={(value: string) => {
            setApprovalFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Comments" },
            { value: "true", label: "Approved" },
            { value: "false", label: "Pending" },
          ]}
        />
        <CategoryPageBar
          position="top"
          pageSizeId="comment-page-size"
          paginationLabel="Comments pagination"
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
        {loading && comments.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Comments could not be loaded"
            description={error}
            action={<Button id="comments-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}
        {!showLoadError && !(loading && comments.length === 0) ? (
          <div className="min-w-0 overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <CategorySelectBox
                        pressed={comments.length > 0 && selectedCount === comments.length}
                        label="Select all comments on this page"
                        onClick={() => selectAll(selectedCount < comments.length)}
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">#</th>
                    <CategorySortHeader label="ID Comment" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Product" field="product_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="User" field="user_name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Comment" field="comment" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Approved" field="is_approved" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {comments.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="font-ui text-lg font-medium text-muted">
                          {searchTerm ? `No comments found matching "${searchTerm}"` : "No comments found"}
                        </p>
                        {searchTerm ? <p className="mt-2 font-ui text-sm text-muted">Try adjusting your search terms or clear the search to see all comments.</p> : null}
                      </td>
                    </tr>
                  ) : (
                    comments.map((comment, index) => (
                      <CommentTableRow
                        key={comment.id}
                        comment={comment}
                        rowNumber={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(comment.id)}
                        busy={actingId === comment.id}
                        onToggle={toggle}
                        onApprove={() => { void runAction(comment.id, () => axios.post(`/api/comments/${comment.id}/approve`), "Comment approved"); }}
                        onReject={() => { void runAction(comment.id, () => axios.post(`/api/comments/${comment.id}/reject`), "Comment rejected"); }}
                        onDelete={() => setDeleteTarget(comment)}
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
          pageSizeId="comment-page-size-bottom"
          paginationLabel="Comments pagination"
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
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="comment"
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
          actions={[{ type: "approve", label: "Approve Selected" }]}
          onAction={(actionType: string) => {
            if (actionType === "approve") {
              void handleBulkApprove();
            }
          }}
          onCancel={clear}
        />
      </div>
    </AdminLayout>
  );
}
