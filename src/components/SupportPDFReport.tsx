
import React from "react";

interface SupportPDFReportProps {
  ticketsPerMonth: number;
  timePerTicket: number;
  hourlyRate: number;
  ticketReduction: number;
  userCount: number;
  results: {
    totalTimeSpent: number;
    totalCost: number;
    estimatedSavings: {
      monthly: number;
      annual: number;
    };
    potentialTicketsReduced: number;
    netSavings: {
      monthly: number;
      annual: number;
    };
  };
  monthlyPaymentTier: number;
}

const SupportPDFReport: React.FC<SupportPDFReportProps> = ({
  ticketsPerMonth,
  timePerTicket,
  hourlyRate,
  ticketReduction,
  userCount,
  results,
  monthlyPaymentTier
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div className="w-[794px] h-[1123px] bg-white p-16 font-sans text-black relative" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header with Logo */}
      <div className="flex items-center mb-12">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/f56fab7a-3f0d-438f-a019-9cb8a25174e7.png" 
            alt="ProductFruits Logo" 
            className="h-12"
          />
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl font-bold text-black mb-4">
        Business impact calculator - results
      </h1>
      
      <p className="text-gray-600 text-base mb-12">
        Poor onboarding doesn't just frustrate users. It costs you in churn, conversions, and support overhead.
      </p>

      {/* Tab indicators */}
      <div className="flex gap-8 mb-10">
        <div className="flex-1">
          <a 
            href="https://productfruits.com/roi-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 hover:bg-gray-50 transition-colors text-center"
          >
            <span className="text-gray-500 font-medium text-sm">Churn reduction</span>
          </a>
        </div>
        <div className="flex-1">
          <a 
            href="https://productfruits.com/roi-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors text-center"
          >
            <span className="text-orange-600 font-medium text-sm leading-none">Support cost reduction</span>
          </a>
        </div>
        <div className="flex-1">
          <a 
            href="https://productfruits.com/roi-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 hover:bg-gray-50 transition-colors text-center"
          >
            <span className="text-gray-500 font-medium text-sm">Revenue uplift</span>
          </a>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-12">
        <div className="flex items-center">
          <div className="bg-green-100 rounded-full p-2 mr-3">
            <span className="text-green-600">i</span>
          </div>
          <p className="text-green-800 text-sm">
            Clients using Product Fruits see a <strong>20-35% reduction</strong> in support tickets after implementing automated user onboarding.
          </p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        {/* Left column - Your data */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-black mb-2">Your data</h2>
          <p className="text-gray-500 text-sm mb-6">We'll use this to calculate your business impact</p>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Support tickets per month</span>
              <span className="font-medium">{formatNumber(ticketsPerMonth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Time per ticket (minutes)</span>
              <span className="font-medium">{timePerTicket}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Hourly rate (USD)</span>
              <span className="font-medium">{Math.round(hourlyRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Expected ticket reduction (%)</span>
              <span className="font-medium">{ticketReduction}</span>
            </div>
          </div>
        </div>

        {/* Right column - Your support cost savings */}
        <div className="bg-orange-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-black mb-2">Your support cost savings</h2>
          <p className="text-gray-500 text-sm mb-6">Based on your data, here's the business impact of Product Fruits</p>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Monthly decrease in support tickets</span>
              <span className="font-medium">{results.potentialTicketsReduced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Support cost monthly savings</span>
              <span className="font-medium">{formatCurrency(results.estimatedSavings.monthly)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Product Fruits monthly cost</span>
              <span className="font-medium text-red-600">-{formatCurrency(monthlyPaymentTier)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Net monthly savings</span>
              <span className="font-medium">{formatCurrency(results.netSavings.monthly)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main result section */}
      <div className="text-center mb-16">
        <h2 className="text-2xl text-gray-500 mb-4">Your yearly net savings</h2>
        <p className="text-6xl font-bold text-green-500">
          {formatCurrency(results.netSavings.annual)}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-600">
          Speak with our specialist about your use case today. Reserve demo: https://productfruits.com/demo
        </p>
      </div>
    </div>
  );
};

export default SupportPDFReport;
