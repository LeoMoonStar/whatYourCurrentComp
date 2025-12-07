export interface CalculationInput {
  baseSalary: number
  bonusPercentage: number
  rsuGrantAmount: number
  avgClosingPrice: number
  currentStockPrice: number
}

export interface CalculationResult {
  cashComp: number
  rsuShares: number
  rsuCurrentValue: number
  totalPresentValue: number
  rsuGainLoss: number
  rsuGainLossPercent: number
}

export function calculatePackage(input: CalculationInput): CalculationResult {
  const { baseSalary, bonusPercentage, rsuGrantAmount, avgClosingPrice, currentStockPrice } = input;

  const cashComp = baseSalary * (1 + bonusPercentage);
  const rsuShares = rsuGrantAmount / avgClosingPrice;
  
  // Vesting logic: Standard 4-year vest (25% per year)
  // We calculate the *current annual value* based on 1/4th vesting
  const rsuCurrentValue = (rsuShares * currentStockPrice) / 4;
  
  const totalPresentValue = cashComp + rsuCurrentValue;

  // Gain/Loss comparison
  // Annual grant value vs Current annual value
  const annualOriginalValue = rsuGrantAmount / 4;
  const rsuGainLoss = rsuCurrentValue - annualOriginalValue;
  const rsuGainLossPercent = (rsuGainLoss / annualOriginalValue) * 100;

  return {
    cashComp,
    rsuShares,
    rsuCurrentValue,
    totalPresentValue,
    rsuGainLoss,
    rsuGainLossPercent
  };
}
