
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/utils/roiCalculator";

// Use the pricing tiers according to user request and churn calculator rules
function getProductFruitsPlanPrice(userCount: number) {
  if (userCount <= 1500) return 139;
  if (userCount <= 3000) return 189;
  if (userCount <= 5000) return 259;
  if (userCount <= 10000) return 339;
  return 439;
}

// Define discrete trial/signup steps, inspired by Calculator.tsx (Support tickets per month)
const TRIAL_STEPS = [
  ...Array.from({ length: (1500 - 50) / 50 + 1 }, (_, i) => 50 + i * 50),      // 50 to 1500, step 50
  ...Array.from({ length: (3000 - 1500) / 100 }, (_, i) => 1500 + (i + 1) * 100), // 1600 to 3000, step 100
  ...Array.from({ length: (5000 - 3000) / 250 }, (_, i) => 3000 + (i + 1) * 250), // 3250 to 5000, step 250
  6000, 8000, 10000
];

function snapToNearestStep(value: number) {
  let closest = TRIAL_STEPS[0];
  let minDiff = Math.abs(value - closest);
  for (const step of TRIAL_STEPS) {
    const diff = Math.abs(step - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = step;
    }
  }
  return closest;
}

type ConversionResults = {
  additionalConversions: number;
  originalConversions: number;
  newConversions: number;
  monthlyRevenue: number;
  annualRevenue: number;
};

const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="cursor-help">
        <HelpCircle className="h-4 w-4 text-gray-400" />
      </TooltipTrigger>
      <TooltipContent side="right" align="start" className="max-w-[250px]">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ConversionCalculator = () => {
  // The index inside TRIAL_STEPS instead of direct monthlyTrials
  const [trialStepIndex, setTrialStepIndex] = useState(6); // default to step index 6 (i.e., ~350)
  const [currentConversion, setCurrentConversion] = useState(14);
  const conversionUplift = 30;
  const [monthlyArpu, setMonthlyArpu] = useState(100);
  const [results, setResults] = useState<ConversionResults | null>(null);

  // Get the current trial signups value and update index if needed
  const monthlyTrials = TRIAL_STEPS[trialStepIndex];

  // Product Fruits plan price based on monthlyTrials (userCount)
  const productFruitsPlanPrice = getProductFruitsPlanPrice(monthlyTrials);

  // For handling slider changes (by index)
  const handleTrialSlider = (index: number) => {
    setTrialStepIndex(index);
  };

  // For handling input changes (snap to nearest)
  const handleTrialInput = (value: string) => {
    const parsedValue = parseInt(value) || TRIAL_STEPS[0];
    const snapped = snapToNearestStep(parsedValue);
    const index = TRIAL_STEPS.findIndex((v) => v === snapped);
    setTrialStepIndex(index !== -1 ? index : 0);
  };

  // All other sliders/input changes
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string, min: number, max: number) => {
    const numValue = parseInt(value) || min;
    setter(Math.min(Math.max(numValue, min), max));
  };

  useEffect(() => {
    calculateResults();
    // eslint-disable-next-line
  }, [trialStepIndex, currentConversion, conversionUplift, monthlyArpu]);

  const calculateResults = () => {
    const originalConversions = (monthlyTrials * currentConversion) / 100;
    const newConversions = monthlyTrials * (currentConversion / 100) * (1 + conversionUplift / 100);
    const additionalConversions = newConversions - originalConversions;
    const monthlyRevenue = additionalConversions * monthlyArpu;
    const annualRevenue = monthlyRevenue * 12;

    setResults({
      originalConversions,
      newConversions,
      additionalConversions,
      monthlyRevenue,
      annualRevenue,
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversion Rate Calculator</CardTitle>
          <CardDescription>
            Estimate additional revenue from improved trial-to-paid conversion rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-trials" className="calculator-label">
                Monthly trial signups
              </Label>
              <InfoTooltip content="The average number of new trial users you get each month" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="monthly-trials"
                min={0}
                max={TRIAL_STEPS.length - 1}
                step={1}
                value={[trialStepIndex]}
                onValueChange={([idx]) => handleTrialSlider(idx)}
                className="flex-1"
              />
              <Input
                type="number"
                value={monthlyTrials}
                min={TRIAL_STEPS[0]}
                max={TRIAL_STEPS[TRIAL_STEPS.length - 1]}
                onChange={(e) => handleTrialInput(e.target.value)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              {formatNumber(monthlyTrials)} trials/month
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-conversion" className="calculator-label">
                Current conversion rate (%)
              </Label>
              <InfoTooltip content="Your current trial-to-paid conversion rate" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="current-conversion"
                min={1}
                max={50}
                step={1}
                value={[currentConversion]}
                onValueChange={(value) => setCurrentConversion(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={currentConversion}
                onChange={(e) => handleInputChange(setCurrentConversion, e.target.value, 1, 50)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              {currentConversion}% conversion rate
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-arpu" className="calculator-label">
                Average monthly revenue per customer (USD)
              </Label>
              <InfoTooltip content="Average monthly revenue generated per customer" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="monthly-arpu"
                min={10}
                max={1000}
                step={10}
                value={[monthlyArpu]}
                onValueChange={(value) => setMonthlyArpu(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={monthlyArpu}
                onChange={(e) => handleInputChange(setMonthlyArpu, e.target.value, 10, 1000)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              ${monthlyArpu}/customer/month
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="conversion-uplift" className="calculator-label">
                Expected conversion uplift (%)
              </Label>
              <InfoTooltip content="Based on our customers' average improvements in trial-to-paid conversion rates" />
            </div>
            <span className="calculator-value-display">
              {conversionUplift}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Potential Revenue Uplift</CardTitle>
          <CardDescription>
            Based on your inputs, here's your potential additional revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Monthly additional conversions</span>
                  <span className="font-medium">{formatNumber(results.additionalConversions)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">MRR Increase</span>
                  <span className="font-medium">{formatCurrency(results.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Product Fruits monthly plan</span>
                  <span className="font-medium text-red-600">-{formatCurrency(productFruitsPlanPrice)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Net monthly revenue increase</span>
                  <span className="font-medium">{formatCurrency(results.monthlyRevenue - productFruitsPlanPrice)}</span>
                </div>
              </div>
              
              <div className="pt-4 flex justify-center items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Net yearly revenue increase</p>
                  <p className="text-[28pt] font-bold text-green-600">
                    {formatCurrency((results.monthlyRevenue - productFruitsPlanPrice) * 12)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionCalculator;
