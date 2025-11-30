"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Users,
  Home,
  BarChart3,
  Settings,
  ArrowLeft,
  Wrench,
  Star,
  UserCheck,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Agents', href: '/admin/agents', icon: UserCheck },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Utilities', href: '/admin/utilities', icon: Wrench },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Back to Site */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Site</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {navigation.find((item) => item.href === pathname)?.name || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
