import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateROI, formatCurrency, formatNumber, ROIResults } from "@/utils/roiCalculator";
import { HelpCircle } from "lucide-react";
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
          <CardTitle>Support Cost Reduction</CardTitle>
          <CardDescription>
            Calculate potential savings from implementing in-app support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="tickets-per-month" className="calculator-label">
                Support tickets per month
              </Label>
              <InfoTooltip 
                content="The average number of support tickets your team handles each month. We calculate this as 1 ticket per user." 
              />
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
        <CardContent>
          {results && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Potential tickets reduced</span>
                  <span className="font-medium">{formatNumber(results.potentialTicketsReduced)} tickets/month</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Support cost monthly savings</span>
                  <span className="font-medium">{formatCurrency(results.estimatedSavings.monthly)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Your Product Fruits plan</span>
                  <span className="font-medium text-red-600">-{formatCurrency(monthlyPaymentTier)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Net monthly savings</span>
                  <span className="font-medium">{formatCurrency(results.netSavings.monthly)}</span>
                </div>
                
                <div className="mt-8 text-center">
                  <div className="text-sm text-gray-600 mb-2">Net annual savings</div>
                  <div className="text-4xl font-bold text-green-600">
                    {formatCurrency(results.netSavings.annual)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
