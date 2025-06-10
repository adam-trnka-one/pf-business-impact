import React from "react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/churnCalculator";
import { generateAndDownloadPDF } from "@/utils/pdfGenerator";

interface ChurnCalculatorResultsProps {
  customerCount: number;
  currentChurnRate: number;
  results: {
    monthlySavings: number;
  } | null;
  productFruitsPlanPrice: number;
}

const ChurnCalculatorResults = ({
  customerCount,
  currentChurnRate,
  results,
  productFruitsPlanPrice
}: ChurnCalculatorResultsProps) => {
  if (!results) return null;

  const handleDownloadPDF = () => {
    const savedCustomers = customerCount * currentChurnRate / 100 * 0.3;
    const averageRevenuePerCustomer = savedCustomers > 0 ? results.monthlySavings / savedCustomers : 0;
    
    generateAndDownloadPDF({
      customerCount,
      averageRevenuePerCustomer,
      currentChurnRate,
      results,
      productFruitsPlanPrice
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Your user retention gains</CardTitle>
        <CardDescription>Based on your data, here's the business impact of Product Fruits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-gray-600">Saved customers</span>
              <span className="font-medium">
                {formatNumber(Math.round(customerCount * currentChurnRate / 100 * 0.3))}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-gray-600">Revenue saved monthly</span>
              <span className="font-medium">{formatCurrency(results.monthlySavings)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-gray-600">Product Fruits monthly cost</span>
              <span className="font-medium text-[#ff4747]">
                -{formatCurrency(productFruitsPlanPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-gray-600">Incremental net monthly revenue</span>
              <span className="font-medium">{formatCurrency(results.monthlySavings - productFruitsPlanPrice)}</span>
            </div>
          </div>
          
          <div className="pt-4 flex flex-col justify-center items-center space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Your yearly net revenue increase</p>
              <p className="text-[28pt] font-bold text-[#03BF92]">
                {formatCurrency((results.monthlySavings - productFruitsPlanPrice) * 12)}
              </p>
            </div>
            <Button 
              onClick={handleDownloadPDF}
              className="bg-[#ff4747] hover:bg-[#e63e3e] text-white px-6 py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ChurnCalculatorResults;
