import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('owner_id')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('business_id', id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ qrCodes: data })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('owner_id')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const { nickname, frame_title, frame_tagline, fg_color, bg_color, dot_style, embed_logo } = body

  if (!nickname || !nickname.trim()) {
    return NextResponse.json({ error: 'Nickname is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({
      business_id: id,
      nickname: nickname.trim(),
      frame_title: frame_title || null,
      frame_tagline: frame_tagline || null,
      fg_color: fg_color || '#131842',
      bg_color: bg_color || '#ffffff',
      dot_style: dot_style || 'square',
      embed_logo: embed_logo || false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ qrCode: data }, { status: 201 })
}
