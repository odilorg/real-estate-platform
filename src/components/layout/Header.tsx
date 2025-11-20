"use client"

import Link from 'next/link'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Home, PlusCircle, Heart, MessageSquare } from 'lucide-react'

export function Header() {
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/properties?type=sale"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              For Sale
            </Link>
            <Link
              href="/properties?type=rent"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              For Rent
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              <Link href="/favorites">
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                  <span className="ml-2 hidden sm:inline">Favorites</span>
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-5 w-5" />
                  <span className="ml-2 hidden sm:inline">Messages</span>
                </Button>
              </Link>
              <Link href="/properties/new">
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  List Property
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
