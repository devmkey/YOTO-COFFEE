"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/AuthContext";
import { fetchProducts, fetchOrders, fetchReservations, fetchUsers } from "../../lib/api";
import StatCard from "../../components/admin/StatCard";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    products: null,
    orders: null,
    reservations: null,
    users: null,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function loadStats() {
      setLoading(true);
      const results = { products: 0, orders: 0, reservations: 0, users: 0 };
      let orders = [];

      try {
        const prods = await fetchProducts();
        results.products = Array.isArray(prods) ? prods.length : 0;
      } catch {}

      try {
        const ords = await fetchOrders(token);
        const ordList = Array.isArray(ords) ? ords : [];
        results.orders = ordList.filter((o) => o.status === "pending").length;
        orders = ordList.slice(0, 5);
      } catch {}

      try {
        const res = await fetchReservations(token);
        results.reservations = Array.isArray(res) ? res.length : 0;
      } catch {}

      try {
        const usrs = await fetchUsers(token);
        results.users = Array.isArray(usrs) ? usrs.length : 0;
      } catch {}

      setStats(results);
      setRecentOrders(orders);
      setLoading(false);
    }

    loadStats();
  }, [token]);

  const quickLinks = [
    { href: "/admin/coffee", label: "Manage Coffee", color: "from-terracotta to-terracottaDark" },
    { href: "/admin/menu", label: "Edit Menu", color: "from-amber-600 to-amber-800" },
    { href: "/admin/orders", label: "View Orders", color: "from-emerald-600 to-emerald-800" },
    { href: "/admin/reservations", label: "Reservations", color: "from-sky-600 to-sky-800" },
    { href: "/admin/users", label: "Manage Users", color: "from-purple-600 to-purple-800" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-cream mb-1">Dashboard</h1>
        <p className="text-sm text-[#a89278]">Welcome back. Here&apos;s what&apos;s happening at Yoto today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          color="terracotta"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm0-3h10v3H3V5z" />
            </svg>
          }
          label="Total Products"
          value={loading ? "—" : stats.products}
        />
        <StatCard
          color="amber"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          label="Pending Orders"
          value={loading ? "—" : stats.orders}
        />
        <StatCard
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          label="Reservations"
          value={loading ? "—" : stats.reservations}
        />
        <StatCard
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          label="Total Users"
          value={loading ? "—" : stats.users}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-serif text-cream mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                bg-gradient-to-br ${link.color}
                rounded-xl px-4 py-4 text-center text-sm font-semibold text-cream
                hover:scale-[1.03] hover:shadow-lg transition-all duration-200
                active:scale-[0.98]
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif text-cream">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-medium text-terracotta hover:text-terracotta/80 transition-colors">
            View all →
          </Link>
        </div>
        <div className="admin-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-[#3d2a1a]/50" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#3d2a1a]/50 rounded w-1/3" />
                    <div className="h-3 bg-[#3d2a1a]/50 rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-[#3d2a1a]/50 rounded-full w-16" />
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-10 h-10 mx-auto text-[#3d2a1a] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-sm text-[#a89278]">No orders yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3d2a1a]/60">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#a89278] px-5 py-3">Order</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#a89278] px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#a89278] px-5 py-3">Total</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#a89278] px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id || order.id} className="border-b border-[#3d2a1a]/30 last:border-0 hover:bg-[#2a1d12]/40 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-cream font-medium">
                      #{(order._id || order.id || "").toString().slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-cream/80">
                      {order.customerName || order.user?.name || "Guest"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-cream font-medium">
                      ${(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
    confirmed: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  };

  return (
    <span className={`inline-flex text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${styles[status] || styles.pending}`}>
      {status || "pending"}
    </span>
  );
}
