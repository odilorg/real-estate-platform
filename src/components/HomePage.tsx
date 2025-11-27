'use client'

import Link from "next/link"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Home, Building2, Warehouse } from "lucide-react"

export function HomePage() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/properties">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  {t('hero.browseProperties')}
                </Button>
              </Link>
              <Link href="/properties/new">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20">
                  {t('hero.listProperty')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('propertyTypes.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Home className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('propertyTypes.residential')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('propertyTypes.residentialDesc')}
                </p>
                <Link href="/properties?type=APARTMENT,HOUSE,CONDO">
                  <Button variant="outline">{tCommon('browse')}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('propertyTypes.commercial')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('propertyTypes.commercialDesc')}
                </p>
                <Link href="/properties?type=COMMERCIAL">
                  <Button variant="outline">{tCommon('browse')}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
                  <Warehouse className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('propertyTypes.land')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('propertyTypes.landDesc')}
                </p>
                <Link href="/properties?type=LAND">
                  <Button variant="outline">{tCommon('browse')}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.locationSearch')}</h3>
              <p className="text-gray-600">
                {t('features.locationSearchDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.advancedFilters')}</h3>
              <p className="text-gray-600">
                {t('features.advancedFiltersDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.verifiedListings')}</h3>
              <p className="text-gray-600">
                {t('features.verifiedListingsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('cta.subtitle')}
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary">
              {t('cta.createAccount')}
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
