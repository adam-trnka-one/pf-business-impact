
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { calculateROI, ROIResults } from "@/utils/roiCalculator";
import { generateAndDownloadSupportPDF } from "@/utils/supportPdfGenerator";
import { getProductFruitsPlanPrice, snapToNearestStep, TICKET_STEPS } from "@/utils/ticketSteps";
import CalculatorInputs from "./CalculatorInputs";
import CalculatorResults from "./CalculatorResults";

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

  const handleDownloadPDF = async () => {
    if (!results) return;
    
    const pdfData = {
      ticketsPerMonth,
      timePerTicket,
      hourlyRate,
      ticketReduction,
      userCount,
      results,
      monthlyPaymentTier: productFruitsPlanPrice
    };
    
    await generateAndDownloadSupportPDF(pdfData);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    let numValue = parseInt(value) || TICKET_STEPS[0];
    numValue = Math.min(Math.max(numValue, TICKET_STEPS[0]), TICKET_STEPS[TICKET_STEPS.length - 1]);
    setter(snapToNearestStep(numValue));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <CalculatorInputs
          ticketsPerMonth={ticketsPerMonth}
          setTicketsPerMonth={setTicketsPerMonth}
          timePerTicket={timePerTicket}
          setTimePerTicket={setTimePerTicket}
          hourlyRate={hourlyRate}
          setHourlyRate={setHourlyRate}
          ticketReduction={ticketReduction}
          onInputChange={handleInputChange}
        />
      </Card>

      <Card className="md:col-span-1">
        <CalculatorResults
          results={results}
          ticketsPerMonth={ticketsPerMonth}
          ticketReduction={ticketReduction}
          productFruitsPlanPrice={productFruitsPlanPrice}
          onDownloadPDF={handleDownloadPDF}
        />
      </Card>
    </div>
  );
};

export default Calculator;
