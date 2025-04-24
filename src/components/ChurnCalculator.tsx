
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateROI, formatCurrency, formatNumber, formatPercent } from "@/utils/churnCalculator";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ROIResults {
  currentChurnRate: number;
  reducedChurnRate: number;
  monthlySavings: number;
  annualSavings: number;
  roi: number;
}

const CUSTOMER_STEPS = [...Array.from({
  length: (200 - 100) / 100 + 1
}, (_, i) => 200 + i * 100), ...Array.from({
  length: (1500 - 200) / 100 + 1
}, (_, i) => 200 + (i + 1) * 100), ...Array.from({
  length: (3000 - 1500) / 500 + 1
}, (_, i) => 1500 + (i + 1) * 500), ...Array.from({
  length: (5000 - 3000) / 1000 + 1
}, (_, i) => 3000 + (i + 1) * 1000), 7500, 10000, 15000, 20000, 30000, 50000];

function snapToNearestCustomerStep(value: number) {
  let closest = CUSTOMER_STEPS[0];
  let minDiff = Math.abs(value - closest);
  for (const step of CUSTOMER_STEPS) {
    const diff = Math.abs(step - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = step;
    }
  }
  return closest;
}

function getProductFruitsPlanPrice(customers: number): number {
  if (customers <= 1500) return 139;
  if (customers <= 3000) return 189;
  if (customers <= 5000) return 259;
  if (customers <= 10000) return 339;
  return 439;
}

const ChurnCalculator = () => {
  const [customerCount, setCustomerCount] = useState(1000);
  const [averageRevenuePerCustomer, setAverageRevenuePerCustomer] = useState(50);
  const [currentChurnRate, setCurrentChurnRate] = useState(5);
  const potentialChurnReduction = 0.30;
  const [results, setResults] = useState<ROIResults | null>(null);
  const customerSliderIndex = CUSTOMER_STEPS.findIndex(v => v === customerCount);

  const setSliderByIndex = (index: number) => {
    setCustomerCount(CUSTOMER_STEPS[index]);
  };

  useEffect(() => {
    calculateAndUpdateResults();
  }, [customerCount, averageRevenuePerCustomer, currentChurnRate]);

  const calculateAndUpdateResults = () => {
    const calculatedResults = calculateROI({
      customerCount,
      averageRevenuePerCustomer,
      currentChurnRate,
      potentialChurnReduction
    });
    setResults(calculatedResults);
  };

  const handleCustomerCountInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    let numValue = parseInt(value) || CUSTOMER_STEPS[0];
    numValue = Math.min(Math.max(numValue, CUSTOMER_STEPS[0]), CUSTOMER_STEPS[CUSTOMER_STEPS.length - 1]);
    setter(snapToNearestCustomerStep(numValue));
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string, min: number, max: number) => {
    const numValue = parseFloat(value) || min;
    setter(Math.min(Math.max(numValue, min), max));
  };

  const InfoTooltip = ({
    content
  }: {
    content: string;
  }) => <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help">
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent side="right" align="start" className="max-w-[250px]">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;

  const productFruitsPlanPrice = getProductFruitsPlanPrice(customerCount);

  return <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Enter your data</CardTitle>
          <CardDescription>Calculate your retention gains
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="customer-count" className="calculator-label">Number of customers</Label>
              <InfoTooltip content="The total number of customers." />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="customer-count" min={0} max={CUSTOMER_STEPS.length - 1} step={1} value={[customerSliderIndex]} onValueChange={([idx]) => setSliderByIndex(idx)} className="flex-1" />
              <Input type="number" value={customerCount} min={CUSTOMER_STEPS[0]} max={CUSTOMER_STEPS[CUSTOMER_STEPS.length - 1]} onChange={e => handleCustomerCountInputChange(setCustomerCount, e.target.value)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="average-revenue" className="calculator-label">Average revenue per customer (USD/month)</Label>
              <InfoTooltip content="The average monthly revenue generated by each customer." />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="average-revenue" min={10} max={200} step={1} value={[averageRevenuePerCustomer]} onValueChange={value => setAverageRevenuePerCustomer(value[0])} className="flex-1" />
              <Input type="number" value={averageRevenuePerCustomer} onChange={e => handleInputChange(setAverageRevenuePerCustomer, e.target.value, 10, 200)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-churn" className="calculator-label">Current churn rate</Label>
              <InfoTooltip content="Your current customer churn rate as a percentage." />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="current-churn" min={1} max={20} step={1} value={[currentChurnRate]} onValueChange={value => setCurrentChurnRate(value[0])} className="flex-1" />
              <Input type="number" value={currentChurnRate} onChange={e => handleInputChange(setCurrentChurnRate, e.target.value, 1, 20)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="churn-reduction" className="calculator-label">
                Estimated Churn Reduction (%)
              </Label>
              <InfoTooltip content="The standard reduction in churn rate based on Product Fruits data." />
            </div>
            <div className="flex items-center gap-4">
              <Input 
                type="text" 
                value="30" 
                readOnly 
                className="w-24 bg-gray-100 cursor-not-allowed" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Your user retention gains</CardTitle>
          <CardDescription>Based on your data, here’s how many customers you prevent from churning with Product Fruits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results && <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Monthly retained revenue</span>
                  <span className="font-medium">{formatCurrency(results.monthlySavings)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Product Fruits monthly cost</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(productFruitsPlanPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Net monthly revenue increase</span>
                  <span className="font-medium">{formatCurrency(results.monthlySavings - productFruitsPlanPrice)}</span>
                </div>
              </div>
              
              <div className="pt-4 flex justify-center items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Net ARR increase</p>
                  <p className="text-[28pt] font-bold text-green-600">
                    {formatCurrency((results.monthlySavings - productFruitsPlanPrice) * 12)}
                  </p>
                </div>
              </div>
            </div>}
        </CardContent>
      </Card>
    </div>;
};

export default ChurnCalculator;
