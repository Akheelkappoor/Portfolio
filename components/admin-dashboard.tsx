"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-sidebar"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminDashboard() {
  const { data: projects } = useSWR("/api/admin/projects-aws", fetcher)
  const { data: messages } = useSWR("/api/admin/messages", fetcher)

  const totalProjects = Array.isArray(projects) ? projects.length : 0
  const totalMessages = Array.isArray(messages) ? messages.length : 0
  const unreadMessages = Array.isArray(messages) ? messages.filter((m: any) => !m.is_read).length : 0
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <AdminLayout>
      <main className="min-h-screen">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-600 mt-1">{currentDate}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="p-8">
        {/* Welcome Message */}
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Welcome back, Akheel! 👋</h2>
          <p className="text-lg text-slate-600">Here's what's happening with your portfolio today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Total Projects */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Total Projects</p>
              <p className="text-4xl font-extrabold text-slate-900">{totalProjects}</p>
            </div>
          </div>

          {/* Messages */}
          <Link href="/admin/messages">
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-[1.02] cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                {unreadMessages > 0 && (
                  <span className="px-2 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">{unreadMessages} new</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Contact Messages</p>
                <p className="text-4xl font-extrabold text-slate-900">{totalMessages}</p>
                {unreadMessages > 0 && (
                  <p className="text-xs text-purple-600 font-semibold mt-1">{unreadMessages} unread</p>
                )}
              </div>
            </div>
          </Link>

          {/* Status */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Site Status</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Last Updated</p>
              <p className="text-lg font-bold text-slate-900">Today</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Quick Actions</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/projects">
              <div className="group p-6 rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Add Project</h4>
                <p className="text-sm text-slate-600">Create a new portfolio project</p>
              </div>
            </Link>

            <Link href="/admin/projects">
              <div className="group p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Manage Projects</h4>
                <p className="text-sm text-slate-600">View and edit all projects</p>
              </div>
            </Link>

            <Link href="/admin/messages">
              <div className="group p-6 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900">View Messages</h4>
                  {unreadMessages > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold">{unreadMessages}</span>
                  )}
                </div>
                <p className="text-sm text-slate-600">Read and respond to contacts</p>
              </div>
            </Link>

            <Link href="/">
              <div className="group p-6 rounded-xl border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Preview Site</h4>
                <p className="text-sm text-slate-600">View your live portfolio</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        {totalProjects > 0 && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Recent Projects</h3>
              </div>
              <Link href="/admin/projects">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold">
                  View All →
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {projects?.slice(0, 3).map((project: any) => (
                <div key={project.id} className="p-4 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all group">
                  {project.imageUrl && (
                    <div className="relative h-32 bg-slate-200 rounded-lg overflow-hidden mb-3">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{project.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-1">{project.meta}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
    </AdminLayout>
  )
}
