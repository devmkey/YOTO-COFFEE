"use client";

export default function AdminTable({
  columns,
  data,
  loading,
  emptyMessage = "No data found",
  onRowClick,
  actions,
}) {
  if (loading) {
    return (
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3d2a1a]/60">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="text-left text-xs font-semibold uppercase tracking-wider text-[#a89278] px-5 py-3.5"
                  >
                    {col.label}
                  </th>
                ))}
                {actions && (
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#a89278] px-5 py-3.5">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#3d2a1a]/30">
                  {columns.map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-[#3d2a1a]/50 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-4">
                      <div className="h-4 bg-[#3d2a1a]/50 rounded animate-pulse w-20 ml-auto" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="admin-card flex flex-col items-center justify-center py-16 text-center">
        <svg className="w-12 h-12 text-[#3d2a1a] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-[#a89278] text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#3d2a1a]/60">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="text-left text-xs font-semibold uppercase tracking-wider text-[#a89278] px-3 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#a89278] px-3 sm:px-5 py-3 sm:py-3.5 whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || row._id || i}
                className={`
                  border-b border-[#3d2a1a]/30 last:border-0
                  transition-colors duration-150
                  hover:bg-[#2a1d12]/60
                  ${onRowClick ? "cursor-pointer" : ""}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, j) => (
                  <td key={j} className="px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-cream/90 whitespace-nowrap sm:whitespace-normal">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-3 sm:px-5 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
