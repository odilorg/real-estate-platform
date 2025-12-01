import { Header } from './Header'
import { Footer } from './Footer'
import { CategoryNav } from './CategoryNav'
import { ComparisonBar } from '@/components/comparison/ComparisonBar'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryNav />
      <main className="flex-1 pb-20">{children}</main>
      <Footer />
      <ComparisonBar />
    </div>
  )
}
