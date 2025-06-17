
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateROI, formatCurrency, formatNumber, formatHours, type ROIInputs } from "@/utils/roiCalculator";
import ResultsChart from "./ResultsChart";
import { Download } from "lucide-react";
import { generateAndDownloadSupportPDF } from "@/utils/supportPdfGenerator";

const Calculator = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    ticketsPerMonth: 100,
    timePerTicket: 15,
    hourlyRate: 25,
    ticketReduction: 25,
    userCount: 500,
    monthlyPaymentTier: 99
  });

  const results = calculateROI(inputs);

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownloadPDF = async () => {
    const pdfData = {
      ...inputs,
      results
    };
    await generateAndDownloadSupportPDF(pdfData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your data</CardTitle>
          <p className="text-sm text-gray-500">We'll use this to calculate your business impact</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tickets">Support tickets per month</Label>
            <Input
              id="tickets"
              type="number"
              value={inputs.ticketsPerMonth}
              onChange={(e) => handleInputChange('ticketsPerMonth', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time per ticket (minutes)</Label>
            <Input
              id="time"
              type="number"
              value={inputs.timePerTicket}
              onChange={(e) => handleInputChange('timePerTicket', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Hourly rate (USD)</Label>
            <Input
              id="rate"
              type="number"
              value={inputs.hourlyRate}
              onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="users">User count</Label>
            <Input
              id="users"
              type="number"
              value={inputs.userCount}
              onChange={(e) => handleInputChange('userCount', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <Label>Estimated ticket reduction (%): {inputs.ticketReduction}%</Label>
            <Slider
              value={[inputs.ticketReduction]}
              onValueChange={(value) => handleInputChange('ticketReduction', value[0])}
              max={50}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment">Monthly payment tier (USD)</Label>
            <Input
              id="payment"
              type="number"
              value={inputs.monthlyPaymentTier}
              onChange={(e) => handleInputChange('monthlyPaymentTier', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your support cost savings</CardTitle>
          <p className="text-sm text-gray-500">Based on your data, here's the business impact of Product Fruits</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Current monthly support cost</span>
              <span className="font-semibold">{formatCurrency(results.totalCost)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Monthly savings</span>
              <span className="font-semibold text-green-600">{formatCurrency(results.estimatedSavings.monthly)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Product Fruits monthly cost</span>
              <span className="font-semibold text-red-600">-{formatCurrency(inputs.monthlyPaymentTier)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Net monthly savings</span>
              <span className="font-semibold">{formatCurrency(results.netSavings.monthly)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Tickets reduced per month</span>
              <span className="font-semibold">{results.potentialTicketsReduced}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Your yearly net savings</p>
            <p className="text-3xl font-bold text-green-600 mb-4">
              {formatCurrency(results.netSavings.annual)}
            </p>
            <Button 
              onClick={handleDownloadPDF}
              className="w-full bg-[#FF751D] hover:bg-[#FF751D]/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <ResultsChart 
            currentCost={results.totalCost}
            reducedCost={results.totalCost - results.estimatedSavings.monthly}
            savings={results.estimatedSavings.monthly}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
