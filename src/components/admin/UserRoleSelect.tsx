"use client"

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface UserRoleSelectProps {
  userId: string
  currentRole: string
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState(currentRole)
  const [updating, setUpdating] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        setRole(newRole)
        toast.success(`User role updated to ${newRole}`)
      } else {
        toast.error('Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('An error occurred')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Select value={role} onValueChange={handleRoleChange} disabled={updating}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="moderator">Moderator</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}
