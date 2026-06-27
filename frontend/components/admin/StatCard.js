export default function StatCard({ icon, label, value, trend, trendUp, color = "terracotta" }) {
  const colorMap = {
    terracotta: {
      bg: "from-terracotta/15 to-terracotta/5",
      icon: "bg-terracotta/20 text-terracotta",
      border: "border-terracotta/20",
    },
    green: {
      bg: "from-emerald-500/15 to-emerald-500/5",
      icon: "bg-emerald-500/20 text-emerald-400",
      border: "border-emerald-500/20",
    },
    amber: {
      bg: "from-amber-500/15 to-amber-500/5",
      icon: "bg-amber-500/20 text-amber-400",
      border: "border-amber-500/20",
    },
    blue: {
      bg: "from-sky-500/15 to-sky-500/5",
      icon: "bg-sky-500/20 text-sky-400",
      border: "border-sky-500/20",
    },
  };

  const c = colorMap[color] || colorMap.terracotta;

  return (
    <div
      className={`
        bg-gradient-to-br ${c.bg}
        border ${c.border}
        rounded-2xl p-5
        hover:scale-[1.02] transition-transform duration-200
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-cream mb-0.5">{value}</p>
      <p className="text-xs text-[#a89278] font-medium">{label}</p>
    </div>
  );
}
