import { CupIcon } from "./icons";

export default function ProductCard({ product }) {
  return (
    <div className="bg-coffee border border-coffeeMid rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition">
      <div className="h-36 bg-gradient-to-br from-tan to-coffeeMid flex items-center justify-center">
        <CupIcon className="w-11 h-11 text-cream" strokeWidth="1.3" />
      </div>
      <div className="p-4">
        <h4 className="font-serif text-base mb-1">{product.name}</h4>
        <p className="text-xs text-textMuted mb-3 min-h-[32px]">{product.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-cream">${product.price.toFixed(2)}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-terracottaDark bg-[#FBE7DA] px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}
