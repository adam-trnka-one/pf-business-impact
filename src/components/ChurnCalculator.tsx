
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateChurn, ChurnResults } from "@/utils/churnCalculator";
import { formatCurrency, formatNumber } from "@/utils/roiCalculator";
import ChurnResultsChart from "@/components/ChurnResultsChart";
import { HelpCircle, Info, Coins, Users, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ChurnCalculator = () => {
  const [totalCustomers, setTotalCustomers] = useState(1000);
  const [monthlyChurnRate, setMonthlyChurnRate] = useState(4);
  const [churnReduction, setChurnReduction] = useState(50);
  const [averageRevenue, setAverageRevenue] = useState(100);
  const [results, setResults] = useState<ChurnResults | null>(null);

  useEffect(() => {
    calculateAndUpdateResults();
  }, [totalCustomers, monthlyChurnRate, churnReduction, averageRevenue]);

  const calculateAndUpdateResults = () => {
    const calculatedResults = calculateChurn({
      totalCustomers,
      monthlyChurnRate,
      churnReduction,
      averageRevenue
    });
    setResults(calculatedResults);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string, min: number, max: number) => {
    const numValue = parseInt(value) || min;
    setter(Math.min(Math.max(numValue, min), max));
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Churn Reduction Calculator</CardTitle>
          <CardDescription>
            Estimate revenue retained by reducing customer churn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="total-customers" className="calculator-label">
                Total number of customers
              </Label>
              <InfoTooltip content="The total number of active customers you currently have" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="total-customers"
                min={100}
                max={10000}
                step={100}
                value={[totalCustomers]}
                onValueChange={(value) => setTotalCustomers(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={totalCustomers}
                onChange={(e) => handleInputChange(setTotalCustomers, e.target.value, 100, 10000)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              {formatNumber(totalCustomers)} customers
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-churn-rate" className="calculator-label">
                Monthly churn rate (%)
              </Label>
              <InfoTooltip content="The percentage of customers who cancel each month" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="monthly-churn-rate"
                min={0.5}
                max={15}
                step={0.5}
                value={[monthlyChurnRate]}
                onValueChange={(value) => setMonthlyChurnRate(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={monthlyChurnRate}
                onChange={(e) => handleInputChange(setMonthlyChurnRate, e.target.value, 0.5, 15)}
                className="w-24"
                step="0.5"
              />
            </div>
            <span className="calculator-value-display">
              {monthlyChurnRate}% churn monthly
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="average-revenue" className="calculator-label">
                Average monthly revenue per customer (USD)
              </Label>
              <InfoTooltip content="The average monthly revenue generated per customer (ARPA)" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="average-revenue"
                min={10}
                max={1000}
                step={10}
                value={[averageRevenue]}
                onValueChange={(value) => setAverageRevenue(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={averageRevenue}
                onChange={(e) => handleInputChange(setAverageRevenue, e.target.value, 10, 1000)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              ${averageRevenue}/month per customer
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="churn-reduction" className="calculator-label">
                Estimated churn reduction (%)
              </Label>
              <InfoTooltip content="The percentage by which churn could be reduced with better onboarding and in-app guidance (industry average: 30-70%)" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="churn-reduction"
                min={10}
                max={70}
                step={5}
                value={[churnReduction]}
                onValueChange={(value) => setChurnReduction(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={churnReduction}
                onChange={(e) => handleInputChange(setChurnReduction, e.target.value, 10, 70)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              {churnReduction}% reduction in churn
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Your Potential Revenue Retention</CardTitle>
          <CardDescription>
            Based on your inputs, here's what you could save
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
                <TrendingDown className="text-red-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800">
                    You are losing <strong>{results.churnedCustomers} customers</strong> every month at this moment.
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start">
                <Info className="text-green-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-800">
                    Better onboarding and in-app guidance can help you save up to <strong>{churnReduction}%</strong> of your churning customers. 
                    That's <strong>{results.potentialCustomersSaved} customers saved</strong> each month, which equals <strong>{formatCurrency(results.potentialRevenueSaved.annual)}</strong> per year in retained revenue!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Monthly Retention</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(results.potentialRevenueSaved.monthly)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Annual Retention</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(results.potentialRevenueSaved.annual)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Churned customers (monthly)</span>
                  <span className="font-medium">{formatNumber(results.churnedCustomers)} customers</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Revenue lost to churn</span>
                  <span className="font-medium">{formatCurrency(results.revenueLost)}/month</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Potential customers saved</span>
                  <span className="font-medium">{formatNumber(results.potentialCustomersSaved)}/month</span>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Retention Visualization</h4>
                <ChurnResultsChart 
                  currentLost={results.revenueLost}
                  potentialSaved={results.potentialRevenueSaved.monthly}
                  stillLost={results.revenueLost - results.potentialRevenueSaved.monthly}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChurnCalculator;
