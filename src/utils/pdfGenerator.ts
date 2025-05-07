
import jsPDF from "jspdf";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "./churnCalculator";

interface PDFData {
  customerCount: number;
  averageRevenuePerCustomer: number;
  currentChurnRate: number;
  results: {
    monthlySavings: number;
  };
  productFruitsPlanPrice: number;
}

export const generateAndDownloadPDF = (data: PDFData): void => {
  const { customerCount, averageRevenuePerCustomer, currentChurnRate, results, productFruitsPlanPrice } = data;
  const savedCustomers = Math.round(customerCount * currentChurnRate / 100 * 0.3); // 30% reduction
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
        createPDFContent(pdf, pageWidth, savedCustomers, netMonthlyRevenue, yearlyNetRevenue, productFruitsPlanPrice, results.monthlySavings, currentChurnRate, customerCount, averageRevenuePerCustomer);
        
        // Save the PDF
        pdf.save("product-fruits-roi-report.pdf");
        console.log("PDF saved successfully");
        toast.success("PDF report downloaded successfully");
      } catch (error) {
        console.error("Error adding logo:", error);
        // Fallback - just create the PDF without the logo
        createPDFContent(pdf, pageWidth, savedCustomers, netMonthlyRevenue, yearlyNetRevenue, productFruitsPlanPrice, results.monthlySavings, currentChurnRate, customerCount, averageRevenuePerCustomer);
        pdf.save("product-fruits-roi-report.pdf");
        console.log("PDF saved without logo");
        toast.success("PDF report downloaded (without logo)");
      }
    };
    
    logoImg.onerror = function() {
      console.error("Error loading logo");
      // Create PDF without the logo
      createPDFContent(pdf, pageWidth, savedCustomers, netMonthlyRevenue, yearlyNetRevenue, productFruitsPlanPrice, results.monthlySavings, currentChurnRate, customerCount, averageRevenuePerCustomer);
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

const createPDFContent = (
  pdf: jsPDF, 
  pageWidth: number, 
  savedCustomers: number, 
  netMonthlyRevenue: number, 
  yearlyNetRevenue: number, 
  productFruitsPlanPrice: number,
  monthlySavings: number,
  currentChurnRate: number,
  customerCount: number,
  averageRevenuePerCustomer: number
) => {
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
  pdf.text(`Monthly revenue saved: ${formatCurrency(monthlySavings)}`, 20, 107);
  pdf.text(`Product Fruits monthly cost: -${formatCurrency(productFruitsPlanPrice)}`, 20, 114);
  pdf.text(`Net monthly revenue increase: ${formatCurrency(monthlySavings - productFruitsPlanPrice)}`, 20, 121);
  
  // Add yearly summary
  pdf.setFontSize(18);
  pdf.setTextColor(255, 117, 29); // #FF751D - ProductFruits orange color
  pdf.text(`Annual Net Revenue Increase: ${formatCurrency(yearlyNetRevenue)}`, pageWidth / 2, 140, { align: "center" });
  
  // Add footer
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text("www.productfruits.com", pageWidth / 2, 260, { align: "center" });
};
