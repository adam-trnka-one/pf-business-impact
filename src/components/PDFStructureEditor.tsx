
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

const defaultTemplate = `<div className="w-[794px] h-[1123px] bg-gray-50 p-12 font-sans text-black relative overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
  {/* Header with Logo */}
  <div className="flex items-center mb-12">
    <div className="flex items-center">
      <div className="bg-[#ff4747] text-white px-6 py-3 rounded-lg font-bold text-xl mr-4">
        ProductFruits
      </div>
      <div className="text-gray-600 text-sm">
        User Experience Platform
      </div>
    </div>
  </div>

  {/* Main Title Section */}
  <div className="mb-16">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">
      Your Yearly Net Revenue Increase
    </h1>
    <p className="text-gray-600 text-lg">
      ROI Analysis Report - Generated on {{today}}
    </p>
  </div>

  {/* Annual Summary - Highlighted Box */}
  <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-12 border-l-4 border-green-500">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      Annual Net Revenue Increase
    </h2>
    <p className="text-5xl font-bold text-green-600 mb-4">
      {{yearlyNetRevenue}}
    </p>
    <p className="text-gray-600">
      Based on {{savedCustomers}} customers retained through improved user experience
    </p>
  </div>

  {/* Business Metrics Summary */}
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Business Metrics</h3>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Total Customers:</span>
        <span className="font-medium">{{customerCount}}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Avg Revenue/Customer:</span>
        <span className="font-medium">{{averageRevenuePerCustomer}}/mo</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Current Churn Rate:</span>
        <span className="font-medium">{{currentChurnRate}}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Monthly Savings:</span>
        <span className="font-medium">{{monthlySavings}}</span>
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="absolute bottom-8 left-0 right-0 text-center">
    <p className="text-sm text-gray-500">
      www.productfruits.com | Your partner in user retention
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
    .replace(/\{\{averageRevenuePerCustomer\}\}/g, `$${averageRevenuePerCustomer}`)
    .replace(/\{\{currentChurnRate\}\}/g, currentChurnRate.toString())
    .replace(/\{\{monthlySavings\}\}/g, `$${results.monthlySavings.toLocaleString()}`);

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
