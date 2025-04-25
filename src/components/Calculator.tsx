import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateROI, formatCurrency, formatNumber, ROIResults } from "@/utils/roiCalculator";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

function getProductFruitsPlanPrice(ticketsPerMonth: number) {
  if (ticketsPerMonth <= 1500) return 139;
  if (ticketsPerMonth <= 3000) return 189;
  if (ticketsPerMonth <= 5000) return 259;
  if (ticketsPerMonth <= 10000) return 339;
  if (ticketsPerMonth <= 50000) return 439;
  return 599;
}

const TICKET_STEPS = [...Array.from({
  length: (1500 - 100) / 100 + 1
}, (_, i) => 100 + i * 100), ...Array.from({
  length: (3000 - 1500) / 500
}, (_, i) => 1500 + (i + 1) * 500), ...Array.from({
  length: (5000 - 3000) / 1000
}, (_, i) => 3000 + (i + 1) * 1000), 7500, 10000, 15000, 20000, 30000, 50000];

function snapToNearestStep(value: number) {
  let closest = TICKET_STEPS[0];
  let minDiff = Math.abs(value - closest);
  for (const step of TICKET_STEPS) {
    const diff = Math.abs(step - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = step;
    }
  }
  return closest;
}

const Calculator = () => {
  const [ticketsPerMonth, setTicketsPerMonth] = useState(1000);
  const [timePerTicket, setTimePerTicket] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(30);
  const ticketReduction = 25;
  const [userCount, setUserCount] = useState(2000);
  const [monthlyPaymentTier, setMonthlyPaymentTier] = useState(499);
  const [results, setResults] = useState<ROIResults | null>(null);
  const productFruitsPlanPrice = getProductFruitsPlanPrice(ticketsPerMonth);

  useEffect(() => {
    calculateAndUpdateResults();
  }, [ticketsPerMonth, timePerTicket, hourlyRate]);

  const calculateAndUpdateResults = () => {
    const calculatedResults = calculateROI({
      ticketsPerMonth,
      timePerTicket,
      hourlyRate,
      ticketReduction,
      userCount: ticketsPerMonth,
      monthlyPaymentTier: productFruitsPlanPrice
    });
    setResults(calculatedResults);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    let numValue = parseInt(value) || TICKET_STEPS[0];
    numValue = Math.min(Math.max(numValue, TICKET_STEPS[0]), TICKET_STEPS[TICKET_STEPS.length - 1]);
    setter(snapToNearestStep(numValue));
  };

  const sliderIndex = TICKET_STEPS.findIndex(v => v === ticketsPerMonth);
  const setSliderByIndex = (index: number) => {
    setTicketsPerMonth(TICKET_STEPS[index]);
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

  return <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Enter your data</CardTitle>
          <CardDescription>We’ll use this to calculate your business impact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="tickets-per-month" className="calculator-label">
                Support tickets per month
              </Label>
              <InfoTooltip content="The average number of support tickets your team handles each month." />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="tickets-per-month" min={0} max={TICKET_STEPS.length - 1} step={1} value={[sliderIndex]} onValueChange={([idx]) => setSliderByIndex(idx)} className="flex-1" />
              <Input type="number" value={ticketsPerMonth} min={TICKET_STEPS[0]} max={TICKET_STEPS[TICKET_STEPS.length - 1]} onChange={e => handleInputChange(setTicketsPerMonth, e.target.value)} className="w-24" />
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
              <Slider id="time-per-ticket" min={5} max={120} step={1} value={[timePerTicket]} onValueChange={value => setTimePerTicket(value[0])} className="flex-1" />
              <Input type="number" value={timePerTicket} onChange={e => {
              let val = Math.max(5, Math.min(120, parseInt(e.target.value) || 5));
              setTimePerTicket(val);
            }} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="hourly-rate" className="calculator-label">
                Average hourly cost per support team member (USD/hour)
              </Label>
              <InfoTooltip content="Average hourly cost per support team member" />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="hourly-rate" min={15} max={100} step={1} value={[hourlyRate]} onValueChange={value => setHourlyRate(value[0])} className="flex-1" />
              <Input type="number" value={hourlyRate} onChange={e => {
              let val = Math.max(15, Math.min(100, parseInt(e.target.value) || 15));
              setHourlyRate(val);
            }} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="ticket-reduction" className="calculator-label">
                Estimated ticket reduction (%)
              </Label>
              <InfoTooltip content="Based on our customers' average reductions in support tickets" />
            </div>
            <span className="calculator-value-display">
              {ticketReduction}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Your support cost savings</CardTitle>
          <CardDescription>Based on your data, here's the business impact of Product Fruits</CardDescription>
        </CardHeader>
        <CardContent>
          {results && <div className="space-y-6">
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
                  <span className="font-medium text-red-600">
                    -{formatCurrency(productFruitsPlanPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Net monthly savings</span>
                  <span className="font-medium">{formatCurrency(results.netSavings.monthly)}</span>
                </div>

                <div className="pt-4 flex justify-center items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Your yearly net savings</p>
                    <p className="text-[28pt] font-bold text-[#03BF92]">
                      {formatCurrency(results.netSavings.annual)}
                    </p>
                  </div>
                </div>
              </div>
            </div>}
        </CardContent>
      </Card>
    </div>;
};

export default Calculator;
