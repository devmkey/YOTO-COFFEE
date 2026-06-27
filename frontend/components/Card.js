export default function Card({ icon, title, children, className = "" }) {
  return (
    <div
      className={`bg-coffee border border-coffeeMid rounded-xl p-5 flex gap-4 items-start shadow-sm ${className}`}
    >
      {icon && <div className="text-terracotta shrink-0 mt-0.5">{icon}</div>}
      <div>
        {title && <h4 className="font-serif text-base mb-1">{title}</h4>}
        <div className="text-sm text-textMuted">{children}</div>
      </div>
    </div>
  );
}
