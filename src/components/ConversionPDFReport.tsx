import React from "react";

interface ConversionPDFData {
  monthlyTrials: number;
  currentConversion: number;
  conversionUplift: number;
  monthlyArpu: number;
  results: {
    additionalConversions: number;
    originalConversions: number;
    newConversions: number;
    monthlyRevenue: number;
    annualRevenue: number;
  };
  productFruitsPlanPrice: number;
}

const ConversionPDFReport: React.FC<ConversionPDFData> = ({
  monthlyTrials,
  currentConversion,
  conversionUplift,
  monthlyArpu,
  results,
  productFruitsPlanPrice
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

  const netMonthlyRevenue = results.monthlyRevenue - productFruitsPlanPrice;
  const yearlyNetRevenue = netMonthlyRevenue * 12;

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
            className="block w-full px-6 py-3 hover:bg-gray-50 transition-colors text-center"
          >
            <span className="text-gray-500 font-medium text-sm">Support cost reduction</span>
          </a>
        </div>
        <div className="flex-1">
          <a 
            href="https://productfruits.com/roi-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors text-center"
          >
            <span className="text-orange-600 font-medium text-sm leading-none">Revenue uplift</span>
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
            Clients using Product Fruits see a <strong>30% improvement</strong> in trial-to-paid conversion rates after implementing automated onboarding.
          </p>
        </div>
        <div className="mt-2"></div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        {/* Left column - Your data */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-black mb-2">Your data</h2>
          <p className="text-gray-500 text-sm mb-6">We'll use this to calculate your business impact</p>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Monthly trial signups</span>
              <span className="font-medium">{formatNumber(monthlyTrials)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Current conversion rate (%)</span>
              <span className="font-medium">{currentConversion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Monthly ARPU (USD)</span>
              <span className="font-medium">{Math.round(monthlyArpu)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Expected conversion uplift (%)</span>
              <span className="font-medium">{conversionUplift}</span>
            </div>
          </div>
        </div>

        {/* Right column - Your conversion gains */}
        <div className="bg-orange-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-black mb-2">Your conversion gains</h2>
          <p className="text-gray-500 text-sm mb-6">Based on your data, here's the business impact of Product Fruits</p>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Incremental monthly conversions</span>
              <span className="font-medium">{formatNumber(results.additionalConversions)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Monthly revenue increase</span>
              <span className="font-medium">{formatCurrency(results.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Product Fruits monthly cost</span>
              <span className="font-medium text-red-600">-{formatCurrency(productFruitsPlanPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Incremental net monthly revenue</span>
              <span className="font-medium">{formatCurrency(netMonthlyRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main result section */}
      <div className="text-center mb-16">
        <h2 className="text-2xl text-gray-500 mb-4">Your yearly net revenue increase</h2>
        <p className="text-6xl font-bold text-green-500">
          {formatCurrency(yearlyNetRevenue)}
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

export default ConversionPDFReport;
