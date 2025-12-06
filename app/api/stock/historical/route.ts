import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')

  if (!startDate) {
    return NextResponse.json(
      { error: 'startDate parameter is required' },
      { status: 400 }
    )
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    )
  }

  try {
    // Calculate the previous month from the start date
    const date = new Date(startDate)
    const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    const lastDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0)

    // Fetch daily time series for Meta (META)
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=META&outputsize=full&apikey=${apiKey}`
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

    const timeSeries = data['Time Series (Daily)']
    
    if (!timeSeries) {
      throw new Error('Invalid response from API')
    }

    // Filter prices for the previous month
    const previousMonthPrices: number[] = []
    const startStr = previousMonth.toISOString().split('T')[0]
    const endStr = lastDayOfPreviousMonth.toISOString().split('T')[0]

    for (const [dateStr, values] of Object.entries(timeSeries)) {
      if (dateStr >= startStr && dateStr <= endStr) {
        const closePrice = parseFloat((values as any)['4. close'])
        previousMonthPrices.push(closePrice)
      }
    }

    if (previousMonthPrices.length === 0) {
      return NextResponse.json(
        { error: 'No data available for the specified month' },
        { status: 404 }
      )
    }

    // Calculate average closing price
    const averagePrice = previousMonthPrices.reduce((sum, price) => sum + price, 0) / previousMonthPrices.length

    return NextResponse.json({
      symbol: 'META',
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      month: previousMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      dataPoints: previousMonthPrices.length,
    })
  } catch (error) {
    console.error('Error fetching historical stock data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch historical stock data' },
      { status: 500 }
    )
  }
}

