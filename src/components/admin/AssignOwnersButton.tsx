"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function AssignOwnersButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAssign = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/properties/assign-owners', {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message)
        setResult(`✅ ${data.message}`)
      } else {
        toast.error(data.error || 'Failed to assign owners')
        setResult(`❌ ${data.error || 'Failed to assign owners'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred')
      setResult('❌ An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleAssign} disabled={loading}>
        {loading ? 'Assigning...' : 'Assign Owners to Properties'}
      </Button>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm">{result}</p>
        </div>
      )}
    </div>
  )
}
