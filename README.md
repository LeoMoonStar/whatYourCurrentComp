# Meta Real Package Calculator

This small application helps you to calculate your package value at now days. 

Your onboarding RSU is calculated based on average close price of Meta stock on trading day in previous month of your onboarding date.

So if you provide your starting date and compensation on offer, this application will help you to calculate the real value on nowdays.

## Features

- Calculate cash compensation (base + bonus)
- Calculate RSU shares based on grant amount and historical average price
- Display current RSU value and gain/loss
- Show total present value of your compensation package
- **Auto-fetch real-time Meta stock prices** using `yahoo-finance2` (No API Key required!)
- **Auto-calculate historical average** based on your start date

## Getting Started

### Prerequisites

- **Node.js 18+** OR **Bun 1.0+** installed

### Installation

#### Option 1: Using Bun (Recommended - Faster!) 🚀

1. Install Bun if you haven't already:

\`\`\`bash
curl -fsSL https://bun.sh/install | bash
\`\`\`

2. Install dependencies:

\`\`\`bash
bun install
\`\`\`

#### Option 2: Using npm/yarn

1. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### Running the Application

#### With Bun (Faster startup!)

\`\`\`bash
# Development Mode
bun run bun:dev

# Production Mode
bun run bun:build
bun run bun:start
\`\`\`

#### With Node.js/npm

\`\`\`bash
# Development Mode
npm run dev

# Production Mode
npm run build
npm start
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to Use

1. **Base Salary**: Enter your annual base salary from your offer letter
2. **Bonus Percentage**: Enter your target bonus as a percentage (e.g., 15 for 15%)
3. **RSU Grant Amount**: Enter the total RSU dollar value from your offer letter
4. **Start Date**: Enter your Meta onboarding date
5. **Average Closing Price**: Click "Auto-Fetch" to automatically get the average Meta stock price from the month before your start date (or enter manually)
6. **Current Stock Price**: Click "Auto-Fetch" to get today's Meta stock price (or enter manually)

Click "Calculate Present Value" to see:
- Your total cash compensation (base + bonus)
- Number of RSU shares you received
- Current value of your RSUs
- Gain/loss on your RSUs compared to grant value
- Total present value of your package

## Technology Stack

- **Framework**: Next.js 14 with App Router (Server-Side Rendering)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: React 18
- **Package Manager**: Bun (recommended) or npm/yarn
- **Stock Data API**: `yahoo-finance2` (Unofficial Yahoo Finance API)

## Why Bun?

This project is optimized to work with Bun, offering significant performance improvements:
- **11x faster** package installation compared to npm
- **Faster development server** startup times
- **Built-in TypeScript** support without additional configuration
- **Drop-in replacement** for npm/yarn - all existing scripts still work
- **Full compatibility** with Next.js 14 and our API routes

📖 **See [BUN_QUICK_START.md](./BUN_QUICK_START.md) for detailed Bun setup and usage guide!**

## API Information

This application uses `yahoo-finance2` to fetch real-time and historical Meta stock prices.
- **No API Key Required**: Works out of the box.
- **Privacy**: No user data is sent to third parties (other than the stock symbol requests to Yahoo).

## Calculation Formula

The present value of your compensation is calculated as:

```
Cash Compensation = Base Salary × (1 + Bonus Percentage)
RSU Shares = RSU Grant Amount ÷ Average Closing Price (Previous Month)
RSU Current Value = RSU Shares × Current Stock Price
Total Present Value = Cash Compensation + RSU Current Value
``` 
