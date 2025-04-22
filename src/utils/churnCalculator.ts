/**
 * Calculates the ROI from reducing customer churn
 */
export interface ChurnInputs {
  customerCount: number;
  averageRevenuePerCustomer: number;
  currentChurnRate: number; // percentage (0-1)
  potentialChurnReduction: number; // percentage (0-1)
}

export interface ChurnResults {
  currentChurnRate: number;
  reducedChurnRate: number;
  monthlySavings: number;
  annualSavings: number;
  roi: number;
}

export const calculateROI = (inputs: ChurnInputs): ChurnResults => {
  const { customerCount, averageRevenuePerCustomer, currentChurnRate, potentialChurnReduction } = inputs;

  // Calculate reduced churn rate
  const reducedChurnRate = currentChurnRate * (1 - potentialChurnReduction);

  // Calculate the number of customers retained due to churn reduction
  const retainedCustomers = customerCount * (currentChurnRate - reducedChurnRate);

  // Calculate monthly savings
  const monthlySavings = retainedCustomers * averageRevenuePerCustomer;

  // Calculate annual savings
  const annualSavings = monthlySavings * 12;

  // Calculate ROI (Return on Investment)
  const roi = annualSavings / (customerCount * averageRevenuePerCustomer * currentChurnRate * 12);

  return {
    currentChurnRate,
    reducedChurnRate,
    monthlySavings,
    annualSavings,
    roi
  };
};

/**
 * Formats a number as a currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a number with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};
