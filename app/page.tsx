import CalculatorForm from './components/CalculatorForm'
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Meta Compensation Calculator
          </h1>
          <p className="text-slate-600 text-lg">
            Realize the true value of your offer
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-blue-600 p-6 sm:p-8 text-white">
            <h2 className="text-xl font-bold mb-2">How it works</h2>
            <p className="text-blue-100 leading-relaxed opacity-90">
              Your RSUs are calculated using the previous month's average closing price. 
              We'll help you fetch that historical data automatically to see what your package is worth today.
            </p>
          </div>
          
          <div className="p-6 sm:p-8">
            <CalculatorForm />
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Not affiliated with Meta Platforms, Inc.</p>
        </div>
      </div>
    </main>
  )
}

