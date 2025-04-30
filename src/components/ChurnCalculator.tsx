
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { calculateROI, formatCurrency, formatNumber, formatPercent } from "@/utils/churnCalculator";
import { Download } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import NewsletterForm from "./NewsletterForm";

interface ROIResults {
  currentChurnRate: number;
  reducedChurnRate: number;
  monthlySavings: number;
  annualSavings: number;
  roi: number;
}

const CUSTOMER_STEPS = [...Array.from({
  length: (200 - 100) / 100 + 1
}, (_, i) => 200 + i * 100), ...Array.from({
  length: (1500 - 200) / 100 + 1
}, (_, i) => 200 + (i + 1) * 100), ...Array.from({
  length: (3000 - 1500) / 500 + 1
}, (_, i) => 1500 + (i + 1) * 500), ...Array.from({
  length: (5000 - 3000) / 1000 + 1
}, (_, i) => 3000 + (i + 1) * 1000), 7500, 10000, 15000, 20000, 30000, 50000];

function snapToNearestCustomerStep(value: number) {
  let closest = CUSTOMER_STEPS[0];
  let minDiff = Math.abs(value - closest);
  for (const step of CUSTOMER_STEPS) {
    const diff = Math.abs(step - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = step;
    }
  }
  return closest;
}

function getProductFruitsPlanPrice(customers: number): number {
  if (customers <= 1500) return 139;
  if (customers <= 3000) return 189;
  if (customers <= 5000) return 259;
  if (customers <= 10000) return 339;
  return 439;
}

const ChurnCalculator = () => {
  const [customerCount, setCustomerCount] = useState(1000);
  const [averageRevenuePerCustomer, setAverageRevenuePerCustomer] = useState(50);
  const [currentChurnRate, setCurrentChurnRate] = useState(5);
  const potentialChurnReduction = 0.30;
  const [results, setResults] = useState<ROIResults | null>(null);
  const customerSliderIndex = CUSTOMER_STEPS.findIndex(v => v === customerCount);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const setSliderByIndex = (index: number) => {
    setCustomerCount(CUSTOMER_STEPS[index]);
  };
  
  useEffect(() => {
    calculateAndUpdateResults();
  }, [customerCount, averageRevenuePerCustomer, currentChurnRate]);
  
  const calculateAndUpdateResults = () => {
    const calculatedResults = calculateROI({
      customerCount,
      averageRevenuePerCustomer,
      currentChurnRate,
      potentialChurnReduction
    });
    setResults(calculatedResults);
  };
  
  const handleCustomerCountInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    let numValue = parseInt(value) || CUSTOMER_STEPS[0];
    numValue = Math.min(Math.max(numValue, CUSTOMER_STEPS[0]), CUSTOMER_STEPS[CUSTOMER_STEPS.length - 1]);
    setter(snapToNearestCustomerStep(numValue));
  };
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string, min: number, max: number) => {
    const numValue = parseFloat(value) || min;
    setter(Math.min(Math.max(numValue, min), max));
  };
  
  const handleDownloadButtonClick = () => {
    setFormModalOpen(true);
  };
  
  const handleNewsletterSuccess = () => {
    setFormSubmitted(true);
    setFormModalOpen(false);
    toast.success("Thank you for subscribing!");
  };
  
  const handleDownloadPDF = () => {
    if (!results) return;
    
    const productFruitsPlanPrice = getProductFruitsPlanPrice(customerCount);
    const savedCustomers = Math.round(customerCount * currentChurnRate / 100 * potentialChurnReduction);
    const netMonthlyRevenue = results.monthlySavings - productFruitsPlanPrice;
    const yearlyNetRevenue = netMonthlyRevenue * 12;
    
    try {
      console.log("Starting PDF generation...");
      // Create a new PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add logo
      const logoImg = new Image();
      logoImg.src = "https://productfruits.com/images/pf_logo.svg";
      
      logoImg.onload = function() {
        try {
          console.log("Logo loaded, adding to PDF");
          // Add the logo to the top left
          pdf.addImage(logoImg, 'SVG', 20, 10, 40, 15);
          
          // Create the PDF content after logo is loaded
          createPDFContent(pdf, pageWidth, savedCustomers, netMonthlyRevenue, yearlyNetRevenue, productFruitsPlanPrice);
          
          // Save the PDF
          pdf.save("product-fruits-roi-report.pdf");
          console.log("PDF saved successfully");
          toast.success("PDF report downloaded successfully");
        } catch (error) {
          console.error("Error adding logo:", error);
          // Fallback - just create the PDF without the logo
          createPDFContent(pdf, pageWidth, savedCustomers, netMonthlyRevenue, yearlyNetRevenue, productFruitsPlanPrice);
          pdf.save("product-fruits-roi-report.pdf");
          console.log("PDF saved without logo");
          toast.success("PDF report downloaded (without logo)");
        }
      };
      
      logoImg.onerror = function() {
        console.error("Error loading logo");
        // Create PDF without the logo
        createPDFContent(pdf, pageWidth, savedCustomers, netMonthlyRevenue, yearlyNetRevenue, productFruitsPlanPrice);
        pdf.save("product-fruits-roi-report.pdf");
        console.log("PDF saved without logo (logo error)");
        toast.success("PDF report downloaded (without logo)");
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report", {
        description: "Please try again later"
      });
    }
  };
  
  const createPDFContent = (pdf, pageWidth, savedCustomers, netMonthlyRevenue, yearlyNetRevenue, productFruitsPlanPrice) => {
    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(255, 117, 29); // #FF751D - ProductFruits orange color
    pdf.text("Your user retention gains", pageWidth / 2, 20, { align: "center" });
    
    // Add subtitle and date
    pdf.setFontSize(12);
    pdf.setTextColor(100);
    const today = new Date().toLocaleDateString();
    pdf.text(`Generated on ${today}`, pageWidth / 2, 30, { align: "center" });
    
    // Add input parameters section
    pdf.setFontSize(16);
    pdf.setTextColor(0);
    pdf.text("Your Business Information", 20, 45);
    
    pdf.setFontSize(11);
    pdf.text(`Number of customers: ${formatNumber(customerCount)}`, 20, 55);
    pdf.text(`Average revenue per customer: $${averageRevenuePerCustomer}/month`, 20, 62);
    pdf.text(`Current churn rate: ${currentChurnRate}%`, 20, 69);
    pdf.text(`Projected churn reduction: 30%`, 20, 76);
    
    // Add results section
    pdf.setFontSize(16);
    pdf.text("Business Impact Results", 20, 90);
    
    pdf.setFontSize(11);
    pdf.text(`Saved customers: ${formatNumber(savedCustomers)}`, 20, 100);
    pdf.text(`Monthly revenue saved: ${formatCurrency(results.monthlySavings)}`, 20, 107);
    pdf.text(`Product Fruits monthly cost: -${formatCurrency(productFruitsPlanPrice)}`, 20, 114);
    pdf.text(`Net monthly revenue increase: ${formatCurrency(results.monthlySavings - productFruitsPlanPrice)}`, 20, 121);
    
    // Add yearly summary
    pdf.setFontSize(18);
    pdf.setTextColor(255, 117, 29); // #FF751D - ProductFruits orange color
    pdf.text(`Annual Net Revenue Increase: ${formatCurrency(yearlyNetRevenue)}`, pageWidth / 2, 140, { align: "center" });
    
    // Add footer
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text("www.productfruits.com", pageWidth / 2, 260, { align: "center" });
  };

  const InfoTooltip = ({
    content
  }: {
    content: string;
  }) => <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help">
          <img 
            src="/lovable-uploads/3bcc2d94-904f-483c-9d32-c019de350fd6.png" 
            alt="Info" 
            className="h-4 w-4" 
          />
        </TooltipTrigger>
        <TooltipContent side="right" align="start" className="max-w-[250px]">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
    
  const productFruitsPlanPrice = getProductFruitsPlanPrice(customerCount);
  
  return <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Enter your data</CardTitle>
          <CardDescription>We'll use this to calculate your business impact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="customer-count" className="calculator-label">Number of customers</Label>
              <InfoTooltip content="The total number of customers." />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="customer-count" min={0} max={CUSTOMER_STEPS.length - 1} step={1} value={[customerSliderIndex]} onValueChange={([idx]) => setSliderByIndex(idx)} className="flex-1" />
              <Input type="number" value={customerCount} min={CUSTOMER_STEPS[0]} max={CUSTOMER_STEPS[CUSTOMER_STEPS.length - 1]} onChange={e => handleCustomerCountInputChange(setCustomerCount, e.target.value)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="average-revenue" className="calculator-label">Average revenue per customer (USD/month)</Label>
              <InfoTooltip content="The average monthly revenue generated by each customer." />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="average-revenue" min={10} max={200} step={1} value={[averageRevenuePerCustomer]} onValueChange={value => setAverageRevenuePerCustomer(value[0])} className="flex-1" />
              <Input type="number" value={averageRevenuePerCustomer} onChange={e => handleInputChange(setAverageRevenuePerCustomer, e.target.value, 10, 200)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-churn" className="calculator-label">Current churn rate</Label>
              <InfoTooltip content="Your current customer churn rate as a percentage." />
            </div>
            <div className="flex items-center gap-4">
              <Slider id="current-churn" min={1} max={20} step={1} value={[currentChurnRate]} onValueChange={value => setCurrentChurnRate(value[0])} className="flex-1" />
              <Input type="number" value={currentChurnRate} onChange={e => handleInputChange(setCurrentChurnRate, e.target.value, 1, 20)} className="w-24" />
            </div>
          </div>

          <div className="calculator-input">
            <div className="flex items-center justify-between">
              <Label htmlFor="churn-reduction" className="calculator-label">Estimated churn reduction (%)</Label>
              <InfoTooltip content="The standard reduction in churn rate based on Product Fruits data." />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm text-neutral-500">30%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Your user retention gains</CardTitle>
          <CardDescription>Based on your data, here's the business impact of Product Fruits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results && <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Saved customers</span>
                  <span className="font-medium">
                    {formatNumber(Math.round(customerCount * currentChurnRate / 100 * potentialChurnReduction))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Revenue saved monthly</span>
                  <span className="font-medium">{formatCurrency(results.monthlySavings)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Product Fruits monthly cost</span>
                  <span className="font-medium text-[#ff4747]">
                    -{formatCurrency(productFruitsPlanPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-600">Incremental net monthly revenue</span>
                  <span className="font-medium">{formatCurrency(results.monthlySavings - productFruitsPlanPrice)}</span>
                </div>
              </div>
              
              <div className="pt-4 flex justify-center items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Your yearly net revenue increase</p>
                  <p className="text-[28pt] font-bold text-[#03BF92]">
                    {formatCurrency((results.monthlySavings - productFruitsPlanPrice) * 12)}
                  </p>
                  {formSubmitted ? (
                    <Button 
                      variant="outline" 
                      className="mt-4 border-[#03BF92] text-[#03BF92] hover:bg-[#03BF92]/10" 
                      onClick={handleDownloadPDF}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF Report
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="mt-4 border-[#03BF92] text-[#03BF92] hover:bg-[#03BF92]/10" 
                      onClick={handleDownloadButtonClick}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Request PDF Report
                    </Button>
                  )}
                </div>
              </div>
            </div>}
        </CardContent>
      </Card>
      
      {/* Newsletter Signup Modal */}
      <Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Subscribe to get your report</DialogTitle>
            <DialogDescription>
              Please provide your details to receive your PDF report.
            </DialogDescription>
          </DialogHeader>
          
          <NewsletterForm 
            onSuccess={handleNewsletterSuccess}
            onCancel={() => setFormModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>;
};

export default ChurnCalculator;
