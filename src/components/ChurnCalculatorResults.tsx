
import React from "react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/churnCalculator";

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
          
          <div className="pt-4 flex justify-center items-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">Your yearly net revenue increase</p>
              <p className="text-[28pt] font-bold text-[#03BF92]">
                {formatCurrency((results.monthlySavings - productFruitsPlanPrice) * 12)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ChurnCalculatorResults;
