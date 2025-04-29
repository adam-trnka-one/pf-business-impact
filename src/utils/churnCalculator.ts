
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
  const { 
    customerCount, 
    averageRevenuePerCustomer, 
    currentChurnRate,  // Now this will be a percentage value
    potentialChurnReduction 
  } = inputs;

  // Convert percentage to decimal
  const churnRateDecimal = currentChurnRate / 100;
  const reducedChurnRateDecimal = churnRateDecimal * (1 - potentialChurnReduction);

  // Calculate the number of customers retained due to churn reduction
  const retainedCustomers = customerCount * (churnRateDecimal - reducedChurnRateDecimal);

  // Calculate monthly savings
  const monthlySavings = retainedCustomers * averageRevenuePerCustomer;

  // Calculate annual savings
  const annualSavings = monthlySavings * 12;

  // Calculate ROI (Return on Investment)
  const roi = annualSavings / (customerCount * averageRevenuePerCustomer * churnRateDecimal * 12);

  return {
    currentChurnRate,
    reducedChurnRate: reducedChurnRateDecimal * 100,
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

/**
 * Submits data to Customer.io
 */
export const submitToCustomerIO = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
}): Promise<boolean> => {
  try {
    // In a real implementation, this would be an API call to Customer.io
    // For now, we'll simulate a successful API call
    console.log("Submitting to Customer.io:", data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return success
    return true;
  } catch (error) {
    console.error("Error submitting to Customer.io:", error);
    return false;
  }
};
