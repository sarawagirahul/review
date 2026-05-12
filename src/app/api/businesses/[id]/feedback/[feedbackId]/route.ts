import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; feedbackId: string }> }
) {
  const { id, feedbackId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body: { is_resolved?: boolean; resolved_note?: string } = await request.json()

  const updates: Record<string, unknown> = {}
  if (body.is_resolved !== undefined) {
    updates.is_resolved = body.is_resolved
    if (body.is_resolved === true) {
      updates.resolved_at = new Date().toISOString()
    }
  }
  if (body.resolved_note !== undefined) {
    updates.resolved_note = body.resolved_note
  }

  const { data, error } = await supabase
    .from('private_feedback')
    .update(updates)
    .eq('id', feedbackId)
    .eq('business_id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ feedback: data })
}
