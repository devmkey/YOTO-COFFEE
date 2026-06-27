"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/AuthContext";
import { fetchOrders, updateOrder } from "../../../lib/api";
import AdminTable from "../../../components/admin/AdminTable";
import AdminModal from "../../../components/admin/AdminModal";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

const statusStyles = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  confirmed: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailOrder, setDetailOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadOrders() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchOrders(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  async function handleStatusChange(order, newStatus) {
    const id = order._id || order.id;
    setUpdatingId(id);
    try {
      await updateOrder(id, { status: newStatus }, token);
      setOrders((prev) =>
        prev.map((o) =>
          (o._id || o.id) === id ? { ...o, status: newStatus } : o
        )
      );
      if (detailOrder && (detailOrder._id || detailOrder.id) === id) {
        setDetailOrder({ ...detailOrder, status: newStatus });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const columns = [
    {
      key: "id",
      label: "Order #",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-cream">
          #{(row._id || row.id || "").toString().slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-cream">{row.customerName || row.user?.name || "Guest"}</p>
          <p className="text-xs text-[#a89278]">{row.customerEmail || row.user?.email || ""}</p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row) => {
        const items = row.items || [];
        return (
          <span className="text-sm text-cream/80">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        );
      },
    },
    {
      key: "total",
      label: "Total",
      render: (row) => (
        <span className="font-semibold text-cream">${(row.total || 0).toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
            statusStyles[row.status] || statusStyles.pending
          }`}
        >
          {row.status || "pending"}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) => (
        <span className="text-sm text-[#a89278]">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-cream mb-1">Orders</h1>
          <p className="text-sm text-[#a89278]">
            {orders.length} total order{orders.length !== 1 ? "s" : ""} ·{" "}
            {orders.filter((o) => o.status === "pending").length} pending
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...STATUS_OPTIONS].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              filterStatus === status
                ? "bg-terracotta/15 border-terracotta/40 text-terracotta"
                : "bg-[#1a130d] border-[#3d2a1a]/60 text-[#a89278] hover:border-[#a89278]/40"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No orders yet"
        onRowClick={(row) => setDetailOrder(row)}
        actions={(row) => (
          <select
            value={row.status || "pending"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            disabled={updatingId === (row._id || row.id)}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a130d] border border-[#3d2a1a]/60 text-cream text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-terracotta/50 cursor-pointer disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        )}
      />

      {/* Order detail modal */}
      <AdminModal
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        title={`Order #${(detailOrder?._id || detailOrder?.id || "").toString().slice(-6).toUpperCase()}`}
        size="md"
      >
        {detailOrder && (
          <div className="space-y-5">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border ${
                  statusStyles[detailOrder.status] || statusStyles.pending
                }`}
              >
                {detailOrder.status || "pending"}
              </span>
              <span className="text-xs text-[#a89278]">
                {detailOrder.createdAt
                  ? new Date(detailOrder.createdAt).toLocaleString()
                  : "—"}
              </span>
            </div>

            {/* Customer */}
            <div className="admin-card-inner p-4">
              <p className="text-xs text-[#a89278] uppercase tracking-wide mb-1.5">Customer</p>
              <p className="text-sm font-medium text-cream">
                {detailOrder.customerName || detailOrder.user?.name || "Guest"}
              </p>
              <p className="text-xs text-[#a89278]">
                {detailOrder.customerEmail || detailOrder.user?.email || "—"}
              </p>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs text-[#a89278] uppercase tracking-wide mb-2">Items</p>
              <div className="space-y-2">
                {(detailOrder.items || []).length > 0 ? (
                  detailOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="admin-card-inner flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-cream">{item.name || item.product?.name || "Item"}</p>
                        <p className="text-xs text-[#a89278]">Qty: {item.quantity || 1}</p>
                      </div>
                      <span className="text-sm font-semibold text-cream">
                        ${(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#a89278]">No items listed</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-[#3d2a1a]/60">
              <span className="text-sm font-semibold text-cream">Total</span>
              <span className="text-lg font-bold text-cream">
                ${(detailOrder.total || 0).toFixed(2)}
              </span>
            </div>

            {/* Update status */}
            <div className="flex gap-2 flex-wrap pt-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(detailOrder, s)}
                  disabled={detailOrder.status === s || updatingId === (detailOrder._id || detailOrder.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                    detailOrder.status === s
                      ? "bg-terracotta/15 border-terracotta/40 text-terracotta"
                      : "bg-[#1a130d] border-[#3d2a1a]/60 text-[#a89278] hover:border-[#a89278]/40 disabled:opacity-30"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
