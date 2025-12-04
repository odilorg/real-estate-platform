"use client"

import { useTranslations } from 'next-intl'
import { MainLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'

export default function TermsOfServicePage() {
  const t = useTranslations('legal.terms')

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-2">{t('title')}</h1>
          <p className="text-center text-gray-500 mb-8">{t('lastUpdated')}: 2025-12-02</p>

          <Card>
            <CardContent className="prose prose-gray max-w-none p-6 md:p-8">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.intro.title')}</h2>
                <p className="text-gray-600 mb-4">{t('sections.intro.content')}</p>
              </section>

              {/* Definitions */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.definitions.title')}</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>{t('sections.definitions.platform')}</strong></li>
                  <li><strong>{t('sections.definitions.user')}</strong></li>
                  <li><strong>{t('sections.definitions.agent')}</strong></li>
                  <li><strong>{t('sections.definitions.listing')}</strong></li>
                </ul>
              </section>

              {/* User Accounts */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.accounts.title')}</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.accounts.item1')}</li>
                  <li>{t('sections.accounts.item2')}</li>
                  <li>{t('sections.accounts.item3')}</li>
                  <li>{t('sections.accounts.item4')}</li>
                </ul>
              </section>

              {/* Property Listings */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.listings.title')}</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.listings.item1')}</li>
                  <li>{t('sections.listings.item2')}</li>
                  <li>{t('sections.listings.item3')}</li>
                  <li>{t('sections.listings.item4')}</li>
                  <li>{t('sections.listings.item5')}</li>
                </ul>
              </section>

              {/* Prohibited Content */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.prohibited.title')}</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.prohibited.item1')}</li>
                  <li>{t('sections.prohibited.item2')}</li>
                  <li>{t('sections.prohibited.item3')}</li>
                  <li>{t('sections.prohibited.item4')}</li>
                  <li>{t('sections.prohibited.item5')}</li>
                </ul>
              </section>

              {/* Disclaimer */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.disclaimer.title')}</h2>
                <p className="text-gray-600 mb-4">{t('sections.disclaimer.content1')}</p>
                <p className="text-gray-600">{t('sections.disclaimer.content2')}</p>
              </section>

              {/* Liability */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.liability.title')}</h2>
                <p className="text-gray-600">{t('sections.liability.content')}</p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.termination.title')}</h2>
                <p className="text-gray-600">{t('sections.termination.content')}</p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.changes.title')}</h2>
                <p className="text-gray-600">{t('sections.changes.content')}</p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-xl font-semibold mb-4">{t('sections.contact.title')}</h2>
                <p className="text-gray-600">{t('sections.contact.content')}</p>
                <p className="text-gray-600 mt-2">
                  Email: <a href="mailto:legal@estatehub.uz" className="text-blue-600 hover:underline">legal@estatehub.uz</a>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
