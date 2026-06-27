"use client";

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import { fetchProducts } from "../../lib/api";

const CATEGORIES = ["all", "hot", "cold", "pastries"];

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const list = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs uppercase tracking-[2px] text-terracotta font-semibold block mb-2">
          Our menu
        </span>
        <h2 className="text-2xl md:text-3xl mb-7">Brewed for every mood</h2>

        <div className="flex gap-2.5 flex-wrap mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                active === c
                  ? "bg-coffeeDark text-cream border-coffeeDark"
                  : "bg-coffee text-tan border-coffeeMid"
              }`}
            >
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-coffee border border-coffeeMid rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-coffeeMid" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-coffeeMid rounded w-3/4" />
                  <div className="h-3 bg-coffeeMid rounded w-full" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-coffeeMid rounded w-12" />
                    <div className="h-4 bg-coffeeMid rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {list.length === 0 ? (
              <p className="col-span-full text-textMuted text-center py-12">No products found</p>
            ) : (
              list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
