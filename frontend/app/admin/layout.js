"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !token) {
        router.push("/login");
      } else if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push("/");
      }
    }
  }, [user, token, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14100b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-terracottaDark flex items-center justify-center animate-pulse">
            <span className="font-serif italic text-cream font-bold text-sm">Y</span>
          </div>
          <p className="text-[#a89278] text-sm animate-pulse">Loading admin…</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#14100b]">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div
        className={`
          transition-all duration-300 ease-in-out min-h-screen
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64"}
        `}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#14100b]/80 backdrop-blur-xl border-b border-[#3d2a1a]/40 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#a89278] hover:text-cream hover:bg-[#2a1d12] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-sm font-medium text-[#a89278] hidden sm:block">
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-terracottaDark flex items-center justify-center text-cream text-xs font-bold shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-cream leading-none">{user?.name || "Admin"}</p>
                <p className="text-[11px] text-[#a89278]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-xs font-medium text-[#a89278] hover:text-red-400 transition-colors px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
