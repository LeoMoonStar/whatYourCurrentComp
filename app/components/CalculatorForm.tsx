'use client'

import { useState, FormEvent } from 'react'
import ResultModal from './ResultModal'
import { getStockPrices, getMonthlyAveragePrice } from '../actions/stock'
import { COMPANIES, Company } from '../lib/companies'
import { calculatePackage, CalculationResult } from '../lib/calculations'

export default function CalculatorForm() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(COMPANIES[0])
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

    const calcResult = calculatePackage({
      baseSalary: base,
      bonusPercentage: bonusPercent,
      rsuGrantAmount: rsuGrant,
      avgClosingPrice: avgPrice,
      currentStockPrice: currentPrice
    });

    setResult(calcResult)
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
      const data = await getStockPrices(selectedCompany.ticker)
      
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
      const averagePrice = await getMonthlyAveragePrice(selectedCompany.ticker, formData.startDate)
      
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        {/* Company Selection Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Company</label>
          <div className="relative">
            <select
              value={selectedCompany.id}
              onChange={(e) => {
                const company = COMPANIES.find(c => c.id === e.target.value);
                if (company) setSelectedCompany(company);
              }}
              className="w-full px-4 py-3 pl-14 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer font-medium text-gray-900"
            >
              {COMPANIES.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} ({comp.ticker})
                </option>
              ))}
            </select>
            {/* Logo positioned absolutely on the left */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {selectedCompany.logo}
            </div>
            {/* Dropdown arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Compensation Details</h3>
          </div>

          <div>
            <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Base Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="baseSalary"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleInputChange}
                placeholder="150000"
                className="pl-8 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
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
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <span className="absolute right-4 top-2.5 text-gray-500 font-medium">%</span>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="rsuGrantAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Total RSU Grant
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="rsuGrantAmount"
                name="rsuGrantAmount"
                value={formData.rsuGrantAmount}
                onChange={handleInputChange}
                placeholder="300000"
                className="pl-8 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Value from your offer letter (4-year total)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
           <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Comparison Data</h3>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
             <label htmlFor="avgClosingPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Historical Avg (Start Price)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  id="avgClosingPrice"
                  name="avgClosingPrice"
                  value={formData.avgClosingPrice}
                  onChange={handleInputChange}
                  placeholder="350.50"
                  step="0.01"
                  className="pl-8 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="button"
                onClick={fetchHistoricalPrice}
                disabled={loadingHistorical || !formData.startDate}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {loadingHistorical ? '...' : 'Fetch'}
              </button>
            </div>
             <p className="mt-1 text-xs text-gray-500">
              For {selectedCompany.ticker}
            </p>
          </div>

          <div>
            <label htmlFor="currentStockPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Current Stock Price
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  id="currentStockPrice"
                  name="currentStockPrice"
                  value={formData.currentStockPrice}
                  onChange={handleInputChange}
                  placeholder="380.75"
                  step="0.01"
                  className="pl-8 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="button"
                onClick={fetchCurrentPrice}
                disabled={loadingCurrent}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {loadingCurrent ? '...' : 'Fetch'}
              </button>
            </div>
             <p className="mt-1 text-xs text-gray-500">
              For {selectedCompany.ticker}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5"
        >
          Calculate Analysis
        </button>
      </form>

      {result && (
        <ResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          result={result}
          bonusPercentage={formData.bonusPercentage}
          avgPrice={formData.avgClosingPrice}
          startDate={formData.startDate}
          company={selectedCompany}
        />
      )}
    </>
  )
}

