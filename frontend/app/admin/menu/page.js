"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/AuthContext";
import { fetchProducts, updateProduct } from "../../../lib/api";

const CATEGORIES = ["hot", "cold", "pastries"];

export default function MenuPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [saving, setSaving] = useState(null);

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

  async function toggleAvailability(product) {
    const id = product._id || product.id;
    setSaving(id);
    try {
      await updateProduct(id, { available: !product.available }, token);
      setProducts((prev) =>
        prev.map((p) =>
          (p._id || p.id) === id ? { ...p, available: !p.available } : p
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function moveItem(product, direction) {
    const id = product._id || product.id;
    const catItems = products.filter((p) => p.category === product.category);
    const idx = catItems.findIndex((p) => (p._id || p.id) === id);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= catItems.length) return;

    setSaving(id);
    try {
      const newOrder = product.order !== undefined ? product.order + direction : idx + direction;
      await updateProduct(id, { order: newOrder }, token);
      await loadProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(null);
    }
  }

  const filtered =
    activeCat === "all"
      ? products
      : products.filter((p) => p.category === activeCat);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filtered.filter((p) => p.category === cat);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-cream mb-1">Menu Management</h1>
        <p className="text-sm text-[#a89278]">Organize categories, toggle availability, and reorder items</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              activeCat === cat
                ? "bg-terracotta/15 border-terracotta/40 text-terracotta"
                : "bg-[#1a130d] border-[#3d2a1a]/60 text-[#a89278] hover:border-[#a89278]/40"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="admin-card p-5 animate-pulse">
              <div className="h-5 bg-[#3d2a1a]/50 rounded w-24 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#3d2a1a]/50" />
                    <div className="flex-1 h-4 bg-[#3d2a1a]/50 rounded" />
                    <div className="w-16 h-8 bg-[#3d2a1a]/50 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center py-16 text-center">
          <svg className="w-12 h-12 text-[#3d2a1a] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-[#a89278] text-sm">No menu items found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(activeCat === "all" ? CATEGORIES : [activeCat]).map((cat) => {
            const items = grouped[cat] || [];
            if (items.length === 0) return null;

            return (
              <div key={cat} className="admin-card overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#3d2a1a]/60 flex items-center justify-between">
                  <h3 className="font-serif text-cream text-base">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </h3>
                  <span className="text-xs text-[#a89278] font-medium">{items.length} items</span>
                </div>
                <div className="divide-y divide-[#3d2a1a]/30">
                  {items.map((product, idx) => {
                    const id = product._id || product.id;
                    const isAvailable = product.available !== false;
                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#2a1d12]/40 ${
                          !isAvailable ? "opacity-50" : ""
                        }`}
                      >
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveItem(product, -1)}
                            disabled={idx === 0 || saving === id}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#a89278] hover:text-cream hover:bg-[#3d2a1a]/50 transition-colors disabled:opacity-30"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveItem(product, 1)}
                            disabled={idx === items.length - 1 || saving === id}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#a89278] hover:text-cream hover:bg-[#3d2a1a]/50 transition-colors disabled:opacity-30"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {/* Item icon */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tan/20 to-coffeeMid/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-tan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm0-3h10v3H3V5z" />
                          </svg>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-cream truncate">{product.name}</p>
                          <p className="text-xs text-[#a89278] truncate">{product.desc || product.description || "—"}</p>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-semibold text-cream hidden sm:block">
                          ${(product.price || 0).toFixed(2)}
                        </span>

                        {/* Availability Toggle */}
                        <button
                          onClick={() => toggleAvailability(product)}
                          disabled={saving === id}
                          className={`relative inline-flex h-7 w-12 rounded-full transition-colors duration-200 ${
                            isAvailable ? "bg-emerald-500/30" : "bg-[#3d2a1a]/60"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-1 ${
                              isAvailable ? "translate-x-6 ml-0" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
