import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateROI, formatCurrency, formatNumber, formatHours, ROIResults } from "@/utils/roiCalculator";
import ResultsChart from "@/components/ResultsChart";
import { HelpCircle, Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const Calculator = () => {
  const [ticketsPerMonth, setTicketsPerMonth] = useState(1000);
  const [timePerTicket, setTimePerTicket] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(30);
  const [ticketReduction] = useState(25);
  const [userCount, setUserCount] = useState(2000);
  const [monthlyPaymentTier, setMonthlyPaymentTier] = useState(499);
  const [results, setResults] = useState<ROIResults | null>(null);

  useEffect(() => {
    calculateAndUpdateResults();
  }, [ticketsPerMonth, timePerTicket, hourlyRate, userCount, monthlyPaymentTier]);

  const calculateAndUpdateResults = () => {
    const calculatedResults = calculateROI({
      ticketsPerMonth,
      timePerTicket,
      hourlyRate,
      ticketReduction,
      userCount,
      monthlyPaymentTier
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
          <CardTitle>Support ROI Calculator</CardTitle>
          <CardDescription>
            Estimate your savings from implementing in-app support solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="tickets-per-month" className="calculator-label">
                Support tickets per month
              </Label>
              <InfoTooltip content="The average number of support tickets your team handles each month" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="tickets-per-month"
                min={100}
                max={10000}
                step={100}
                value={[ticketsPerMonth]}
                onValueChange={(value) => setTicketsPerMonth(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={ticketsPerMonth}
                onChange={(e) => handleInputChange(setTicketsPerMonth, e.target.value, 100, 10000)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              {formatNumber(ticketsPerMonth)} tickets/month
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="time-per-ticket" className="calculator-label">
                Average time per ticket (minutes)
              </Label>
              <InfoTooltip content="The average time your support staff spends resolving each ticket" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="time-per-ticket"
                min={5}
                max={120}
                step={1}
                value={[timePerTicket]}
                onValueChange={(value) => setTimePerTicket(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={timePerTicket}
                onChange={(e) => handleInputChange(setTimePerTicket, e.target.value, 5, 120)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              {timePerTicket} minutes per ticket
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="hourly-rate" className="calculator-label">
                Hourly rate of support staff (USD/hour)
              </Label>
              <InfoTooltip content="The average hourly cost of your support team members" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="hourly-rate"
                min={15}
                max={100}
                step={1}
                value={[hourlyRate]}
                onValueChange={(value) => setHourlyRate(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={hourlyRate}
                onChange={(e) => handleInputChange(setHourlyRate, e.target.value, 15, 100)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              ${hourlyRate}/hour
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="ticket-reduction" className="calculator-label">
                Estimated ticket reduction (%)
              </Label>
              <InfoTooltip content="Based on our customers' average reductions in support tickets" />
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={ticketReduction}
                readOnly
                className="w-24 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <span className="calculator-value-display">
              {ticketReduction}% reduction (Fixed based on customer averages)
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="user-count" className="calculator-label">
                Number of Users
              </Label>
              <InfoTooltip content="Total number of active users in your application" />
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="user-count"
                min={100}
                max={10000}
                step={100}
                value={[userCount]}
                onValueChange={(value) => setUserCount(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                value={userCount}
                onChange={(e) => handleInputChange(setUserCount, e.target.value, 100, 10000)}
                className="w-24"
              />
            </div>
            <span className="calculator-value-display">
              {formatNumber(userCount)} users
            </span>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-payment" className="calculator-label">
                Monthly Payment Tier (USD)
              </Label>
              <InfoTooltip content="Your selected monthly payment tier for the support solution" />
            </div>
            <div className="flex items-center gap-4">
              <Input
                id="monthly-payment"
                type="number"
                value={monthlyPaymentTier}
                onChange={(e) => handleInputChange(setMonthlyPaymentTier, e.target.value, 0, 10000)}
                className="w-full"
              />
            </div>
            <span className="calculator-value-display">
              {formatCurrency(monthlyPaymentTier)}/month
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Your Potential Savings</CardTitle>
          <CardDescription>
            Based on your inputs, here's what you could save
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Net Monthly Savings</p>
                  <p className="text-2xl font-bold text-roi-blue">{formatCurrency(results.netSavings.monthly)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Net Annual Savings</p>
                  <p className="text-2xl font-bold text-roi-blue-dark">{formatCurrency(results.netSavings.annual)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Tickets per user (monthly)</span>
                  <span className="font-medium">0.5</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Total support time (monthly)</span>
                  <span className="font-medium">{formatHours(results.totalTimeSpent)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Current monthly support cost</span>
                  <span className="font-medium">{formatCurrency(results.totalCost)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Potential tickets reduced</span>
                  <span className="font-medium">{formatNumber(results.potentialTicketsReduced)} tickets/month</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Monthly payment tier</span>
                  <span className="font-medium text-red-600">-{formatCurrency(monthlyPaymentTier)}</span>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Savings Visualization</h4>
                <ResultsChart 
                  currentCost={results.totalCost}
                  reducedCost={results.totalCost - results.estimatedSavings.monthly}
                  savings={results.netSavings.monthly}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
