import { useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { CalculationResult } from '../lib/calculations'
import { Company } from '../lib/companies'

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: CalculationResult
  bonusPercentage: string
  avgPrice: string
  startDate: string
  company: Company
}

export default function ResultModal({ isOpen, onClose, result, bonusPercentage, avgPrice, startDate, company }: ResultModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Use company colors, fallback to conditional colors for gain/loss text only
  const theme = company.colors; // Use company theme for structure
  const isPositive = result.rsuGainLoss >= 0
  const trendColor = isPositive ? 'text-green-600' : 'text-red-500'

  const handleDownload = useCallback(async () => {
    // ... existing handleDownload logic ...
    if (cardRef.current === null) {
      return
    }

    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true })
      const link = document.createElement('a')
      link.download = `${company.id}-package-analysis.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to download image', err)
    }
  }, [cardRef, company.id])

  if (!isOpen) return null

  // ... formatting functions ...
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatShares = (shares: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(shares)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header / Actions */}
        <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={handleDownload}
            className={`mr-2 px-4 py-2 text-sm font-medium ${theme.text} ${theme.secondary} hover:${theme.primary} hover:text-white rounded-full transition-colors flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Save Image
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Sharable Content Area */}
        <div ref={cardRef} className="bg-white p-8 md:p-10 text-center">
            
          {/* Header with Company Logo */}
          <div className="mb-8">
            <div className={`w-16 h-16 ${theme.iconBg} ${theme.iconColor} rounded-full flex items-center justify-center mx-auto mb-4 p-2`}>
              {company.logo}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {company.name} Offer Analysis
            </h2>
            <div className="inline-block mt-2 px-4 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
               Offer Start Date: {startDate}
            </div>
          </div>

          {/* Main Hero Number */}
          <div className={`mb-10 p-6 bg-gradient-to-tr ${theme.gradient} rounded-2xl border ${theme.border}`}>
            <div className={`text-sm font-semibold ${theme.text} uppercase tracking-wider mb-2 opacity-80`}>
              Present Annual Value
            </div>
            <div className={`text-4xl md:text-5xl font-extrabold ${theme.text} tracking-tight`}>
              {formatCurrency(result.totalPresentValue)}
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cash Comp</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(result.cashComp)}</div>
              <div className="text-xs text-gray-400 mt-1">Base + {bonusPercentage}% Bonus</div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">RSU Value</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(result.rsuCurrentValue)}</div>
              <div className={`text-xs font-medium mt-1 ${trendColor}`}>
                {result.rsuGainLoss >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(result.rsuGainLoss))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Shares</div>
              <div className="text-xl font-bold text-gray-900">{formatShares(result.rsuShares)}</div>
              <div className="text-xs text-gray-400 mt-1">@ ${avgPrice} avg</div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Generated by Package Calculator</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
