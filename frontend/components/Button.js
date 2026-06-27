import Link from "next/link";

const VARIANTS = {
  primary: "bg-terracotta text-cream hover:bg-terracottaDark",
  secondary:
    "border border-tan text-cream hover:bg-tan hover:text-coffeeDark",
  outlineLight: "border border-cream/50 text-cream hover:bg-cream/10",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-lg px-6 py-3 transition active:scale-95 ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
