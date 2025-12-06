
import { getMonthlyAveragePrice } from './app/actions/stock';

async function testAverage() {
  const symbol = 'META';
  const startDate = '2023-11-15'; // Should verify Oct 2023 average
  console.log(`Testing average price for ${symbol} with start date ${startDate}...`);
  
  const average = await getMonthlyAveragePrice(symbol, startDate);
  
  if (average !== null) {
    console.log(`Success! Average price for previous month: $${average}`);
  } else {
    console.log('Failed to fetch average price.');
  }
}

testAverage();
