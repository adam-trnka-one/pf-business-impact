
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TICKET_STEPS } from "@/utils/ticketSteps";

interface CalculatorInputsProps {
  ticketsPerMonth: number;
  setTicketsPerMonth: React.Dispatch<React.SetStateAction<number>>;
  timePerTicket: number;
  setTimePerTicket: React.Dispatch<React.SetStateAction<number>>;
  hourlyRate: number;
  setHourlyRate: React.Dispatch<React.SetStateAction<number>>;
  ticketReduction: number;
  onInputChange: (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => void;
}

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

const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  ticketsPerMonth,
  setTicketsPerMonth,
  timePerTicket,
  setTimePerTicket,
  hourlyRate,
  setHourlyRate,
  ticketReduction,
  onInputChange
}) => {
  const sliderIndex = TICKET_STEPS.findIndex(v => v === ticketsPerMonth);
  const setSliderByIndex = (index: number) => {
    setTicketsPerMonth(TICKET_STEPS[index]);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Enter your data</CardTitle>
        <CardDescription>We'll use this to calculate your business impact</CardDescription>
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
            <Slider 
              id="tickets-per-month" 
              min={0} 
              max={TICKET_STEPS.length - 1} 
              step={1} 
              value={[sliderIndex]} 
              onValueChange={([idx]) => setSliderByIndex(idx)} 
              className="flex-1" 
            />
            <Input 
              type="number" 
              value={ticketsPerMonth} 
              min={TICKET_STEPS[0]} 
              max={TICKET_STEPS[TICKET_STEPS.length - 1]} 
              onChange={e => onInputChange(setTicketsPerMonth, e.target.value)} 
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
              onValueChange={value => setTimePerTicket(value[0])} 
              className="flex-1" 
            />
            <Input 
              type="number" 
              value={timePerTicket} 
              onChange={e => {
                let val = Math.max(5, Math.min(120, parseInt(e.target.value) || 5));
                setTimePerTicket(val);
              }} 
              className="w-24" 
            />
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
            <Slider 
              id="hourly-rate" 
              min={15} 
              max={100} 
              step={1} 
              value={[hourlyRate]} 
              onValueChange={value => setHourlyRate(value[0])} 
              className="flex-1" 
            />
            <Input 
              type="number" 
              value={hourlyRate} 
              onChange={e => {
                let val = Math.max(15, Math.min(100, parseInt(e.target.value) || 15));
                setHourlyRate(val);
              }} 
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
          <span className="calculator-value-display">
            {ticketReduction}%
          </span>
        </div>
      </CardContent>
    </>
  );
};

export default CalculatorInputs;
