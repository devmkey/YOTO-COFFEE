"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/AuthContext";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../lib/api";
import AdminTable from "../../../components/admin/AdminTable";
import AdminModal from "../../../components/admin/AdminModal";

const CATEGORIES = ["hot", "cold", "pastries"];

const emptyForm = { name: "", price: "", category: "hot", desc: "", image: "" };

export default function CoffeePage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      category: product.category || "hot",
      desc: product.desc || product.description || "",
      image: product.image || "",
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category,
      desc: form.desc.trim(),
      description: form.desc.trim(),
      image: form.image.trim(),
    };

    if (!payload.name || isNaN(payload.price)) {
      setError("Name and valid price are required");
      setSaving(false);
      return;
    }

    try {
      if (editing) {
        await updateProduct(editing._id || editing.id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    try {
      await deleteProduct(product._id || product.id, token);
      setDeleteConfirm(null);
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }

  const filtered = products.filter((p) => {
    const matchCat = filterCat === "all" || p.category === filterCat;
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.desc?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-tan/30 to-coffeeMid/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-tan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm0-3h10v3H3V5z" />
            </svg>
          </div>
          <span className="font-medium text-cream">{row.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border border-[#3d2a1a]/60 text-[#a89278]">
          {row.category}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <span className="font-semibold text-cream">${(row.price || 0).toFixed(2)}</span>
      ),
    },
    {
      key: "desc",
      label: "Description",
      render: (row) => (
        <span className="text-cream/60 text-sm truncate max-w-[200px] block">
          {row.desc || row.description || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-cream mb-1">Coffee Management</h1>
          <p className="text-sm text-[#a89278]">Add, edit, or remove products from your catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracottaDark text-cream font-semibold text-sm rounded-xl px-5 py-2.5 hover:shadow-lg hover:shadow-terracotta/25 transition-all duration-200 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Coffee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89278]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#1a130d] border border-[#3d2a1a]/60 rounded-xl text-cream placeholder-[#6b5a47] focus:outline-none focus:border-terracotta/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                filterCat === cat
                  ? "bg-terracotta/15 border-terracotta/40 text-terracotta"
                  : "bg-[#1a130d] border-[#3d2a1a]/60 text-[#a89278] hover:border-[#a89278]/40"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No products found. Add your first coffee!"
        actions={(row) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(row);
              }}
              className="p-2 rounded-lg text-[#a89278] hover:text-cream hover:bg-[#3d2a1a]/50 transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirm(row);
              }}
              className="p-2 rounded-lg text-[#a89278] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      />

      {/* Add/Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Product" : "Add New Coffee"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a89278] uppercase tracking-wide mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="admin-input"
              placeholder="e.g. Yoto Signature Latte"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a89278] uppercase tracking-wide mb-1.5">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="admin-input"
                placeholder="4.50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a89278] uppercase tracking-wide mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="admin-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a89278] uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              rows={3}
              className="admin-input resize-none"
              placeholder="Describe this item…"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a89278] uppercase tracking-wide mb-1.5">Image URL (optional)</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="admin-input"
              placeholder="https://…"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-[#a89278] hover:text-cream rounded-xl hover:bg-[#3d2a1a]/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-cream bg-gradient-to-r from-terracotta to-terracottaDark rounded-xl hover:shadow-lg hover:shadow-terracotta/25 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? "Saving…" : editing ? "Update" : "Add Coffee"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/15 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <p className="text-cream font-medium">Delete &quot;{deleteConfirm?.name}&quot;?</p>
            <p className="text-sm text-[#a89278] mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-5 py-2.5 text-sm font-medium text-[#a89278] hover:text-cream rounded-xl hover:bg-[#3d2a1a]/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="px-5 py-2.5 text-sm font-semibold text-cream bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
