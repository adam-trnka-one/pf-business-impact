
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/churnCalculator";
import { generateAndDownloadPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import ChurnResultsChart from "./ChurnResultsChart";

interface ChurnCalculatorResultsProps {
  customerCount: number;
  currentChurnRate: number;
  results: {
    currentChurnRate: number;
    reducedChurnRate: number;
    monthlySavings: number;
    annualSavings: number;
    roi: number;
  } | null;
  productFruitsPlanPrice: number;
}

const ChurnCalculatorResults: React.FC<ChurnCalculatorResultsProps> = ({
  customerCount,
  currentChurnRate,
  results,
  productFruitsPlanPrice
}) => {
  const handleDownloadPDF = async () => {
    if (!results) {
      toast.error("No results to export");
      return;
    }

    try {
      await generateAndDownloadPDF({
        customerCount,
        averageRevenuePerCustomer: 50, // This should be passed as prop if needed
        currentChurnRate,
        results,
        productFruitsPlanPrice
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  if (!results) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <p className="text-gray-500">Enter your data to see the results</p>
      </div>
    );
  }

  const netMonthlyIncrease = results.monthlySavings - productFruitsPlanPrice;
  const netAnnualIncrease = netMonthlyIncrease * 12;
  const savedCustomers = Math.round(customerCount * currentChurnRate / 100 * 0.3);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Your Results</h2>
      
      <div className="space-y-6">
        {/* Monthly Savings */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Monthly Revenue Saved</h3>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(results.monthlySavings)}</p>
          <p className="text-sm text-blue-600 mt-1">
            From retaining {formatNumber(savedCustomers)} customers
          </p>
        </div>

        {/* ProductFruits Cost */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-orange-900 mb-2">ProductFruits Monthly Cost</h3>
          <p className="text-2xl font-bold text-orange-700">{formatCurrency(productFruitsPlanPrice)}</p>
        </div>

        {/* Net Monthly Increase */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">Net Monthly Revenue Increase</h3>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(netMonthlyIncrease)}</p>
        </div>

        {/* Yearly Net Revenue Increase with Download Button */}
        <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-green-900">Your Yearly Net Revenue Increase</h3>
            <Button 
              onClick={handleDownloadPDF}
              variant="outline" 
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <p className="text-3xl font-bold text-green-800 mb-2">{formatCurrency(netAnnualIncrease)}</p>
          <p className="text-sm text-green-700">
            Based on a 30% reduction in churn rate through improved user experience
          </p>
        </div>

        {/* Chart */}
        <ChurnResultsChart 
          currentChurnRate={results.currentChurnRate}
          reducedChurnRate={results.reducedChurnRate}
          monthlySavings={results.monthlySavings}
          productFruitsCost={productFruitsPlanPrice}
        />

        {/* Additional Metrics */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current Churn Rate:</span>
              <span className="font-medium ml-2">{formatPercent(results.currentChurnRate / 100)}</span>
            </div>
            <div>
              <span className="text-gray-600">Reduced Churn Rate:</span>
              <span className="font-medium ml-2">{formatPercent(results.reducedChurnRate / 100)}</span>
            </div>
            <div>
              <span className="text-gray-600">Customers Retained:</span>
              <span className="font-medium ml-2">{formatNumber(savedCustomers)}</span>
            </div>
            <div>
              <span className="text-gray-600">Annual ROI:</span>
              <span className="font-medium ml-2">{formatPercent(results.roi)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnCalculatorResults;
