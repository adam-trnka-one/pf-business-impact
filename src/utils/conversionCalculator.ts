
/**
 * Format a number as a currency string with $ sign and 2 decimal places
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

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
}

/**
 * Calculate revenue impact based on improved trial conversion rates
 */
export const calculateRevenueImpact = ({
  trialUsersPerMonth,
  trialConversionRate,
  averageRevenuePerUser,
  conversionRateUplift,
}: RevenueImpactParams): RevenueImpactResult => {
  // Current monthly conversions and revenue
  const currentMonthlyConversions = trialUsersPerMonth * trialConversionRate;
  const currentMonthlyRevenue = currentMonthlyConversions * averageRevenuePerUser;

  // Potential monthly conversions and revenue after uplift
  const potentialConversionRate = trialConversionRate * (1 + conversionRateUplift);
  const potentialMonthlyConversions = trialUsersPerMonth * potentialConversionRate;
  const potentialMonthlyRevenue = potentialMonthlyConversions * averageRevenuePerUser;

  // Increases
  const monthlyRevenueIncrease = potentialMonthlyRevenue - currentMonthlyRevenue;
  const netYearlyRevenueIncrease = monthlyRevenueIncrease * 12;

  return {
    currentMonthlyRevenue,
    potentialMonthlyRevenue,
    monthlyRevenueIncrease,
    netYearlyRevenueIncrease,
  };
};
