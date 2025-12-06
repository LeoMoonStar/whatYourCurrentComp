'use server';

import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export interface StockPrice {
  symbol: string;
  date: Date;
  open: number;
  close: number;
  high: number;
  low: number;
}

export async function getStockPrices(symbol: string): Promise<StockPrice | null> {
  try {
    const result = await yahooFinance.quote(symbol);

    if (!result) {
      return null;
    }

    // Ensure we have the necessary data
    if (
      typeof result.regularMarketOpen !== 'number' ||
      typeof result.regularMarketPrice !== 'number'
    ) {
      console.warn(`Incomplete data for ${symbol}`, result);
      return null;
    }

    return {
      symbol: result.symbol,
      date: result.regularMarketTime || new Date(),
      open: result.regularMarketOpen,
      close: result.regularMarketPrice,
      high: result.regularMarketDayHigh || result.regularMarketPrice,
      low: result.regularMarketDayLow || result.regularMarketPrice,
    };
  } catch (error) {
    console.error(`Failed to fetch stock prices for ${symbol}:`, error);
    return null;
  }
}

export async function getMonthlyAveragePrice(symbol: string, startDate: Date | string): Promise<number | null> {
  try {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      throw new Error('Invalid start date');
    }

    // Calculate the previous month range
    // If start is Nov 2023, previous month is Oct 2023 (Oct 1 to Oct 31)
    const year = start.getFullYear();
    const month = start.getMonth(); // 0-indexed (0 = Jan, 10 = Nov)

    // First day of previous month
    // month - 1 handles year decrement automatically (0 - 1 = -1 -> Dec of prev year)
    const firstDay = new Date(year, month - 1, 1);
    
    // Last day of previous month
    // month 0 is Jan. new Date(year, 0, 0) is Dec 31 of prev year.
    // new Date(year, month, 0) gives the last day of (month - 1)
    const lastDay = new Date(year, month, 0);

    // console.log(`Fetching average for ${symbol} from ${firstDay.toISOString()} to ${lastDay.toISOString()}`);

    const queryOptions = {
      period1: firstDay,
      period2: lastDay,
      interval: '1d' as const,
    };

    const result = await yahooFinance.chart(symbol, queryOptions);

    if (!result || !result.quotes || result.quotes.length === 0) {
      return null;
    }

    // Calculate average closing price
    let sum = 0;
    let count = 0;

    for (const quote of result.quotes) {
      if (typeof quote.close === 'number') {
        sum += quote.close;
        count++;
      }
    }

    if (count === 0) return null;

    const average = sum / count;
    // Return rounded to 2 decimal places
    return Math.round(average * 100) / 100;

  } catch (error) {
    console.error(`Failed to fetch average price for ${symbol}:`, error);
    return null;
  }
}
