import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    )
  }

  try {
    // Fetch current quote for Meta (META)
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=META&apikey=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch stock data')
    }

    const data = await response.json()

    // Check for API errors
    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }

    if (data['Note']) {
      // API call frequency limit reached
      return NextResponse.json(
        { error: 'API rate limit reached. Please try again later.' },
        { status: 429 }
      )
    }

    const quote = data['Global Quote']
    
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid response from API')
    }

    const currentPrice = parseFloat(quote['05. price'])

    return NextResponse.json({
      symbol: 'META',
      price: currentPrice,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching current stock price:', error)
    return NextResponse.json(
      { error: 'Failed to fetch current stock price' },
      { status: 500 }
    )
  }
}

