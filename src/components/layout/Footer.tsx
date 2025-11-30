import Link from 'next/link'
import { Home, MapPin, Users, UserCheck, Calculator, Search, Building2, FileText, HelpCircle, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Properties */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?type=sale"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  For Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=rent"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  For Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/properties/new"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  List Property
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Compare Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Browse</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/areas"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  Areas & Districts
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  Find Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=APARTMENT"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=HOUSE"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Houses
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=COMMERCIAL"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/become-agent"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <UserCheck className="h-3 w-3" />
                  Become an Agent
                </Link>
              </li>
              <li>
                <Link
                  href="/agent/dashboard"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Agent Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Agent Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard?tab=searches"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Search className="h-3 w-3" />
                  Saved Searches
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Property Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="h-3 w-3" />
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo and Description */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  EstateHub
                </span>
              </Link>
              <p className="text-sm text-gray-500 hidden md:block">
                Find your dream property
              </p>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {currentYear} EstateHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
