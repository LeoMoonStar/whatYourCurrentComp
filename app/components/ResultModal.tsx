'use client'

import { useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { CalculationResult } from './CalculatorForm'

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: CalculationResult
  bonusPercentage: string
  avgPrice: string
}

export default function ResultModal({ isOpen, onClose, result, bonusPercentage, avgPrice }: ResultModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isPositive = result.rsuGainLoss >= 0

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) {
      return
    }

    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true })
      const link = document.createElement('a')
      link.download = 'meta-package-analysis.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to download image', err)
    }
  }, [cardRef])

  if (!isOpen) return null

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

  const theme = isPositive ? {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    heroGradient: 'from-green-50 to-emerald-50',
    heroBorder: 'border-green-100',
    heroText: 'text-green-900',
    heroLabel: 'text-green-800',
  } : {
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    heroGradient: 'from-orange-50 to-amber-50',
    heroBorder: 'border-orange-100',
    heroText: 'text-orange-900',
    heroLabel: 'text-orange-800',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header / Actions */}
        <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={handleDownload}
            className="mr-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors flex items-center gap-2"
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
            
          {/* LinkedIn "New Position" Vibe Header */}
          <div className="mb-8">
            <div className={`w-16 h-16 ${theme.iconBg} ${theme.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {isPositive ? 'Congratulations!' : "Don't Worry, It's Cyclic"}
            </h2>
            <p className="text-gray-500 text-lg">
              {isPositive ? "Your package has grown significantly" : "Markets fluctuate. Your package is still strong."}
            </p>
          </div>

          {/* Main Hero Number */}
          <div className={`mb-10 p-6 bg-gradient-to-tr ${theme.heroGradient} rounded-2xl border ${theme.heroBorder}`}>
            <div className={`text-sm font-semibold ${theme.heroLabel} uppercase tracking-wider mb-2`}>
              Present Annual Value
            </div>
            <div className={`text-4xl md:text-5xl font-extrabold ${theme.heroText} tracking-tight`}>
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
              <div className={`text-xs font-medium mt-1 ${result.rsuGainLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
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
            <span>Generated by Meta Package Calculator</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
