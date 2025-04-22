
/**
 * Calculates the ROI savings from implementing in-app support
 */
export interface ROIInputs {
  ticketsPerMonth: number;
  timePerTicket: number; // in minutes
  hourlyRate: number; // in USD
  ticketReduction: number; // percentage (0-100)
  userCount: number;
  monthlyPaymentTier: number;
}

export interface ROIResults {
  totalTimeSpent: number; // in hours
  totalCost: number; // in USD
  estimatedSavings: {
    monthly: number;
    annual: number;
  };
  potentialTicketsReduced: number;
  netSavings: {
    monthly: number;
    annual: number;
  };
}

export const calculateROI = (inputs: ROIInputs): ROIResults => {
  const { ticketsPerMonth, timePerTicket, hourlyRate, ticketReduction, userCount, monthlyPaymentTier } = inputs;
  
  // Calculate total time spent on tickets (converted to hours)
  const totalTimeSpent = (ticketsPerMonth * timePerTicket) / 60;
  
  // Calculate total cost before reduction
  const totalCost = totalTimeSpent * hourlyRate;
  
  // Calculate estimated savings
  const reductionFactor = ticketReduction / 100;
  const monthlySavings = totalCost * reductionFactor;

  // Calculate tickets per user (0.5 per user as specified)
  const expectedTicketsPerUser = 0.5;
  const potentialTicketsReduced = Math.round(userCount * expectedTicketsPerUser * reductionFactor);
  
  // Calculate net savings (savings minus monthly payment tier)
  const netMonthlySavings = monthlySavings - monthlyPaymentTier;
  
  return {
    totalTimeSpent,
    totalCost,
    estimatedSavings: {
      monthly: monthlySavings,
      annual: monthlySavings * 12
    },
    potentialTicketsReduced,
    netSavings: {
      monthly: netMonthlySavings,
      annual: netMonthlySavings * 12
    }
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

/**
 * Formats hours as a readable string
 */
export const formatHours = (hours: number): string => {
  return `${Math.round(hours).toLocaleString()} hrs`;
};
