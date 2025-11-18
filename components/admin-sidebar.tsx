"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const pathname = usePathname()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      active: pathname === "/admin",
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      active: pathname === "/admin/projects",
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      active: pathname === "/admin/messages",
    },
    {
      name: "Homepage",
      href: "/admin/homepage",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      active: pathname === "/admin/homepage",
    },
    {
      name: "Profile",
      href: "/admin/profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      active: pathname === "/admin/profile",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      active: pathname === "/admin/settings",
      disabled: true,
      badge: "Soon",
    },
  ]

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-50 transition-all duration-300 ${
          isOpen ? "left-[240px]" : "left-4"
        } w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:scale-110 flex items-center justify-center`}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 h-screen bg-white border-r-2 border-slate-200 flex flex-col fixed top-0 z-40 transition-all duration-300 ${
          isOpen ? "left-0" : "-left-64"
        }`}
      >
      {/* Logo/Brand */}
      <div className="p-6 border-b-2 border-slate-200">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">AK</span>
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Admin</h2>
            <p className="text-xs text-slate-500">Portfolio Manager</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.name}>
            {item.disabled ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 cursor-not-allowed opacity-60">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
            ) : (
              <Link href={item.href}>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    item.active
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.active && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t-2 border-slate-200 space-y-4">
        <Link href="/">
          <Button
            variant="outline"
            className="w-full justify-start border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </Button>
        </Link>
        <Button
          onClick={logout}
          className="w-full justify-start bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </Button>
      </div>
    </div>
    </>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-0"}`}>
        {children}
      </div>
    </div>
  )
}
