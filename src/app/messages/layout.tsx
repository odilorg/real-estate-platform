import { MainLayout } from "@/components/layout"

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
