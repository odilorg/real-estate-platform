"use client"

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Home, MapPin, Users, UserCheck, Search, HelpCircle } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Properties */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('properties.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?type=sale"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('properties.forSale')}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=rent"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('properties.forRent')}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties/new"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('properties.listProperty')}
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('properties.compare')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('browse.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/areas"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  {t('browse.areas')}
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  {t('browse.findAgents')}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=APARTMENT"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('browse.apartments')}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=HOUSE"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('browse.houses')}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=COMMERCIAL"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('browse.commercial')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('forProfessionals.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/become-agent"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <UserCheck className="h-3 w-3" />
                  {t('forProfessionals.becomeAgent')}
                </Link>
              </li>
              <li>
                <Link
                  href="/agent/dashboard"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('forProfessionals.agentDashboard')}
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('forProfessionals.agentDirectory')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('tools.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard?tab=searches"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Search className="h-3 w-3" />
                  {t('tools.savedSearches')}
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('tools.favorites')}
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('tools.comparison')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('company.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('company.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('company.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="h-3 w-3" />
                  {t('company.helpCenter')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('legal.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('legal.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('legal.termsOfService')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t('legal.cookiePolicy')}
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
                {t('description')}
              </p>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {currentYear} EstateHub. {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
