
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download } from "lucide-react";
import ResultsChart from "./ResultsChart";
import { calculateROI, formatCurrency, formatNumber } from "@/utils/roiCalculator";
import { generateAndDownloadSupportPDF } from "@/utils/supportPdfGenerator";

const Calculator = () => {
  const [ticketsPerMonth, setTicketsPerMonth] = useState(150);
  const [timePerTicket, setTimePerTicket] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [ticketReduction, setTicketReduction] = useState(25);
  const [userCount, setUserCount] = useState(1000);

  const results = calculateROI(ticketsPerMonth, timePerTicket, hourlyRate, ticketReduction);

  const monthlyPaymentTiers = [
    { users: 100, price: 79 },
    { users: 250, price: 149 },
    { users: 500, price: 249 },
    { users: 1000, price: 449 },
    { users: 2500, price: 749 },
    { users: 5000, price: 1249 },
    { users: 10000, price: 1999 },
    { users: 25000, price: 3499 },
    { users: 50000, price: 5999 }
  ];

  const getMonthlyPaymentTier = (users: number) => {
    const tier = monthlyPaymentTiers.find(tier => users <= tier.users);
    return tier ? tier.price : monthlyPaymentTiers[monthlyPaymentTiers.length - 1].price;
  };

  const monthlyPaymentTier = getMonthlyPaymentTier(userCount);

  const handleDownloadPDF = async () => {
    const pdfData = {
      ticketsPerMonth,
      timePerTicket,
      hourlyRate,
      ticketReduction,
      userCount,
      results,
      monthlyPaymentTier
    };
    
    await generateAndDownloadSupportPDF(pdfData);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Your data</CardTitle>
          <p className="text-sm text-gray-600">We'll use this to calculate your business impact</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <Label className="calculator-label">Support tickets per month</Label>
            <Input
              type="number"
              value={ticketsPerMonth}
              onChange={(e) => setTicketsPerMonth(Math.max(0, parseInt(e.target.value) || 0))}
              className="text-lg font-medium"
            />
          </div>

          <div className="calculator-input">
            <Label className="calculator-label">Time per ticket (minutes)</Label>
            <div className="space-y-3">
              <Slider
                value={[timePerTicket]}
                onValueChange={(value) => setTimePerTicket(value[0])}
                max={120}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="calculator-value-display">
                {timePerTicket} minutes
              </div>
            </div>
          </div>

          <div className="calculator-input">
            <Label className="calculator-label">Hourly rate (USD)</Label>
            <div className="space-y-3">
              <Slider
                value={[hourlyRate]}
                onValueChange={(value) => setHourlyRate(value[0])}
                max={200}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="calculator-value-display">
                {formatCurrency(hourlyRate)} per hour
              </div>
            </div>
          </div>

          <div className="calculator-input">
            <Label className="calculator-label">User count</Label>
            <Input
              type="number"
              value={userCount}
              onChange={(e) => setUserCount(Math.max(0, parseInt(e.target.value) || 0))}
              className="text-lg font-medium"
            />
          </div>

          <div className="calculator-input">
            <Label className="calculator-label">Estimated ticket reduction (%)</Label>
            <div className="space-y-3">
              <Slider
                value={[ticketReduction]}
                onValueChange={(value) => setTicketReduction(value[0])}
                max={70}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="calculator-value-display">
                {ticketReduction}% reduction
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Your support cost savings</CardTitle>
          <p className="text-sm text-gray-600">Based on your data, here's the business impact of Product Fruits</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Current monthly support cost</span>
              <span className="font-semibold text-lg">{formatCurrency(results.totalCost)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Monthly savings</span>
              <span className="font-semibold text-lg text-green-600">{formatCurrency(results.estimatedSavings.monthly)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Product Fruits monthly cost</span>
              <span className="font-semibold text-lg text-red-600">-{formatCurrency(monthlyPaymentTier)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-t border-orange-200">
              <span className="text-gray-700 font-medium">Net monthly savings</span>
              <span className="font-bold text-xl text-green-600">{formatCurrency(results.netSavings.monthly)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Tickets reduced per month</span>
              <span className="font-semibold text-lg">{results.potentialTicketsReduced}</span>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-orange-200">
            <p className="text-sm text-gray-600 mb-2">Your yearly net savings</p>
            <p className="text-4xl font-bold text-roi-green mb-4">
              {formatCurrency(results.netSavings.annual)}
            </p>
            
            <Button 
              onClick={handleDownloadPDF}
              className="w-full bg-roi-orange hover:bg-roi-orange-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <ResultsChart 
            data={{
              currentCost: results.totalCost,
              savings: results.estimatedSavings.monthly,
              productFruitsCost: monthlyPaymentTier,
              netSavings: results.netSavings.monthly
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
