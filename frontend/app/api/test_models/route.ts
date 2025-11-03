import { NextResponse } from 'next/server'

let lastResults: any = null

export async function POST(req: Request) {
  try {
    const body = await req.json()
    lastResults = Object.assign({ received_at: new Date().toISOString() }, body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(lastResults || { ok: false, message: 'no-results' })
}

export const runtime = 'edge'
