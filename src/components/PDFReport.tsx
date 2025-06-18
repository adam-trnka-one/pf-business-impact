import React from "react";
import { formatCurrency, formatNumber } from "@/utils/churnCalculator";

interface PDFReportProps {
  customerCount: number;
  averageRevenuePerCustomer: number;
  currentChurnRate: number;
  results: {
    monthlySavings: number;
  };
  productFruitsPlanPrice: number;
}

const PDFReport: React.FC<PDFReportProps> = ({
  customerCount,
  averageRevenuePerCustomer,
  currentChurnRate,
  results,
  productFruitsPlanPrice
}) => {
  const savedCustomers = Math.round(customerCount * currentChurnRate / 100 * 0.3);
  const netMonthlyRevenue = results.monthlySavings - productFruitsPlanPrice;
  const yearlyNetRevenue = netMonthlyRevenue * 12;
  const churnReduction = 30;

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
      <div className="flex mb-10">
        <div className="flex-1">
          <a 
            href="https://productfruits.com/roi-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors text-center h-12 flex items-center justify-center"
          >
            <span className="text-orange-600 font-medium text-sm">Churn reduction</span>
          </a>
        </div>
        <div className="flex-1">
          <a 
            href="https://productfruits.com/roi-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 hover:bg-gray-50 transition-colors text-center h-12 flex items-center justify-center"
          >
            <span className="text-gray-500 font-medium text-sm">Support cost reduction</span>
          </a>
        </div>
        <div className="flex-1">
          <a 
            href="https://productfruits.com/roi-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 hover:bg-gray-50 transition-colors text-center h-12 flex items-center justify-center"
          >
            <span className="text-gray-500 font-medium text-sm">Revenue uplift</span>
          </a>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-12">
        <div className="flex items-center">
          <p className="text-green-800 text-sm">
            Clients using Product Fruits see a <strong>30-70% reduction</strong> in customer churn after implementing automated onboarding.
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
              <span className="text-gray-700">Number of customers</span>
              <span className="font-medium">{formatNumber(customerCount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Average revenue per customer (USD/month)</span>
              <span className="font-medium">{Math.round(averageRevenuePerCustomer)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Current churn rate (%)</span>
              <span className="font-medium">{currentChurnRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Estimated churn reduction (%)</span>
              <span className="font-medium">{churnReduction}</span>
            </div>
          </div>
        </div>

        {/* Right column - Your user retention gains */}
        <div className="bg-orange-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-black mb-2">Your user retention gains</h2>
          <p className="text-gray-500 text-sm mb-6">Based on your data, here's the business impact of Product Fruits</p>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Saved customers</span>
              <span className="font-medium">{savedCustomers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Revenue saved monthly</span>
              <span className="font-medium">{formatCurrency(results.monthlySavings)}</span>
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

export default PDFReport;
