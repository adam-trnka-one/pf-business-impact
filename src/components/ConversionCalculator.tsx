import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/utils/roiCalculator";

// Product Fruits pricing logic
function getProductFruitsPlanPrice(userCount: number) {
  if (userCount <= 1500) return 139;
  if (userCount <= 3000) return 189;
  if (userCount <= 5000) return 259;
  if (userCount <= 10000) return 339;
  return 439;
}

// Updated trial steps: 50, 100, 250, 500, 1k, 2.5k, 5k, 7.5k, 10k, 15k, 20k, ..., 50k
const TRIAL_STEPS = [50, 100, 250, 500, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000];
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
const ConversionCalculator = () => {
  const [trialStepIndex, setTrialStepIndex] = useState(4); // Changed to index of 1000
  const [currentConversion, setCurrentConversion] = useState(14);
  const conversionUplift = 30;
  const [monthlyArpu, setMonthlyArpu] = useState(100);
  const [results, setResults] = useState<ConversionResults | null>(null);

  // Use the updated TRIAL_STEPS for value
  const monthlyTrials = TRIAL_STEPS[trialStepIndex];
  const productFruitsPlanPrice = getProductFruitsPlanPrice(monthlyTrials);
  const handleTrialSlider = (index: number) => {
    setTrialStepIndex(index);
  };

  // Snap input to nearest defined step and update slider index
  const handleTrialInput = (value: string) => {
    const parsedValue = parseInt(value) || TRIAL_STEPS[0];
    const snapped = snapToNearestStep(parsedValue);
    const index = TRIAL_STEPS.findIndex(v => v === snapped);
    setTrialStepIndex(index !== -1 ? index : 0);
  };
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string, min: number, max: number) => {
    const numValue = parseInt(value) || min;
    setter(Math.min(Math.max(numValue, min), max));
  };
  useEffect(() => {
    calculateResults();
  }, [trialStepIndex, currentConversion, conversionUplift, monthlyArpu]);
  const calculateResults = () => {
    const originalConversions = monthlyTrials * currentConversion / 100;
    const newConversions = monthlyTrials * (currentConversion / 100) * (1 + conversionUplift / 100);
    const additionalConversions = newConversions - originalConversions;
    const monthlyRevenue = additionalConversions * monthlyArpu;
    const annualRevenue = monthlyRevenue * 12;
    setResults({
      originalConversions,
      newConversions,
      additionalConversions,
      monthlyRevenue,
      annualRevenue
    });
  };
  return <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversion Rate Calculator</CardTitle>
          <CardDescription>
            Enter your data: Your Potential Savings from improved trial-to-paid conversion rates
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
              <Slider id="monthly-trials" min={0} max={TRIAL_STEPS.length - 1} step={1} value={[trialStepIndex]} onValueChange={([idx]) => handleTrialSlider(idx)} className="flex-1" />
              <Input type="number" value={monthlyTrials} min={TRIAL_STEPS[0]} max={TRIAL_STEPS[TRIAL_STEPS.length - 1]} step="10" onChange={e => handleTrialInput(e.target.value)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-conversion" className="calculator-label">
                Current conversion rate (%)
              </Label>
              <InfoTooltip content="Your current trial-to-paid conversion rate" />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="current-conversion" min={1} max={50} step={1} value={[currentConversion]} onValueChange={value => setCurrentConversion(value[0])} className="flex-1" />
              <Input type="number" value={currentConversion} min={1} max={50} onChange={e => handleInputChange(setCurrentConversion, e.target.value, 1, 50)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-arpu" className="calculator-label">
                Average monthly revenue per customer (USD)
              </Label>
              <InfoTooltip content="Average monthly revenue generated per customer" />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="monthly-arpu" min={10} max={1000} step={10} value={[monthlyArpu]} onValueChange={value => setMonthlyArpu(value[0])} className="flex-1" />
              <Input type="number" value={monthlyArpu} min={10} max={1000} step="10" onChange={e => handleInputChange(setMonthlyArpu, e.target.value, 10, 1000)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="conversion-uplift" className="calculator-label">
                Expected conversion uplift (%)
              </Label>
              <InfoTooltip content="Based on our customers' average improvements in trial-to-paid conversion rates" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-500">{conversionUplift}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Your Potential Savings</CardTitle>
          <CardDescription>
            Based on your inputs, here's your potential additional revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results && <div className="space-y-6 animate-fade-in">
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
                  <span className="text-sm text-gray-600">Product Fruits monthly cost</span>
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
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default ConversionCalculator;
