
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber, ROIResults } from "@/utils/roiCalculator";
import { Download } from "lucide-react";

interface CalculatorResultsProps {
  results: ROIResults | null;
  ticketsPerMonth: number;
  ticketReduction: number;
  productFruitsPlanPrice: number;
  onDownloadPDF: () => void;
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({
  results,
  ticketsPerMonth,
  ticketReduction,
  productFruitsPlanPrice,
  onDownloadPDF
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Your support cost savings</CardTitle>
        <CardDescription>Based on your data, here's the business impact of Product Fruits</CardDescription>
      </CardHeader>
      <CardContent>
        {results && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-gray-600">Monthly decrease in support tickets</span>
                <span className="font-medium">
                  {formatNumber(Math.round(ticketsPerMonth * ticketReduction / 100))}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-gray-600">Support cost monthly savings</span>
                <span className="font-medium">{formatCurrency(results.estimatedSavings.monthly)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-gray-600">Product Fruits monthly cost</span>
                <span className="font-medium text-[#ff4747]">
                  -{formatCurrency(productFruitsPlanPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-gray-600">Net monthly savings</span>
                <span className="font-medium">{formatCurrency(results.netSavings.monthly)}</span>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col justify-center items-center space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Your yearly net savings</p>
                <p className="text-[28pt] font-bold text-[#03BF92] py-0">
                  {formatCurrency(results.netSavings.annual)}
                </p>
              </div>
              <Button 
                onClick={onDownloadPDF}
                className="bg-[#FF751D] hover:bg-[#E05A00] text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};

export default CalculatorResults;
