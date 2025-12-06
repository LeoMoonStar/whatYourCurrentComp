'use client'

import { useState, FormEvent } from 'react'
import ResultModal from './ResultModal'

export interface CalculationResult {
  cashComp: number
  rsuShares: number
  rsuCurrentValue: number
  totalPresentValue: number
  rsuGainLoss: number
  rsuGainLossPercent: number
}

import { getStockPrices, getMonthlyAveragePrice } from '../actions/stock'

// ... existing interfaces ...

export default function CalculatorForm() {
  const [formData, setFormData] = useState({
    baseSalary: '',
    bonusPercentage: '',
    rsuGrantAmount: '',
    startDate: '',
    avgClosingPrice: '',
    currentStockPrice: '',
  })
  
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loadingCurrent, setLoadingCurrent] = useState(false)
  const [loadingHistorical, setLoadingHistorical] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    // ... existing handleSubmit ...
    e.preventDefault()
    
    const base = parseFloat(formData.baseSalary)
    const bonusPercent = parseFloat(formData.bonusPercentage) / 100
    const rsuGrant = parseFloat(formData.rsuGrantAmount)
    const avgPrice = parseFloat(formData.avgClosingPrice)
    const currentPrice = parseFloat(formData.currentStockPrice)

    // Validate inputs
    if (isNaN(base) || isNaN(bonusPercent) || isNaN(rsuGrant) || isNaN(avgPrice) || isNaN(currentPrice)) {
      alert('Please fill in all fields with valid numbers')
      return
    }

    // Calculate based on the formula:
    // present value = base*(1+bonus percentage) + (rsu/average closing price of previous month)*current stock price
    
    const cashComp = base * (1 + bonusPercent)
    const rsuShares = rsuGrant / avgPrice
    const rsuCurrentValue = rsuShares * currentPrice / 4
    const totalPresentValue = cashComp + rsuCurrentValue
    
    // Calculate gain/loss based on annual value comparison
    // rsuGrant is total 4 year amount, so we need to divide by 4 to compare with annual rsuCurrentValue
    const annualOriginalValue = rsuGrant / 4
    const rsuGainLoss = rsuCurrentValue - annualOriginalValue
    const rsuGainLossPercent = (rsuGainLoss / annualOriginalValue) * 100

    setResult({
      cashComp,
      rsuShares,
      rsuCurrentValue,
      totalPresentValue,
      rsuGainLoss,
      rsuGainLossPercent,
    })
    setShowModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const fetchCurrentPrice = async () => {
    setLoadingCurrent(true)
    setError(null)
    
    try {
      // Hardcoded to META as per project context
      const data = await getStockPrices('META')
      
      if (!data) {
        throw new Error('Failed to fetch current price. Please try again.')
      }
      
      setFormData({
        ...formData,
        currentStockPrice: data.close.toFixed(2),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current price')
    } finally {
      setLoadingCurrent(false)
    }
  }

  const fetchHistoricalPrice = async () => {
    if (!formData.startDate) {
      setError('Please enter your start date first')
      return
    }

    setLoadingHistorical(true)
    setError(null)
    
    try {
      const averagePrice = await getMonthlyAveragePrice('META', formData.startDate)
      
      if (averagePrice === null) {
        throw new Error('Failed to fetch historical data or calcuate average.')
      }
      
      setFormData({
        ...formData,
        avgClosingPrice: averagePrice.toFixed(2),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch historical price')
    } finally {
      setLoadingHistorical(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Base Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              id="baseSalary"
              name="baseSalary"
              value={formData.baseSalary}
              onChange={handleInputChange}
              placeholder="150000"
              className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Your annual base salary</p>
        </div>

        <div>
          <label htmlFor="bonusPercentage" className="block text-sm font-medium text-gray-700 mb-1">
            Bonus Percentage
          </label>
          <div className="relative">
            <input
              type="number"
              id="bonusPercentage"
              name="bonusPercentage"
              value={formData.bonusPercentage}
              onChange={handleInputChange}
              placeholder="15"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <span className="absolute right-3 top-2.5 text-gray-500">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Target bonus as percentage of base (e.g., 15 for 15%)</p>
        </div>

        <div>
          <label htmlFor="rsuGrantAmount" className="block text-sm font-medium text-gray-700 mb-1">
            RSU Grant Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              id="rsuGrantAmount"
              name="rsuGrantAmount"
              value={formData.rsuGrantAmount}
              onChange={handleInputChange}
              placeholder="300000"
              className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Total RSU dollar value from your offer letter</p>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date (Onboarding Date)
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Your Meta onboarding date (used to calculate previous month average)
          </p>
        </div>

        <div>
          <label htmlFor="avgClosingPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Average Closing Price (Previous Month)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                id="avgClosingPrice"
                name="avgClosingPrice"
                value={formData.avgClosingPrice}
                onChange={handleInputChange}
                placeholder="350.50"
                step="0.01"
                className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="button"
              onClick={fetchHistoricalPrice}
              disabled={loadingHistorical || !formData.startDate}
              className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {loadingHistorical ? 'Fetching...' : 'Auto-Fetch'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Average Meta stock price in the month before your start date
          </p>
        </div>

        <div>
          <label htmlFor="currentStockPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Current Stock Price
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                id="currentStockPrice"
                name="currentStockPrice"
                value={formData.currentStockPrice}
                onChange={handleInputChange}
                placeholder="380.75"
                step="0.01"
                className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="button"
              onClick={fetchCurrentPrice}
              disabled={loadingCurrent}
              className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {loadingCurrent ? 'Fetching...' : 'Auto-Fetch'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Current Meta stock price today</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Calculate Present Value
        </button>
      </form>

      {result && (
        <ResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          result={result}
          bonusPercentage={formData.bonusPercentage}
          avgPrice={formData.avgClosingPrice}
        />
      )}
    </>
  )
}

