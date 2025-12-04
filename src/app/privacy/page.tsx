"use client"

import { useTranslations } from 'next-intl'
import { MainLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  const t = useTranslations('legal.privacy')

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
                <p className="text-gray-600">{t('sections.intro.content')}</p>
              </section>

              {/* Data Collection */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.collection.title')}</h2>
                <p className="text-gray-600 mb-4">{t('sections.collection.intro')}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.collection.item1')}</li>
                  <li>{t('sections.collection.item2')}</li>
                  <li>{t('sections.collection.item3')}</li>
                  <li>{t('sections.collection.item4')}</li>
                  <li>{t('sections.collection.item5')}</li>
                </ul>
              </section>

              {/* How We Use Data */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.usage.title')}</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.usage.item1')}</li>
                  <li>{t('sections.usage.item2')}</li>
                  <li>{t('sections.usage.item3')}</li>
                  <li>{t('sections.usage.item4')}</li>
                  <li>{t('sections.usage.item5')}</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.sharing.title')}</h2>
                <p className="text-gray-600 mb-4">{t('sections.sharing.intro')}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.sharing.item1')}</li>
                  <li>{t('sections.sharing.item2')}</li>
                  <li>{t('sections.sharing.item3')}</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.cookies.title')}</h2>
                <p className="text-gray-600 mb-4">{t('sections.cookies.content')}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.cookies.item1')}</li>
                  <li>{t('sections.cookies.item2')}</li>
                  <li>{t('sections.cookies.item3')}</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.security.title')}</h2>
                <p className="text-gray-600">{t('sections.security.content')}</p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.rights.title')}</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>{t('sections.rights.item1')}</li>
                  <li>{t('sections.rights.item2')}</li>
                  <li>{t('sections.rights.item3')}</li>
                  <li>{t('sections.rights.item4')}</li>
                  <li>{t('sections.rights.item5')}</li>
                </ul>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.retention.title')}</h2>
                <p className="text-gray-600">{t('sections.retention.content')}</p>
              </section>

              {/* Children */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sections.children.title')}</h2>
                <p className="text-gray-600">{t('sections.children.content')}</p>
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
                  Email: <a href="mailto:privacy@estatehub.uz" className="text-blue-600 hover:underline">privacy@estatehub.uz</a>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
