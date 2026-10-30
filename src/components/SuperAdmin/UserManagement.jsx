
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Users,
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  UserRound,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Ban,
  Save,
  FilterX,
} from "lucide-react";

import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#201E64";
const PAGE_SIZE = 10;

const ROLES = [
  { value: "", label: "All Roles" },
  { value: "1", label: "SMME" },
  { value: "2", label: "ED Team" },
  { value: "3", label: "Admin" },
  { value: "4", label: "Super Admin" },
];

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const roleLabel = (roleId) =>
  ROLES.find((r) => r.value === String(roleId))?.label ||
  "Unknown";

const fullName = (user) =>
  [user?.title, user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ") || "Unknown User";

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

function StatusBadge({ status }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-none text-xs font-semibold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

// ======================================================
// USER DETAILS AND ACCOUNT MANAGEMENT
// ======================================================

function UserDetailsModal({
  user,
  currentUserId,
  onClose,
  onUpdated,
}) {
  const [roleId, setRoleId] = useState(
    String(user.role_id)
  );
  const [status, setStatus] = useState(user.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const isSelf =
    Number(currentUserId) === Number(user.user_id);

  const roleChanged =
    Number(roleId) !== Number(user.role_id);

  const statusChanged = status !== user.status;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        if (confirmation) setConfirmation(null);
        else onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [confirmation, saving, onClose]);

  const handleSave = async (type) => {
    setError("");
    setSuccess("");

    if (isSelf) {
      setError("You cannot modify your own account.");
      return;
    }

    setConfirmation({
      type,
      message:
        type === "role"
          ? `Change ${fullName(user)}'s role to ${roleLabel(roleId)}?`
          : `${status === "ACTIVE" ? "Activate" : "Deactivate"} ${fullName(user)}'s account?`,
    });
  };

  const confirmSave = async () => {
    if (!confirmation || saving) return;

    const type = confirmation.type;
    setSaving(true);
    setError("");
    setSuccess("");
    setConfirmation(null);

    try {
      if (type === "role") {
        await api.patch(
          `/super-admin/users/${user.user_id}/role`,
          { role_id: Number(roleId) }
        );

        setSuccess("User role updated successfully.");
      } else {
        await api.patch(
          `/super-admin/users/${user.user_id}/status`,
          { status }
        );

        setSuccess("Account status updated successfully.");
      }

      await onUpdated();

      // Close after success so the next opening
      // receives the latest user record.
      onClose();
    } catch (err) {
      console.error("Update user error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update user. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const details = [
    ["User ID", user.user_id],
    ["Full Name", fullName(user)],
    ["Email", user.email],
    ["Phone Number", user.phone_number],
    ["Gender", user.gender],
    ["Registered", formatDate(user.created_at)],
  ];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-3 sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        className="bg-white w-full max-w-2xl rounded-none shadow-xl max-h-[94vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-white border-b px-5 py-4 flex justify-between items-center">
          <h2
            id="user-modal-title"
            className="font-bold text-lg text-[#201E64]"
          >
            User Details
          </h2>

          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close details"
            className="p-2 rounded-none hover:bg-gray-100"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-none bg-[#201E64]/10 flex items-center justify-center shrink-0">
              <UserRound size={27} color={NAVY} />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-lg text-gray-900">
                {fullName(user)}
              </h3>

              <p className="text-sm text-gray-500 break-all">
                {user.email}
              </p>

              <div className="mt-2">
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-5">
            {details.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-1">
                  {label}
                </p>
                <p className="text-sm font-semibold text-gray-800 break-words">
                  {value ?? "Not provided"}
                </p>
              </div>
            ))}
          </div>

          {isSelf && (
            <div className="bg-amber-50 border border-amber-200 rounded-none p-3 text-sm text-amber-800">
              You are viewing your own account. Role and
              status changes are disabled.
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="bg-red-50 text-red-700 border border-red-200 rounded-none p-3 text-sm"
            >
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 rounded-none p-3 text-sm">
              {success}
            </div>
          )}

          {/* ROLE MANAGEMENT */}
          <div className="border rounded-none p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} color={NAVY} />
              <h3 className="font-bold text-[#201E64]">
                Role Management
              </h3>
            </div>

            <p className="text-xs text-gray-500">
              Changing a role updates the user's platform
              permissions.
            </p>

            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              disabled={saving || isSelf}
              aria-label="Select user role"
              className="w-full h-11 px-3 border border-gray-300 rounded-none text-sm bg-white disabled:bg-gray-100"
            >
              {ROLES.filter((r) => r.value).map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => handleSave("role")}
              disabled={!roleChanged || saving || isSelf}
              className="inline-flex items-center justify-center gap-2 bg-[#201E64] text-white px-5 py-2.5 rounded-none text-sm font-semibold disabled:opacity-40"
            >
              <Save size={17} />
              Save Role
            </button>
          </div>

          {/* STATUS MANAGEMENT */}
          <div className="border rounded-none p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} color={NAVY} />
              <h3 className="font-bold text-[#201E64]">
                Account Status
              </h3>
            </div>

            <p className="text-xs text-gray-500">
              Inactive users should not be allowed to
              access protected platform resources.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("ACTIVE")}
                disabled={saving || isSelf}
                className={`flex items-center justify-center gap-2 border rounded-none p-3 text-sm font-semibold disabled:opacity-50 ${
                  status === "ACTIVE"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <CheckCircle2 size={17} />
                Active
              </button>

              <button
                type="button"
                onClick={() => setStatus("INACTIVE")}
                disabled={saving || isSelf}
                className={`flex items-center justify-center gap-2 border rounded-none p-3 text-sm font-semibold disabled:opacity-50 ${
                  status === "INACTIVE"
                    ? "border-red-600 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <Ban size={17} />
                Inactive
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSave("status")}
              disabled={!statusChanged || saving || isSelf}
              className="inline-flex items-center justify-center gap-2 bg-[#201E64] text-white px-5 py-2.5 rounded-none text-sm font-semibold disabled:opacity-40"
            >
              <Save size={17} />
              Save Status
            </button>
          </div>
        </div>

        <div className="border-t px-5 py-4 flex justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 border rounded-none text-sm font-semibold"
          >
            Close
          </button>
        </div>

        {/* CONFIRMATION DIALOG */}
        {confirmation && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-label="Confirm account change"
              className="bg-white w-full max-w-sm rounded-none p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-[#201E64]">
                Confirm Change
              </h3>

              <p className="text-sm text-gray-600 mt-3">
                {confirmation.message}
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setConfirmation(null)}
                  className="px-4 py-2 border rounded-none text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmSave}
                  className="px-4 py-2 bg-[#201E64] text-white rounded-none text-sm font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// USER MANAGEMENT SCREEN
// ======================================================

export default function UserManagement() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    total_pages: 0,
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchUsers = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/super-admin/users",
        {
          params: {
            page,
            limit: PAGE_SIZE,
            ...(search && { search }),
            ...(role && { role_id: role }),
            ...(status && { status }),
          },
          signal,
        }
      );

      if (!response.data?.success) {
        throw new Error("Unable to fetch users");
      }

      if (signal?.aborted) return;

      setUsers(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );

      setPagination(
        response.data.pagination || {
          total: 0,
          page,
          total_pages: 0,
        }
      );
    } catch (err) {
      if (
        signal?.aborted ||
        err.code === "ERR_CANCELED"
      ) {
        return;
      }

      console.error(err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load users"
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [page, search, role, status]);

  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal);

    return () => controller.abort();
  }, [fetchUsers, reloadKey]);

  const refresh = () => {
    setReloadKey((key) => key + 1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
    refresh();
  };

  const totalPages = Math.max(
    1,
    Number(pagination.total_pages) || 1
  );

  const currentPage = Number(pagination.page) || page;

  const start = pagination.total
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;

  const end = Math.min(
    currentPage * PAGE_SIZE,
    Number(pagination.total) || 0
  );

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#201E64]">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage users, roles and account access.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#201E64] text-white px-5 py-3 rounded-none text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* TOTAL USERS */}
      <div className="bg-white border rounded-none p-5 flex items-center gap-4">
        <div className="p-3 bg-[#201E64]/10 rounded-none">
          <Users size={25} color={NAVY} />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Matching Users
          </p>
          <p className="text-2xl font-bold text-[#201E64]">
            {Number(pagination.total).toLocaleString()}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-none p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_180px_180px_auto] gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or email..."
              maxLength={150}
              className="w-full h-11 pl-10 pr-3 border rounded-none text-sm outline-none focus:border-[#201E64]"
            />
          </div>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            aria-label="Filter users by role"
            className="h-11 px-3 border rounded-none text-sm bg-white"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Filter users by status"
            className="h-11 px-3 border rounded-none text-sm bg-white"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="h-11 px-4 border rounded-none text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FilterX size={17} />
            Clear
          </button>
        </div>
      </div>

      {/* USERS */}
      <div className="bg-white border rounded-none overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-bold text-[#201E64]">
            Registered Users
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw
              size={30}
              className="animate-spin mx-auto text-[#201E64]"
            />
            <p className="text-sm text-gray-500 mt-3">
              Loading users...
            </p>
          </div>
        ) : error ? (
          <div className="py-14 text-center px-5">
            <AlertCircle
              size={32}
              className="mx-auto text-red-500"
            />
            <p className="text-red-600 text-sm mt-3">
              {error}
            </p>
            <button
              onClick={refresh}
              className="mt-4 bg-[#201E64] text-white px-5 py-2 rounded-none"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600">
                    <th className="text-left px-5 py-4">
                      User
                    </th>
                    <th className="text-left px-5 py-4">
                      Role
                    </th>
                    <th className="text-left px-5 py-4">
                      Status
                    </th>
                    <th className="text-left px-5 py-4">
                      Registered
                    </th>
                    <th className="text-right px-5 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr
                      key={user.user_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {fullName(user)}
                        </p>
                        <p className="text-xs text-gray-500 break-all">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="bg-[#201E64]/10 text-[#201E64] rounded-none px-3 py-1 text-xs font-semibold">
                          {roleLabel(user.role_id)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={user.status} />
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatDate(user.created_at)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-2 text-[#201E64] font-semibold hover:underline"
                        >
                          <Eye size={17} />
                          View / Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="md:hidden divide-y">
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className="p-4 space-y-3 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-none bg-[#201E64]/10 flex items-center justify-center shrink-0">
                      <UserRound size={20} color={NAVY} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800">
                        {fullName(user)}
                      </p>
                      <p className="text-xs text-gray-500 break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#201E64]/10 text-[#201E64] rounded-none px-3 py-1 text-xs font-semibold">
                      {roleLabel(user.role_id)}
                    </span>
                    <StatusBadge status={user.status} />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500">
                      {formatDate(user.created_at)}
                    </span>

                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center gap-2 text-sm font-semibold text-[#201E64]"
                    >
                      <Eye size={17} />
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGINATION */}
        {!loading && !error && pagination.total > 0 && (
          <div className="border-t px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {start}–{end} of {pagination.total}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="p-2 border rounded-none disabled:opacity-40"
              >
                <ChevronLeft size={19} />
              </button>

              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="p-2 border rounded-none disabled:opacity-40"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailsModal
          key={selectedUser.user_id}
          user={selectedUser}
          currentUserId={currentUser?.user_id}
          onClose={() => setSelectedUser(null)}
          onUpdated={async () => {
            refresh();
          }}
        />
      )}
    </div>
  );
}
