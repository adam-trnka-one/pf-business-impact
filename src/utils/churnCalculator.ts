
/**
 * Calculates the churn reduction metrics
 */
export interface ChurnInputs {
  totalCustomers: number;
  monthlyChurnRate: number; // percentage (0-100)
  churnReduction: number; // percentage (0-100)
  averageRevenue: number; // $ per customer per month
}

export interface ChurnResults {
  churnedCustomers: number;
  revenueLost: number;
  potentialCustomersSaved: number;
  potentialRevenueSaved: {
    monthly: number;
    annual: number;
  };
}

export const calculateChurn = (inputs: ChurnInputs): ChurnResults => {
  const { totalCustomers, monthlyChurnRate, churnReduction, averageRevenue } = inputs;
  
  // Calculate churned customers per month
  const churnedCustomers = Math.round(totalCustomers * (monthlyChurnRate / 100));
  
  // Calculate monthly revenue lost to churn
  const revenueLost = churnedCustomers * averageRevenue;
  
  // Calculate potential customers saved with churn reduction
  const potentialCustomersSaved = Math.round(churnedCustomers * (churnReduction / 100));
  
  // Calculate potential revenue saved
  const monthlySavings = potentialCustomersSaved * averageRevenue;
  
  return {
    churnedCustomers,
    revenueLost,
    potentialCustomersSaved,
    potentialRevenueSaved: {
      monthly: monthlySavings,
      annual: monthlySavings * 12
    }
  };
};
