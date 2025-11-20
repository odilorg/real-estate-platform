import Link from 'next/link'
import { Home } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                EstateHub
              </span>
            </Link>
            <p className="text-sm text-gray-600">
              Find your dream property or list your space with ease.
            </p>
          </div>

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
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Blog
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

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} EstateHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
