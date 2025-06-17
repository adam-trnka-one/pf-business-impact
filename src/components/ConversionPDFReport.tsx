
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

  return (
    <div className="w-full h-full bg-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Revenue Uplift Calculation Report
          </h1>
          <p className="text-lg text-gray-600">
            Business Impact Analysis with Product Fruits
          </p>
        </div>

        {/* Input Parameters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Input Parameters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Monthly trial signups</p>
              <p className="text-lg font-medium">{formatNumber(monthlyTrials)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current conversion rate</p>
              <p className="text-lg font-medium">{currentConversion}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Expected conversion uplift</p>
              <p className="text-lg font-medium">{conversionUplift}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Monthly ARPU</p>
              <p className="text-lg font-medium">{formatCurrency(monthlyArpu)}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversion Impact Analysis</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Original monthly conversions</span>
              <span className="font-medium">{formatNumber(results.originalConversions)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">New monthly conversions</span>
              <span className="font-medium">{formatNumber(results.newConversions)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Incremental monthly conversions</span>
              <span className="font-medium">{formatNumber(results.additionalConversions)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Monthly recurring revenue increase</span>
              <span className="font-medium">{formatCurrency(results.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Product Fruits monthly cost</span>
              <span className="font-medium text-red-600">-{formatCurrency(productFruitsPlanPrice)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Net monthly revenue increase</span>
              <span className="font-medium">{formatCurrency(results.monthlyRevenue - productFruitsPlanPrice)}</span>
            </div>
          </div>
        </div>

        {/* Key Results */}
        <div className="text-center mb-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Net Yearly Revenue Increase</h3>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency((results.monthlyRevenue - productFruitsPlanPrice) * 12)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            This report was generated on {new Date().toLocaleDateString()} using Product Fruits ROI Calculator
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversionPDFReport;
