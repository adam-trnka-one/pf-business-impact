
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, Download, RotateCcw } from "lucide-react";
import { generateAndDownloadPDF } from "@/utils/pdfGenerator";

interface PDFStructureEditorProps {
  customerCount: number;
  averageRevenuePerCustomer: number;
  currentChurnRate: number;
  results: {
    monthlySavings: number;
  };
  productFruitsPlanPrice: number;
}

const defaultTemplate = `<div className="w-[794px] h-[1123px] bg-white p-12 font-sans text-black relative overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
  {/* Header with Logo */}
  <div className="flex items-center mb-8">
    <div className="flex items-center">
      <svg width="40" height="40" viewBox="0 0 40 40" className="mr-3">
        <circle cx="12" cy="12" r="4" fill="#FF751D"/>
        <circle cx="20" cy="8" r="3" fill="#FF751D"/>
        <circle cx="28" cy="12" r="4" fill="#FF751D"/>
        <circle cx="16" cy="20" r="3" fill="#FF751D"/>
        <circle cx="24" cy="20" r="3" fill="#FF751D"/>
        <path d="M8 16 Q12 12 16 16 Q20 8 24 16 Q28 12 32 16" stroke="#4A5568" strokeWidth="2" fill="none"/>
      </svg>
      <div>
        <span className="text-2xl font-bold text-gray-800">Product </span>
        <span className="text-2xl font-bold text-orange-500">Fruits</span>
      </div>
    </div>
  </div>

  {/* Main Title */}
  <div className="mb-12">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">
      Calculation of the business impact of Product Fruits
    </h1>
    <p className="text-gray-600 text-base leading-relaxed">
      Poor onboarding doesn't just frustrate users. It costs you in churn, conversions, and support overhead.
    </p>
  </div>

  {/* Tab-like section */}
  <div className="mb-8">
    <div className="flex border-b border-gray-200">
      <div className="px-6 py-3 bg-orange-50 border-b-2 border-orange-500 text-orange-600 font-medium text-sm">
        📉 Churn reduction
      </div>
      <div className="px-6 py-3 text-gray-500 font-medium text-sm">
        📊 Support cost reduction
      </div>
      <div className="px-6 py-3 text-gray-500 font-medium text-sm">
        📈 Revenue uplift
      </div>
    </div>
    
    {/* Info box */}
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 flex items-center">
      <div className="bg-orange-100 rounded-full p-2 mr-3">
        <span className="text-orange-600 text-sm">ℹ️</span>
      </div>
      <p className="text-sm text-gray-700">
        Clients using Product Fruits see a <strong>30-70% reduction</strong> in customer churn after implementing automated onboarding.
      </p>
    </div>
  </div>

  {/* Two Column Layout */}
  <div className="grid grid-cols-2 gap-8 mb-12">
    {/* Left Column - Your entered data */}
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Your entered data</h2>
      <p className="text-sm text-gray-500 mb-6">We'll use this to calculate your business impact</p>
      
      <div className="space-y-4">
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Number of customers</span>
          <span className="font-medium">{{customerCount}}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Average revenue per customer (USD/month)</span>
          <span className="font-medium">{{averageRevenuePerCustomer}}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Current churn rate (%)</span>
          <span className="font-medium">{{currentChurnRate}}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Estimated churn reduction (%)</span>
          <span className="font-medium">30</span>
        </div>
      </div>
    </div>

    {/* Right Column - Your user retention gains */}
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Your user retention gains</h2>
      <p className="text-sm text-gray-500 mb-6">Based on your data, here's the business impact of Product Fruits</p>
      
      <div className="space-y-4">
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Saved customers</span>
          <span className="font-medium">{{savedCustomers}}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Revenue saved monthly</span>
          <span className="font-medium">{{monthlySavings}}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Product Fruits monthly cost</span>
          <span className="font-medium text-red-600">-$139</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-700">Incremental net monthly revenue</span>
          <span className="font-medium">{{netMonthlyRevenue}}</span>
        </div>
      </div>
    </div>
  </div>

  {/* Large Revenue Number */}
  <div className="text-center mb-16">
    <h2 className="text-2xl text-gray-500 mb-4">Your yearly net revenue increase</h2>
    <div className="text-6xl font-bold text-green-500 mb-8">
      {{yearlyNetRevenue}}
    </div>
  </div>

  {/* Footer */}
  <div className="text-center">
    <p className="text-sm text-gray-600">
      Speak with our specialist about your use case today. Link to demo https://productfruits.com/demo
    </p>
  </div>
</div>`;

const PDFStructureEditor: React.FC<PDFStructureEditorProps> = ({
  customerCount,
  averageRevenuePerCustomer,
  currentChurnRate,
  results,
  productFruitsPlanPrice
}) => {
  const [htmlStructure, setHtmlStructure] = useState(defaultTemplate);
  const [showPreview, setShowPreview] = useState(false);

  const savedCustomers = Math.round(customerCount * currentChurnRate / 100 * 0.3);
  const netMonthlyRevenue = results.monthlySavings - productFruitsPlanPrice;
  const yearlyNetRevenue = netMonthlyRevenue * 12;
  const today = new Date().toLocaleDateString();

  // Replace template variables with actual values
  const processedHtml = htmlStructure
    .replace(/\{\{today\}\}/g, today)
    .replace(/\{\{yearlyNetRevenue\}\}/g, `$${yearlyNetRevenue.toLocaleString()}`)
    .replace(/\{\{savedCustomers\}\}/g, savedCustomers.toString())
    .replace(/\{\{customerCount\}\}/g, customerCount.toLocaleString())
    .replace(/\{\{averageRevenuePerCustomer\}\}/g, averageRevenuePerCustomer.toString())
    .replace(/\{\{currentChurnRate\}\}/g, currentChurnRate.toString())
    .replace(/\{\{monthlySavings\}\}/g, `$${results.monthlySavings.toLocaleString()}`)
    .replace(/\{\{netMonthlyRevenue\}\}/g, `$${netMonthlyRevenue.toLocaleString()}`);

  const handleDownloadPDF = () => {
    generateAndDownloadPDF({
      customerCount,
      averageRevenuePerCustomer,
      currentChurnRate,
      results,
      productFruitsPlanPrice,
      customHtml: processedHtml
    });
  };

  const resetToDefault = () => {
    setHtmlStructure(defaultTemplate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="pdf-structure" className="text-base font-medium">
          PDF Structure Editor
        </Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600">
        Edit the HTML structure for your PDF. Use variables like customerCount, yearlyNetRevenue, etc. wrapped in double curly braces.
      </p>

      <Textarea
        id="pdf-structure"
        value={htmlStructure}
        onChange={(e) => setHtmlStructure(e.target.value)}
        className="min-h-[400px] font-mono text-sm"
        placeholder="Enter your PDF HTML structure here..."
      />

      {showPreview && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Preview (scaled down):</h3>
          <div 
            className="border bg-white transform scale-50 origin-top-left overflow-hidden"
            style={{ width: '397px', height: '561px' }}
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        </div>
      )}

      <Button 
        onClick={handleDownloadPDF}
        className="bg-[#ff4747] hover:bg-[#e63e3e] text-white px-6 py-2"
      >
        <Download className="w-4 h-4 mr-2" />
        Download PDF with Custom Structure
      </Button>
    </div>
  );
};

export default PDFStructureEditor;
