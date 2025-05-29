
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
    <div className="w-[794px] h-[1123px] bg-white p-8 font-sans text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header with Logo */}
      <div className="flex items-center mb-8">
        <img 
          src="https://productfruits.com/images/pf_logo.svg" 
          alt="ProductFruits Logo"
          className="h-8 w-auto"
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#FF751D] mb-2">
          Your user retention gains
        </h1>
        <p className="text-gray-600 text-sm">
          Generated on {today}
        </p>
      </div>

      {/* Business Information Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Your Business Information
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Number of customers:</span>
            <span className="font-medium">{formatNumber(customerCount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Average revenue per customer:</span>
            <span className="font-medium">${averageRevenuePerCustomer}/month</span>
          </div>
          <div className="flex justify-between">
            <span>Current churn rate:</span>
            <span className="font-medium">{currentChurnRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>Projected churn reduction:</span>
            <span className="font-medium">30%</span>
          </div>
        </div>
      </div>

      {/* Business Impact Results */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Business Impact Results
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Saved customers:</span>
            <span className="font-medium">{formatNumber(savedCustomers)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Monthly revenue saved:</span>
            <span className="font-medium">{formatCurrency(results.monthlySavings)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Product Fruits monthly cost:</span>
            <span className="font-medium text-red-600">-{formatCurrency(productFruitsPlanPrice)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Net monthly revenue increase:</span>
            <span className="font-medium">{formatCurrency(netMonthlyRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Annual Summary - Highlighted */}
      <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-black">
          Annual Net Revenue Increase
        </h3>
        <p className="text-4xl font-bold text-[#03BF92]">
          {formatCurrency(yearlyNetRevenue)}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-gray-500">
          www.productfruits.com
        </p>
      </div>
    </div>
  );
};

export default PDFReport;
