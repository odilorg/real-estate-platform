"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ScheduleViewingProps {
  propertyId: string
  propertyTitle: string
  ownerId: string
}

const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

export function ScheduleViewing({ propertyId, propertyTitle, ownerId }: ScheduleViewingProps) {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated'
  const user = session?.user
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [message, setMessage] = useState('')

  const isOwner = user?.id === ownerId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time) {
      toast.error('Please select a date and time')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/viewings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          date,
          time,
          message: message || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to schedule viewing')
      }

      toast.success('Viewing request sent! The owner will respond soon.')
      setOpen(false)
      setDate('')
      setTime('')
      setMessage('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to schedule viewing')
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (tomorrow)
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  // Get maximum date (30 days from now)
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  if (!isSignedIn) {
    return (
      <Button className="w-full" variant="outline" disabled>
        <Calendar className="h-4 w-4 mr-2" />
        Sign in to Schedule Viewing
      </Button>
    )
  }

  if (isOwner) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule a Viewing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Viewing</DialogTitle>
          <DialogDescription>
            Request a viewing for "{propertyTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="date">Preferred Date *</Label>
            <Input
              id="date"
              type="date"
              min={minDateStr}
              max={maxDateStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Preferred Time *</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add any specific requests or questions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Request Viewing
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
