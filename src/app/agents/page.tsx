"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Phone,
  Mail,
  MessageCircle,
  Star,
  MapPin,
  Building2,
  Award,
  Shield,
  Clock,
  Home,
  User,
  Loader2,
  Search,
} from 'lucide-react'

interface Agent {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  telegram: string | null
  yearsExperience: number
  verified: boolean
  superAgent: boolean
  responseTime: string | null
  specializations: string[]
  languages: string[]
  areasServed: string[]
  agency: {
    id: string
    name: string
    logo: string | null
  } | null
  listingsCount: number
  reviewCount: number
  avgRating: number
}

export default function AgentsPage() {
  const t = useTranslations('agent')
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents')
      if (res.ok) {
        const data = await res.json()
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredAgents = agents.filter((agent) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      agent.firstName.toLowerCase().includes(query) ||
      agent.lastName.toLowerCase().includes(query) ||
      agent.agency?.name.toLowerCase().includes(query) ||
      agent.areasServed.some((area) => area.toLowerCase().includes(query)) ||
      agent.specializations.some((spec) => spec.toLowerCase().includes(query))
    )
  })

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Find Real Estate Agents</h1>
            <p className="text-gray-600 mb-6">
              Connect with experienced real estate professionals in your area
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, agency, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No agents found</h2>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <Link key={agent.id} href={`/agents/${agent.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Photo */}
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                          {agent.photo ? (
                            <Image
                              src={agent.photo}
                              alt={`${agent.firstName} ${agent.lastName}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                          {agent.verified && (
                            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                              <Shield className="h-3 w-3" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-lg">
                              {agent.firstName} {agent.lastName}
                            </h3>
                            {agent.superAgent && (
                              <Badge className="bg-yellow-500 text-white flex-shrink-0">
                                <Award className="h-3 w-3 mr-1" />
                                Super
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {agent.agency ? agent.agency.name : t('privateOwner')}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mt-2">
                            {renderStars(Math.round(agent.avgRating))}
                            <span className="text-sm font-medium">{agent.avgRating}</span>
                            <span className="text-sm text-gray-500">
                              ({agent.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Home className="h-4 w-4" />
                          {agent.listingsCount} listings
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {agent.yearsExperience} years
                        </span>
                        {agent.responseTime === 'fast' && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Quick Response
                          </Badge>
                        )}
                      </div>

                      {/* Areas */}
                      {agent.areasServed.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {agent.areasServed.slice(0, 3).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              <MapPin className="h-2 w-2 mr-1" />
                              {area}
                            </Badge>
                          ))}
                          {agent.areasServed.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{agent.areasServed.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Contact Buttons */}
                      <div className="flex gap-2 mt-4">
                        {agent.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = `tel:${agent.phone}`
                            }}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        )}
                        {agent.whatsapp && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-green-50 border-green-200 text-green-700"
                            onClick={(e) => {
                              e.preventDefault()
                              window.open(`https://wa.me/${agent.whatsapp?.replace(/\D/g, '')}`, '_blank')
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            WhatsApp
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
