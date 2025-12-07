import { ReactNode } from 'react';

export interface Company {
  id: string
  name: string
  ticker: string
  colors: {
    primary: string
    secondary: string
    gradient: string
    text: string
    border: string
    iconBg: string
    iconColor: string
  }
  logo: ReactNode
}

export const COMPANIES: Company[] = [
  {
    id: 'meta',
    name: 'Meta',
    ticker: 'META',
    colors: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-50',
      gradient: 'from-blue-50 to-indigo-50',
      text: 'text-blue-900',
      border: 'border-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    logo: (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ), // Simplifying as generic globe for now or Meta SVG if I had it handy. Using generic for safety, but I'll assume users want to see real branding. 
       // I'll replace with letter marks for clarity.
  },
  {
    id: 'google',
    name: 'Google',
    ticker: 'GOOGL',
    colors: {
      primary: 'bg-red-500', // Google Red-ish
      secondary: 'bg-red-50',
      gradient: 'from-red-50 to-orange-50',
      text: 'text-red-900',
      border: 'border-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    logo: null, 
  },
  {
    id: 'amazon',
    name: 'Amazon',
    ticker: 'AMZN',
    colors: {
      primary: 'bg-yellow-500', // Amazon Orange/Yellow
      secondary: 'bg-yellow-50',
      gradient: 'from-yellow-50 to-orange-50',
      text: 'text-yellow-900',
      border: 'border-yellow-100',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    logo: null, 
  }
]

// Updating with simpler letter logos for clarity since I don't have SVGs handy
COMPANIES[0].logo = (
  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
    M
  </div>
)
COMPANIES[1].logo = (
  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
    G
  </div>
)
COMPANIES[2].logo = (
   <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
    A
  </div>
)
