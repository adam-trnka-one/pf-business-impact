
/**
 * Formats a number as a currency string
 * @param value The value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string): string => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Calculate the revenue impact of improving trial conversion rates
 */
interface RevenueImpactParams {
  trialUsersPerMonth: number;
  trialConversionRate: number;
  averageRevenuePerUser: number;
  conversionRateUplift: number;
}

interface RevenueImpactResult {
  currentMonthlyRevenue: number;
  potentialMonthlyRevenue: number;
  monthlyRevenueIncrease: number;
  netYearlyRevenueIncrease: number;
  additionalConversionsPerMonth: number;
}

export const calculateRevenueImpact = ({
  trialUsersPerMonth,
  trialConversionRate,
  averageRevenuePerUser,
  conversionRateUplift,
}: RevenueImpactParams): RevenueImpactResult => {
  // Calculate current monthly conversions
  const currentMonthlyConversions = trialUsersPerMonth * trialConversionRate;
  
  // Calculate current monthly revenue
  const currentMonthlyRevenue = currentMonthlyConversions * averageRevenuePerUser;
  
  // Calculate new conversion rate with uplift
  const newConversionRate = trialConversionRate * (1 + conversionRateUplift);
  
  // Calculate potential monthly conversions with improved rate
  const potentialMonthlyConversions = trialUsersPerMonth * newConversionRate;
  
  // Calculate additional conversions per month
  const additionalConversionsPerMonth = potentialMonthlyConversions - currentMonthlyConversions;
  
  // Calculate potential monthly revenue
  const potentialMonthlyRevenue = potentialMonthlyConversions * averageRevenuePerUser;
  
  // Calculate monthly revenue increase
  const monthlyRevenueIncrease = potentialMonthlyRevenue - currentMonthlyRevenue;
  
  // Calculate yearly revenue increase
  const yearlyRevenueIncrease = monthlyRevenueIncrease * 12;
  
  // Net yearly revenue increase (same as yearly for now, can add costs later)
  const netYearlyRevenueIncrease = yearlyRevenueIncrease;
  
  return {
    currentMonthlyRevenue,
    potentialMonthlyRevenue,
    monthlyRevenueIncrease,
    netYearlyRevenueIncrease,
    additionalConversionsPerMonth,
  };
};
