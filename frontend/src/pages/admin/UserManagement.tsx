import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaUsers } from "react-icons/fa";
import type { User } from "@shared/auth";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CategoryPageBar,
  CategorySelectBox,
  CategorySortHeader,
  CategoryToolbar,
} from "../../components/admin/categoryListChrome";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import UserCreateModal, { type UserCreateInput } from "../../components/admin/UserCreateModal";
import UserEditModal, { type UserEditInput } from "../../components/admin/UserEditModal";
import UserTableRow from "../../components/admin/UserTableRow";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { useSelection } from "../../utils/useSelection";
import { deleteUser, quickCreateUser, updateUserRole } from "../../utils/dashboardCrud";
import { shouldSuppress401Toast } from "../../utils/authUtils";
import { messageFrom } from "./dashboardFormat";

const COLUMN_COUNT = 9;

interface UsersResponse {
  users?: User[];
  pagination?: { pages?: number; total?: number };
}

export default function UserManagement() {
  usePageTitle("User Management");
  const [users, setUsers] = useState<User[]>([]);
  const usersRef = useRef<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [roleUserId, setRoleUserId] = useState<number | null>(null);
  const { selected, toggle, selectAll, clear, selectedCount } = useSelection(users);
  const requestId = useRef(0);

  const fetchUsers = useCallback(async () => {
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
      if (roleFilter) {
        params.append("role", roleFilter);
      }
      const response = await axios.get<UsersResponse>(`/api/admin/users?${params}`);
      const list = Array.isArray(response.data?.users) ? response.data.users : null;
      if (id !== requestId.current) {
        return;
      }
      if (!list) {
        const message = "Users could not be loaded";
        toast.error(message);
        if (usersRef.current.length === 0) {
          setUsers([]);
          setTotalPages(1);
          setTotalItems(0);
          setError(message);
        }
        return;
      }
      usersRef.current = list;
      setUsers(list);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalItems(response.data.pagination?.total || 0);
      setError("");
    } catch (loadError: unknown) {
      if (id !== requestId.current) {
        return;
      }
      const message = messageFrom(loadError, "Users could not be loaded");
      if (!shouldSuppress401Toast(loadError)) {
        toast.error(message);
      }
      if (usersRef.current.length === 0) {
        setUsers([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(message);
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, entriesPerPage, searchTerm, roleFilter, sortBy, sortOrder, reloadKey]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: string, order: string) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (roleUserId !== null || bulkBusy) {
      return;
    }
    setRoleUserId(userId);
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers();
    } finally {
      setRoleUserId(null);
    }
  };

  const handleCreate = async (data: UserCreateInput) => {
    await quickCreateUser(data);
    setCreateOpen(false);
    await fetchUsers();
  };

  const handleUpdate = async (data: UserEditInput) => {
    if (!editUser) {
      return;
    }
    try {
      await axios.put(`/api/admin/users/${editUser.id}`, data);
      toast.success("User updated successfully");
      setEditUser(null);
      await fetchUsers();
    } catch (updateError: unknown) {
      if (!shouldSuppress401Toast(updateError)) {
        toast.error(messageFrom(updateError, "Failed to update user"));
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
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      await fetchUsers();
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkAction = async (actionType: string, data?: { role?: string }) => {
    if (bulkBusy || roleUserId !== null) {
      return;
    }
    setBulkBusy(true);
    try {
      if (actionType === "update-role" && data?.role) {
        for (const id of selected) {
          await updateUserRole(Number(id), data.role);
        }
      } else if (actionType === "delete") {
        for (const id of selected) {
          await deleteUser(Number(id));
        }
      }
      clear();
      await fetchUsers();
    } finally {
      setBulkBusy(false);
    }
  };

  const showLoadError = Boolean(error) && users.length === 0;

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-full text-ink">
        <div className="mb-4 flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <FaUsers className="shrink-0 text-2xl text-primary" aria-hidden="true" />
            <h1 className="font-ui text-3xl font-semibold">User Management</h1>
          </div>
          <Button id="add-user" onClick={() => setCreateOpen(true)}>
            <FaPlus aria-hidden="true" />
            Add user
          </Button>
        </div>
        <CategoryToolbar
          searchId="user-search"
          searchTerm={searchTerm}
          onSearchChange={(value: string) => {
            setSearchTerm(value);
            setPage(1);
          }}
          searchPlaceholder="Search users..."
          filterId="user-role-filter"
          filterLabel="Role"
          filterValue={roleFilter}
          onFilterChange={(value: string) => {
            setRoleFilter(value);
            setPage(1);
          }}
          filterOptions={[
            { value: "", label: "All Roles" },
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
        />
        <CategoryPageBar
          position="top"
          pageSizeId="user-page-size"
          paginationLabel="Users pagination"
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
        {loading && users.length === 0 && !showLoadError ? <Skeleton className="h-96" /> : null}
        {showLoadError ? (
          <EmptyState
            title="Users could not be loaded"
            description={error}
            action={<Button id="users-retry" loading={loading} onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>}
          />
        ) : null}
        {!showLoadError && !(loading && users.length === 0) ? (
          <div className="min-w-0 overflow-hidden rounded-ui-lg border border-line bg-surface shadow-ui" aria-busy={loading || undefined}>
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <CategorySelectBox
                        pressed={users.length > 0 && selectedCount === users.length}
                        label="Select all users on this page"
                        onClick={() => selectAll(selectedCount < users.length)}
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">#</th>
                    <CategorySortHeader label="ID User" field="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Name" field="name" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Email" field="email" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Role" field="role" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Created" field="created_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <CategorySortHeader label="Updated" field="updated_at" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="px-3 py-3 text-left font-ui text-xs font-semibold uppercase text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {users.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT} className="px-6 py-12 text-center">
                        <p className="font-ui text-lg font-medium text-muted">
                          {searchTerm ? `No users found matching "${searchTerm}"` : "No users found"}
                        </p>
                        {searchTerm ? <p className="mt-2 font-ui text-sm text-muted">Try adjusting your search terms or clear the search to see all users.</p> : null}
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        rowNumber={(page - 1) * entriesPerPage + index + 1}
                        isSelected={selected.has(user.id)}
                        roleBusy={roleUserId === user.id}
                        onToggle={toggle}
                        onRoleChange={(role) => { void handleRoleChange(user.id, role); }}
                        onEdit={() => setEditUser(user)}
                        onDelete={() => setDeleteTarget(user)}
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
          pageSizeId="user-page-size-bottom"
          paginationLabel="Users pagination"
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
        <UserCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreate} />
        <UserEditModal user={editUser} isOpen={Boolean(editUser)} onClose={() => setEditUser(null)} onSave={handleUpdate} />
        <ConfirmDeleteModal
          entity={deleteTarget}
          entityType="user"
          isOpen={Boolean(deleteTarget)}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
        />
        <UserBulkBar
          selectedCount={selectedCount}
          busy={bulkBusy}
          onAction={(actionType, data) => { void handleBulkAction(actionType, data); }}
          onCancel={clear}
        />
      </div>
    </AdminLayout>
  );
}

const userBulkActions = [
  { type: "update-role", label: "Make admin", data: { role: "admin" } },
  { type: "delete", label: "Delete Selected" },
];

function UserBulkBar({
  selectedCount,
  busy,
  onAction,
  onCancel,
}: {
  selectedCount: number;
  busy: boolean;
  onAction: (actionType: string, data?: { role?: string }) => void;
  onCancel: () => void;
}) {
  if (selectedCount === 0) {
    return null;
  }
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex w-[min(100%-1.5rem,42rem)] -translate-x-1/2 flex-col gap-3 rounded-ui-lg border border-line bg-surface px-4 py-3 text-ink shadow-ui-md sm:flex-row sm:items-center">
      <p className="font-ui text-sm font-semibold">
        {selectedCount} item{selectedCount === 1 ? "" : "s"} selected
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
        {userBulkActions.map((action) => (
          <Button
            key={action.label}
            type="button"
            size="sm"
            variant={action.type === "delete" ? "danger" : "outline"}
            loading={busy}
            onClick={() => onAction(action.type, action.data)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={busy}>
        Cancel
      </Button>
    </div>
  );
}
