import CalculatorForm from './components/CalculatorForm'

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Meta Compensation Calculator
          </h1>
          <p className="text-gray-600">
            Calculate the real present value of your Meta compensation package
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h2>
            <p className="text-sm text-blue-800 mb-2">
              Your RSUs are granted based on the average closing price of Meta stock 
              during the previous month of your onboarding date. This calculator helps 
              you understand the real value of your package based on today's stock price.
            </p>
            <p className="text-sm text-blue-800 font-medium">
              ✨ Use the "Auto-Fetch" buttons to automatically retrieve real-time Meta stock prices!
            </p>
          </div>
          
          <CalculatorForm />
        </div>
      </div>
    </main>
  )
}

