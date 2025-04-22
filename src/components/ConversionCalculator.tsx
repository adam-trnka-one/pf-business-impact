
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/utils/roiCalculator";

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
  const [monthlyTrials, setMonthlyTrials] = useState(320);
  const [currentConversion, setCurrentConversion] = useState(14);
  const [conversionUplift] = useState(30);
  const [monthlyArpu, setMonthlyArpu] = useState(100);
  const [results, setResults] = useState<ConversionResults | null>(null);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string, min: number, max: number) => {
    const numValue = parseInt(value) || min;
    setter(Math.min(Math.max(numValue, min), max));
  };

  useEffect(() => {
    calculateResults();
  }, [monthlyTrials, currentConversion, conversionUplift, monthlyArpu]);

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
                min={50}
                max={1000}
                step={10}
                value={[monthlyTrials]}
                onValueChange={(value) => setMonthlyTrials(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={monthlyTrials}
                onChange={(e) => handleInputChange(setMonthlyTrials, e.target.value, 50, 1000)}
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
              <Label htmlFor="conversion-uplift" className="calculator-label">
                Expected conversion uplift (%)
              </Label>
              <InfoTooltip content="Based on our customers' average improvements in trial-to-paid conversion rates" />
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={conversionUplift}
                readOnly
                className="w-24 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <span className="calculator-value-display">
              {conversionUplift}% uplift (Fixed based on customer averages)
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
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Potential Revenue Uplift</CardTitle>
          <CardDescription>
            Based on your inputs, here's your potential additional revenue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Monthly Revenue Gain</p>
                  <p className="text-2xl font-bold text-roi-blue">
                    {formatCurrency(results.monthlyRevenue)}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Annual Revenue Gain</p>
                  <p className="text-2xl font-bold text-roi-blue-dark">
                    {formatCurrency(results.annualRevenue)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Original monthly conversions</span>
                  <span className="font-medium">{formatNumber(results.originalConversions)} users</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">New monthly conversions</span>
                  <span className="font-medium">{formatNumber(results.newConversions)} users</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Additional conversions per month</span>
                  <span className="font-medium">{formatNumber(results.additionalConversions)} users</span>
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
