import { NextResponse, NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll() },
          setAll() {}
        }
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postBody } = await req.json()

    if (!postBody) {
      return NextResponse.json({ error: 'Post body is required' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    const prompt = `You are a helpful assistant. Generate a concise, engaging summary of approximately 100 words for the following blog post content. The summary should capture the main points and be suitable for a post listing page preview.

Blog post content:
${postBody}

Return only the summary text, nothing else.`

    const result = await model.generateContent(prompt)
    const summary = result.response.text().trim()

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
