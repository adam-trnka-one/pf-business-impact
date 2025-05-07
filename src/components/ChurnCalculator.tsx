
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { calculateROI } from "@/utils/churnCalculator";
import { toast } from "sonner";
import { snapToNearestCustomerStep, CUSTOMER_STEPS, getProductFruitsPlanPrice } from "@/utils/customerSteps";
import { generateAndDownloadPDF } from "@/utils/pdfGenerator";
import ChurnCalculatorInputs from "./ChurnCalculatorInputs";
import ChurnCalculatorResults from "./ChurnCalculatorResults";
import NewsletterForm from "./NewsletterForm";

interface ROIResults {
  currentChurnRate: number;
  reducedChurnRate: number;
  monthlySavings: number;
  annualSavings: number;
  roi: number;
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
    
    // Trigger PDF download after successful subscription
    if (results) {
      generateAndDownloadPDF({
        customerCount,
        averageRevenuePerCustomer,
        currentChurnRate,
        results,
        productFruitsPlanPrice: getProductFruitsPlanPrice(customerCount)
      });
    }
  };
  
  const productFruitsPlanPrice = getProductFruitsPlanPrice(customerCount);
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Card className="md:col-span-1">
        <ChurnCalculatorInputs 
          customerCount={customerCount}
          setCustomerCount={setCustomerCount}
          averageRevenuePerCustomer={averageRevenuePerCustomer}
          setAverageRevenuePerCustomer={setAverageRevenuePerCustomer}
          currentChurnRate={currentChurnRate}
          setCurrentChurnRate={setCurrentChurnRate}
          customerSliderIndex={customerSliderIndex}
          setSliderByIndex={setSliderByIndex}
          handleCustomerCountInputChange={handleCustomerCountInputChange}
          handleInputChange={handleInputChange}
        />
      </Card>

      <Card className="md:col-span-1">
        <ChurnCalculatorResults 
          customerCount={customerCount}
          currentChurnRate={currentChurnRate}
          results={results}
          productFruitsPlanPrice={productFruitsPlanPrice}
        />
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
    </div>
  );
};

export default ChurnCalculator;
