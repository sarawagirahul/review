import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { phone, whatsapp_phone, gst_number } = body

  if (!phone || !phone.trim()) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({
      phone: phone.trim(),
      whatsapp_phone: whatsapp_phone?.trim() || null,
    })
    .eq('id', user.id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  // Best-effort: gst_number column may need a migration to exist in owner_details
  if (gst_number) {
    await supabase
      .from('owner_details')
      .update({ gst_number: gst_number.trim() } as never)
      .eq('user_id', user.id)
  }

  return NextResponse.json({ success: true })
}
