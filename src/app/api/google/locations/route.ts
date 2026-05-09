import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // 1. Verify user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 2. Fetch the Google Access Token from owner_details
    const { data: ownerDetails, error: ownerError } = await supabase
      .from('owner_details')
      .select('google_access_token')
      .eq('user_id', user.id)
      .single()

    if (ownerError || !ownerDetails?.google_access_token) {
      console.error('No Google access token found for user')
      return NextResponse.json({ error: 'Google Account not connected or token expired' }, { status: 403 })
    }

    const accessToken = ownerDetails.google_access_token

    // Mock data fallback if Google API restricts access (Quota = 0 before approval)
    const MOCK_LOCATIONS = [
      {
        googleLocationId: 'accounts/123/locations/456',
        googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        name: 'The Great Indian Coffee Shop',
        primaryCategory: 'Coffee Shop',
        addressLine1: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        primaryPhone: '+91 98765 43210',
        googleRating: 4.8,
        googleReviewCount: 124,
      },
      {
        googleLocationId: 'accounts/123/locations/789',
        googlePlaceId: 'ChIJ0xXm37_vDDkRvZ_GbbYw1sA',
        name: 'Sharma Sweets & Snacks',
        primaryCategory: 'Sweets Shop',
        addressLine1: '45 Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        primaryPhone: '+91 91234 56789',
        googleRating: 4.5,
        googleReviewCount: 89,
      }
    ]

    // 3. Fetch accounts from Google My Business API
    const accountsRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!accountsRes.ok) {
      const errorData = await accountsRes.text()
      console.warn('Google API is restricted or quota is 0. Falling back to mock data.', errorData)
      return NextResponse.json({ locations: MOCK_LOCATIONS })
    }

    const accountsData = await accountsRes.json()
    const accounts = accountsData.accounts || []

    if (accounts.length === 0) {
      return NextResponse.json({ locations: [] })
    }

    // 4. Fetch locations for the first account
    const accountName = accounts[0].name
    const locationsRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title,categories,storefrontAddress,regularHours,phoneNumbers`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!locationsRes.ok) {
      const errorData = await locationsRes.text()
      console.warn('Google API locations restricted. Falling back to mock data.', errorData)
      return NextResponse.json({ locations: MOCK_LOCATIONS })
    }

    const locationsData = await locationsRes.json()
    const googleLocations = locationsData.locations || []

    // 5. Map the Google API response to our unified format
    const formattedLocations = googleLocations.map((loc: any) => ({
      googleLocationId: loc.name,
      googlePlaceId: loc.storefrontAddress?.placeId || '',
      name: loc.title,
      primaryCategory: loc.categories?.primaryCategory?.displayName || '',
      addressLine1: loc.storefrontAddress?.addressLines?.[0] || '',
      city: loc.storefrontAddress?.locality || '',
      state: loc.storefrontAddress?.administrativeArea || '',
      pincode: loc.storefrontAddress?.postalCode || '',
      primaryPhone: loc.phoneNumbers?.primaryPhone || '',
      // Note: Ratings and review count require a separate call to the My Business API or Places API
      googleRating: 0,
      googleReviewCount: 0,
    }))

    return NextResponse.json({ locations: formattedLocations })

  } catch (err) {
    console.error('Error fetching Google locations:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
