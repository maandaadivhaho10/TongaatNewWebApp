
import React, { useCallback, useEffect, useState } from "react";
import {
  Users,
  Building2,
  ShieldCheck,
  UserCog,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  Handshake,
  RefreshCw,
  AlertCircle,
  Clock3,
  UserRound,
} from "lucide-react";

import api from "../../API/axiosInstance";

const NAVY = "#201E64";

// ======================================================
// INITIAL DASHBOARD STATISTICS
// ======================================================

const INITIAL_STATS = {
  users: {
    total_users: 0,
    total_smmes: 0,
    total_ed_team: 0,
    total_admins: 0,
    total_super_admins: 0,
    active_users: 0,
    inactive_users: 0,
  },

  businesses: {
    registered_businesses: 0,
    completed_maturity: 0,
  },

  opportunities: {
    total_tenders: 0,
    total_rfqs: 0,
    open_tenders: 0,
    open_rfqs: 0,
  },

  advisory: {
    total_advisory_requests: 0,
    pending_advisory_requests: 0,
  },

  recent_users: [],
};

// ======================================================
// HELPERS
// ======================================================

const number = (value) => Number(value) || 0;

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRoleLabel(role) {
  const roles = {
    SMME: "SMME",
    ED_TEAM: "ED Team",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
  };

  return roles[role] || role || "Unknown";
}

// ======================================================
// SQUARE STATISTICS CARD
// ======================================================

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}) {
  return (
    <div
      className="
        bg-white
        border border-gray-200
        p-5 sm:p-6
        min-h-[155px]
        flex flex-col justify-between
        transition-all duration-200
        hover:shadow-md
        hover:border-[#201E64]/30
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-[#201E64] mt-3">
            {number(value).toLocaleString("en-ZA")}
          </h3>
        </div>

        <div className="p-3 bg-[#201E64]/10 shrink-0">
          <Icon size={22} color={NAVY} />
        </div>
      </div>

      {description && (
        <p className="text-xs text-gray-500 mt-4">
          {description}
        </p>
      )}
    </div>
  );
}

// ======================================================
// SECTION HEADER
// ======================================================

function SectionHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg sm:text-xl font-bold text-[#201E64]">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

// ======================================================
// USER DISTRIBUTION
// ======================================================

function UserDistribution({ users }) {
  const items = [
    {
      label: "SMMEs",
      value: number(users.total_smmes),
      color: "#201E64",
    },
    {
      label: "ED Team",
      value: number(users.total_ed_team),
      color: "#5755B5",
    },
    {
      label: "Admins",
      value: number(users.total_admins),
      color: "#9290D2",
    },
    {
      label: "Super Admins",
      value: number(users.total_super_admins),
      color: "#C6C5E8",
    },
  ];

  const total = items.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-white border border-gray-200 p-5 sm:p-6 h-full">
      <SectionHeader
        title="User Distribution"
        description="Registered users by system role"
      />

      <div className="space-y-5">
        {items.map((item) => {
          const percentage = total
            ? (item.value / total) * 100
            : 0;

          return (
            <div key={item.label}>
              <div className="flex justify-between items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>

                <span className="text-sm font-semibold text-gray-800">
                  {item.value} ({percentage.toFixed(1)}%)
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======================================================
// OPPORTUNITIES OVERVIEW
// ======================================================

function OpportunityOverview({ opportunities }) {
  const items = [
    {
      title: "Tenders",
      total: number(opportunities.total_tenders),
      open: number(opportunities.open_tenders),
      icon: BriefcaseBusiness,
    },
    {
      title: "RFQs",
      total: number(opportunities.total_rfqs),
      open: number(opportunities.open_rfqs),
      icon: FileText,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 p-5 sm:p-6 h-full">
      <SectionHeader
        title="Opportunities Overview"
        description="Published tenders and RFQs"
      />

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#201E64]/10">
                    <Icon size={20} color={NAVY} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      Total published
                    </p>
                  </div>
                </div>

                <span className="text-2xl font-bold text-[#201E64]">
                  {item.total.toLocaleString("en-ZA")}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Open opportunities
                </span>

                <span className="text-sm font-semibold text-green-700">
                  {item.open.toLocaleString("en-ZA")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======================================================
// RECENT USER REGISTRATIONS
// ======================================================

function RecentUsers({ users }) {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-[#201E64]">
          Recent Registrations
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          The five most recently registered users
        </p>
      </div>

      {users.length === 0 ? (
        <div className="py-14 px-4 text-center text-gray-500">
          <Users size={32} className="mx-auto mb-3" />

          <p>No registered users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">
                  User
                </th>

                <th className="text-left px-6 py-4 font-semibold">
                  Role
                </th>

                <th className="text-left px-6 py-4 font-semibold">
                  Status
                </th>

                <th className="text-left px-6 py-4 font-semibold">
                  Registered
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const isActive =
                  String(user.status).toUpperCase() === "ACTIVE";

                return (
                  <tr
                    key={user.user_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#201E64]/10 flex items-center justify-center shrink-0">
                          <UserRound size={18} color={NAVY} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800">
                            {user.first_name} {user.last_name}
                          </p>

                          <p className="text-xs text-gray-500 break-all">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block bg-[#201E64]/10 text-[#201E64] px-3 py-1 text-xs font-semibold">
                        {getRoleLabel(user.role_name)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status || "Unknown"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ======================================================
// SUPER ADMIN DASHBOARD
// ======================================================

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ====================================================
  // FETCH DASHBOARD STATISTICS
  // ====================================================

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/super-admin/dashboard/stats"
      );

      const result = response.data;

      if (!result?.success || !result?.data) {
        throw new Error("Invalid dashboard response");
      }

      const data = result.data;

      setStats({
        users: {
          ...INITIAL_STATS.users,
          ...data.users,
        },

        businesses: {
          ...INITIAL_STATS.businesses,
          ...data.businesses,
        },

        opportunities: {
          ...INITIAL_STATS.opportunities,
          ...data.opportunities,
        },

        advisory: {
          ...INITIAL_STATS.advisory,
          ...data.advisory,
        },

        recent_users: Array.isArray(data.recent_users)
          ? data.recent_users
          : [],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw
          size={34}
          className="animate-spin text-[#201E64]"
        />

        <p className="mt-4 text-sm text-gray-500">
          Loading dashboard statistics...
        </p>
      </div>
    );
  }

  // ====================================================
  // ERROR SCREEN
  // ====================================================

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertCircle
            size={36}
            className="text-red-500 mx-auto"
          />

          <h2 className="text-lg font-bold text-gray-900 mt-4">
            Unable to load dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => fetchDashboard()}
            className="mt-5 bg-[#201E64] text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    users,
    businesses,
    opportunities,
    advisory,
  } = stats;

  return (
    <div className="w-full min-w-0 space-y-8 pb-8">
      {/* =============================================== */}
      {/* DASHBOARD HEADING */}
      {/* =============================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#201E64]">
            Super Admin Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Overview of users, businesses and platform activities.
          </p>
        </div>

        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="
            inline-flex items-center justify-center gap-2
            px-5 py-3
            bg-[#201E64] text-white
            text-sm font-semibold
            hover:opacity-90
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-opacity
            w-full sm:w-auto
          "
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =============================================== */}
      {/* USER STATISTICS */}
      {/* =============================================== */}

      <section>
        <SectionHeader
          title="User Statistics"
          description="Overview of registered platform accounts"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={users.total_users}
            icon={Users}
          />

          <StatCard
            title="SMMEs"
            value={users.total_smmes}
            icon={Building2}
          />

          <StatCard
            title="ED Team"
            value={users.total_ed_team}
            icon={UserCog}
          />

          <StatCard
            title="Admins"
            value={users.total_admins}
            icon={ShieldCheck}
          />

          <StatCard
            title="Super Admins"
            value={users.total_super_admins}
            icon={ShieldCheck}
          />

          <StatCard
            title="Active Users"
            value={users.active_users}
            icon={UserCheck}
          />

          <StatCard
            title="Inactive Users"
            value={users.inactive_users}
            icon={UserX}
          />
        </div>
      </section>

      {/* =============================================== */}
      {/* PLATFORM OVERVIEW */}
      {/* =============================================== */}

      <section>
        <SectionHeader
          title="Platform Overview"
          description="Business registration and opportunity statistics"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Registered Businesses"
            value={businesses.registered_businesses}
            icon={Building2}
          />

          <StatCard
            title="Completed Maturity"
            value={businesses.completed_maturity}
            icon={ClipboardCheck}
          />

          <StatCard
            title="Total Tenders"
            value={opportunities.total_tenders}
            icon={BriefcaseBusiness}
          />

          <StatCard
            title="Total RFQs"
            value={opportunities.total_rfqs}
            icon={FileText}
          />

          <StatCard
            title="Advisory Requests"
            value={advisory.total_advisory_requests}
            icon={Handshake}
          />

          <StatCard
            title="Pending Advisory"
            value={advisory.pending_advisory_requests}
            icon={Clock3}
          />
        </div>
      </section>

      {/* =============================================== */}
      {/* ANALYTICS */}
      {/* =============================================== */}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <UserDistribution users={users} />

        <OpportunityOverview opportunities={opportunities} />
      </section>

      {/* =============================================== */}
      {/* RECENT REGISTRATIONS */}
      {/* =============================================== */}

      <section>
        <RecentUsers users={stats.recent_users} />
      </section>
    </div>
  );
}
