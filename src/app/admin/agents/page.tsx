"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  UserCheck,
  Users,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface AgentApplication {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string | null
  licenseNumber: string | null
  yearsExperience: number
  bio: string | null
  specializations: string | null
  areasServed: string | null
  status: string
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
}

interface Agent {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  verified: boolean
  superAgent: boolean
  rating: number
  reviewCount: number
  createdAt: string
  agency: { name: string } | null
}

export default function AdminAgentsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<AgentApplication[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<AgentApplication | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [appsRes, agentsRes] = await Promise.all([
        fetch('/api/admin/agent-applications'),
        fetch('/api/admin/agents'),
      ])

      if (appsRes.ok) {
        const appsData = await appsRes.json()
        setApplications(appsData.applications || [])
      }

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        setAgents(agentsData.agents || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (application: AgentApplication) => {
    setIsProcessing(true)
    try {
      const res = await fetch(`/api/admin/agent-applications/${application.id}/approve`, {
        method: 'POST',
      })

      if (res.ok) {
        toast.success(`${application.firstName} ${application.lastName} approved as agent!`)
        loadData()
        setSelectedApp(null)
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to approve')
      }
    } catch (error) {
      toast.error('Failed to approve application')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedApp) return

    setIsProcessing(true)
    try {
      const res = await fetch(`/api/admin/agent-applications/${selectedApp.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (res.ok) {
        toast.success('Application rejected')
        loadData()
        setShowRejectDialog(false)
        setSelectedApp(null)
        setRejectionReason('')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to reject')
      }
    } catch (error) {
      toast.error('Failed to reject application')
    } finally {
      setIsProcessing(false)
    }
  }

  const pendingCount = applications.filter(a => a.status === 'PENDING').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Agent Management</h1>
          <p className="text-gray-600">Review applications and manage agents</p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            {pendingCount} pending applications
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Applications
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-yellow-500">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="agents">Active Agents</TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              {applications.filter(a => a.status === 'PENDING').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No pending applications</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications
                      .filter(a => a.status === 'PENDING')
                      .map(app => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div className="font-medium">{app.firstName} {app.lastName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{app.email}</div>
                            <div className="text-sm text-gray-500">{app.phone}</div>
                          </TableCell>
                          <TableCell>{app.yearsExperience} years</TableCell>
                          <TableCell>{app.companyName || '-'}</TableCell>
                          <TableCell>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedApp(app)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(app)}
                                disabled={isProcessing}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedApp(app)
                                  setShowRejectDialog(true)
                                }}
                                disabled={isProcessing}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardContent className="pt-6">
              {agents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>No agents yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map(agent => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="font-medium">{agent.firstName} {agent.lastName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{agent.email || '-'}</div>
                          <div className="text-sm text-gray-500">{agent.phone || '-'}</div>
                        </TableCell>
                        <TableCell>{agent.agency?.name || 'Independent'}</TableCell>
                        <TableCell>
                          {agent.rating > 0 ? (
                            <span>⭐ {agent.rating.toFixed(1)} ({agent.reviewCount})</span>
                          ) : (
                            <span className="text-gray-400">No reviews</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {agent.verified && (
                              <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                            )}
                            {agent.superAgent && (
                              <Badge className="bg-green-100 text-green-800">Super</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Reviewed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.firstName} {app.lastName}</div>
                        {app.companyName && (
                          <div className="text-sm text-gray-500">{app.companyName}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{app.email}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {app.reviewedAt
                          ? new Date(app.reviewedAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedApp && !showRejectDialog} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the application from {selectedApp?.firstName} {selectedApp?.lastName}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p>{selectedApp.firstName} {selectedApp.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p>{selectedApp.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p>{selectedApp.yearsExperience} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p>{selectedApp.companyName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">License</label>
                  <p>{selectedApp.licenseNumber || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="mt-1 text-sm">{selectedApp.bio || 'N/A'}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Specializations</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedApp.specializations
                      ? JSON.parse(selectedApp.specializations).map((s: string) => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))
                      : <span className="text-gray-400">None</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Areas Served</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedApp.areasServed
                      ? JSON.parse(selectedApp.areasServed).map((a: string) => (
                          <Badge key={a} variant="outline">{a}</Badge>
                        ))
                      : <span className="text-gray-400">None</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApp(null)}>
              Close
            </Button>
            {selectedApp?.status === 'PENDING' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => selectedApp && handleApprove(selectedApp)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection (optional but recommended)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
