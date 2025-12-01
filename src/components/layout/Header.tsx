"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Home, PlusCircle, Heart, MessageSquare, LayoutDashboard, Briefcase, Shield, Menu, X, Building, Key, User, LogOut } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const t = useTranslations('nav')
  const { data: session, status } = useSession()
  const [userRole, setUserRole] = useState<{ isAgent: boolean; isAdmin: boolean }>({ isAgent: false, isAdmin: false })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthenticated = status === "authenticated"
  const user = session?.user

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/users/me/role')
        .then(res => res.json())
        .then(data => setUserRole({ isAgent: data.isAgent, isAdmin: data.isAdmin }))
        .catch(() => {})
    }
  }, [isAuthenticated])

  // Close mobile menu when route changes
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              EstateHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t('properties')}
            </Link>
            <Link
              href="/properties?type=sale"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t('forSale')}
            </Link>
            <Link
              href="/properties?type=rent"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t('forRent')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                {userRole.isAgent ? (
                  <Link href="/agent/dashboard">
                    <Button variant="ghost" size="sm">
                      <Briefcase className="h-5 w-5" />
                      <span className="ml-2 hidden lg:inline">{t('agentDashboard') || 'Agent Dashboard'}</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="ml-2 hidden lg:inline">{t('dashboard')}</span>
                    </Button>
                  </Link>
                )}
                {userRole.isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      <Shield className="h-5 w-5" />
                      <span className="ml-2 hidden lg:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                <Link href="/favorites">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-5 w-5" />
                    <span className="ml-2 hidden lg:inline">{t('favorites')}</span>
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-5 w-5" />
                    <span className="ml-2 hidden lg:inline">{t('messages')}</span>
                  </Button>
                </Link>
                <Link href="/properties/new">
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{t('addProperty')}</span>
                    <span className="lg:hidden">Add</span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                      {user?.image ? (
                        <img src={user.image} alt="" className="h-8 w-8 rounded-full" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name || user?.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        {t('profile')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">{t('getStarted')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                    {user?.image ? (
                      <img src={user.image} alt="" className="h-8 w-8 rounded-full" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name || user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  {t('signIn')}
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Navigation Links */}
            <nav className="space-y-2">
              <Link
                href="/properties"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Building className="h-5 w-5" />
                {t('properties')}
              </Link>
              <Link
                href="/properties?type=sale"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Home className="h-5 w-5" />
                {t('forSale')}
              </Link>
              <Link
                href="/properties?type=rent"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Key className="h-5 w-5" />
                {t('forRent')}
              </Link>
            </nav>

            {isAuthenticated ? (
              <div className="border-t pt-4 space-y-2">
                {userRole.isAgent ? (
                  <Link
                    href="/agent/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Briefcase className="h-5 w-5" />
                    {t('agentDashboard') || 'Agent Dashboard'}
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    {t('dashboard')}
                  </Link>
                )}
                {userRole.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Shield className="h-5 w-5" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/favorites"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Heart className="h-5 w-5" />
                  {t('favorites')}
                </Link>
                <Link
                  href="/messages"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <MessageSquare className="h-5 w-5" />
                  {t('messages')}
                </Link>
                <Link
                  href="/properties/new"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                >
                  <PlusCircle className="h-5 w-5" />
                  {t('addProperty')}
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu()
                    signOut({ callbackUrl: '/' })
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <LogOut className="h-5 w-5" />
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <div className="border-t pt-4 space-y-2">
                <Link href="/sign-in" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full">{t('signIn')}</Button>
                </Link>
                <Link href="/sign-up" onClick={closeMobileMenu}>
                  <Button className="w-full">{t('getStarted')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
