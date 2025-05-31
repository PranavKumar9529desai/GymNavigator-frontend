"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

import { PricingEditForm } from '../_components/editable/pricing-edit-form'
import type { GymData } from '../types/gym-types'
import FetchGymDetailsSA from '../_actions/GetGymDetails'
import { getPricingData } from '../_actions/get-gym-tab-data'

interface GymInfo {
  gym_name: string;
  gym_logo: string;
  address: string;
  phone_number: string;
  Email: string;
  gymauthtoken: string;
}

export default function PricingPage() {
  const router = useRouter()
  const [gymData, setGymData] = useState<GymData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGymData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch both gym details and pricing data in parallel
        const [gymResponse, pricingResponse] = await Promise.all([
          FetchGymDetailsSA(),
          getPricingData()
        ])
        
        if (gymResponse) {
          // Convert GymInfo to GymData format
          const gymInfo = gymResponse as GymInfo
          const convertedGymData: GymData = {
            gym_name: gymInfo.gym_name,
            gym_logo: gymInfo.gym_logo,
            address: gymInfo.address,
            phone_number: gymInfo.phone_number,
            Email: gymInfo.Email,
            gymauthtoken: gymInfo.gymauthtoken,
            // Load existing pricing data if available, otherwise initialize with empty arrays
            fitnessPlans: pricingResponse.pricingPlans || [],
            amenities: {},
          }
          
          setGymData(convertedGymData)
          
          // Show success message if pricing data was loaded
          if (pricingResponse.pricingPlans && pricingResponse.pricingPlans.length > 0) {
            toast.success(`Loaded ${pricingResponse.pricingPlans.length} existing pricing plans`)
          }
        } else {
          setError('Failed to fetch gym data')
          toast.error('Failed to load gym data')
        }
      } catch (err) {
        console.error('Error fetching gym data:', err)
        setError('An unexpected error occurred')
        toast.error('Failed to load gym data')
      } finally {
        setLoading(false)
      }
    }

    fetchGymData()
  }, [])

  const handleDataChange = (updatedData: GymData) => {
    setGymData(updatedData)
  }

  const handleSave = () => {
    toast.success('Pricing updated successfully!')
    // Optionally navigate back or stay on the page
  }

  const handleGoBack = () => {
    router.push('/dashboard/owner/gymdetails/viewgymdetails')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <p className="text-gray-600">Loading gym data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !gymData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                {error || 'Failed to load gym data'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Retry
                </Button>
                <Button onClick={handleGoBack}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gym Details
        </Button>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
        <p className="text-gray-600 mt-1">
          Manage your gym's pricing plans and additional services for {gymData.gym_name}
        </p>
      </div>

      {/* Pricing Edit Form */}
      <Card>
        <CardContent className="p-6">
          <PricingEditForm
            data={gymData}
            onDataChange={handleDataChange}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  )
}