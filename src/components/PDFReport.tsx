
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
  const today = new Date().toLocaleDateString();

  return (
    <div className="w-[794px] h-[1123px] bg-gray-50 p-12 font-sans text-black relative overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header with Logo */}
      <div className="flex items-center mb-12">
        <img 
          src="https://productfruits.com/images/pf_logo.svg" 
          alt="ProductFruits Logo"
          className="h-12 w-auto"
          style={{ maxHeight: '48px', width: 'auto' }}
          crossOrigin="anonymous"
        />
      </div>

      {/* Main Title Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your Yearly Net Revenue Increase
        </h1>
        <p className="text-gray-600 text-lg">
          ROI Analysis Report - Generated on {today}
        </p>
      </div>

      {/* Layered Design Section */}
      <div className="relative mb-16">
        {/* Layer 1 - Top Yellow/Orange */}
        <div className="relative mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-l-full h-24 flex items-center relative overflow-hidden"
               style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}>
            <div className="flex items-center ml-8">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-gray-800 mr-6">
                01
              </div>
              <div className="text-white font-medium">
                <div className="text-sm opacity-90">Monthly Revenue Saved</div>
                <div className="text-xl font-bold">{formatCurrency(results.monthlySavings)}</div>
              </div>
            </div>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 rounded-full w-8 h-8"></div>
          </div>
        </div>

        {/* Layer 2 - Middle Orange */}
        <div className="relative mb-4">
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-l-full h-24 flex items-center relative overflow-hidden"
               style={{ clipPath: 'polygon(0 0, 90% 0, 95% 100%, 0 100%)' }}>
            <div className="flex items-center ml-8">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-gray-800 mr-6">
                02
              </div>
              <div className="text-white font-medium">
                <div className="text-sm opacity-90">Product Fruits Cost</div>
                <div className="text-xl font-bold">-{formatCurrency(productFruitsPlanPrice)}</div>
              </div>
            </div>
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 rounded-full w-8 h-8"></div>
          </div>
        </div>

        {/* Layer 3 - Bottom Pink/Red */}
        <div className="relative">
          <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-l-full h-24 flex items-center relative overflow-hidden"
               style={{ clipPath: 'polygon(0 0, 95% 0, 90% 100%, 0 100%)' }}>
            <div className="flex items-center ml-8">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-gray-800 mr-6">
                03
              </div>
              <div className="text-white font-medium">
                <div className="text-sm opacity-90">Net Monthly Increase</div>
                <div className="text-xl font-bold">{formatCurrency(netMonthlyRevenue)}</div>
              </div>
            </div>
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 rounded-full w-8 h-8"></div>
          </div>
        </div>
      </div>

      {/* Annual Summary - Highlighted Box */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-12 border-l-4 border-green-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Annual Net Revenue Increase
        </h2>
        <p className="text-5xl font-bold text-green-600 mb-4">
          {formatCurrency(yearlyNetRevenue)}
        </p>
        <p className="text-gray-600">
          Based on {formatNumber(savedCustomers)} customers retained through improved user experience
        </p>
      </div>

      {/* Business Metrics Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Business Metrics</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Customers:</span>
            <span className="font-medium">{formatNumber(customerCount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Revenue/Customer:</span>
            <span className="font-medium">${averageRevenuePerCustomer}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Churn Rate:</span>
            <span className="font-medium">{currentChurnRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Churn Reduction:</span>
            <span className="font-medium">30%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          www.productfruits.com | Your partner in user retention
        </p>
      </div>
    </div>
  );
};

export default PDFReport;
