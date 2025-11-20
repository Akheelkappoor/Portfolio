import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Parse the incoming request
    const body = await request.json()
    const { message, timestamp, sessionId } = body

    // Validate required fields
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get the webhook URL and API key from environment variables
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://n8n.lms-i2global.com/webhook/Portfolio'
    const apiKey = process.env.CHATBOT_API_KEY

    if (!apiKey) {
      console.error('CHATBOT_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Prepare the payload for N8N webhook
    const webhookPayload = {
      message: message.trim(),
      timestamp: timestamp || new Date().toISOString(),
      sessionId: sessionId || `session-${Date.now()}`
    }

    // Call the N8N webhook with API key in headers
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey, // Some services prefer this format
      },
      body: JSON.stringify(webhookPayload)
    })

    // Check if the webhook call was successful
    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('Webhook error:', webhookResponse.status, errorText)

      return NextResponse.json(
        { error: 'Failed to process your message. Please try again.' },
        { status: 502 }
      )
    }

    // Parse and return the webhook response
    const data = await webhookResponse.json()

    return NextResponse.json({
      response: data.response || data.message || data.output || 'Thanks for your message!',
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('Chatbot API error:', error)

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Optional: Add CORS headers if needed
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
