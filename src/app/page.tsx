import Link from "next/link"
import { MainLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Home, Building2, Warehouse } from "lucide-react"

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover the perfect home, apartment, or commercial space in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/properties">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Properties
                </Button>
              </Link>
              <Link href="/properties/new">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20">
                  List Your Property
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
            Browse by Property Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Home className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Residential</h3>
                <p className="text-gray-600 mb-4">
                  Houses, apartments, and condos
                </p>
                <Link href="/properties?type=APARTMENT,HOUSE,CONDO">
                  <Button variant="outline">Browse</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Commercial</h3>
                <p className="text-gray-600 mb-4">
                  Offices, retail, and business spaces
                </p>
                <Link href="/properties?type=COMMERCIAL">
                  <Button variant="outline">Browse</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
                  <Warehouse className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Land</h3>
                <p className="text-gray-600 mb-4">
                  Plots, farms, and development land
                </p>
                <Link href="/properties?type=LAND">
                  <Button variant="outline">Browse</Button>
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
            Why Choose EstateHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location-Based Search</h3>
              <p className="text-gray-600">
                Find properties in your preferred neighborhoods with our advanced map search
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Filters</h3>
              <p className="text-gray-600">
                Narrow down your search with detailed filters for price, size, amenities, and more
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                Browse through verified properties from trusted sellers and agents
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users finding their perfect property
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
