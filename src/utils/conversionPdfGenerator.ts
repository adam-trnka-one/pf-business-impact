
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import React from "react";
import { createRoot } from "react-dom/client";
import ConversionPDFReport from "@/components/ConversionPDFReport";

interface ConversionPDFData {
  monthlyTrials: number;
  currentConversion: number;
  conversionUplift: number;
  monthlyArpu: number;
  results: {
    additionalConversions: number;
    originalConversions: number;
    newConversions: number;
    monthlyRevenue: number;
    annualRevenue: number;
  };
  productFruitsPlanPrice: number;
}

export const generateAndDownloadConversionPDF = async (data: ConversionPDFData): Promise<void> => {
  try {
    console.log("Starting conversion PDF generation with html2canvas...");
    
    // Create a temporary container for the PDF report
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '794px';
    tempContainer.style.height = '1123px';
    document.body.appendChild(tempContainer);

    // Create React root and render the PDF report component
    const root = createRoot(tempContainer);
    
    // Create a promise to wait for the component to render
    await new Promise<void>((resolve, reject) => {
      const reportElement = React.createElement(ConversionPDFReport, data);
      root.render(reportElement);
      
      // Wait a bit for the component to fully render
      setTimeout(async () => {
        try {
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });

    // Capture the rendered content as canvas
    const targetElement = tempContainer.firstChild as HTMLElement;
    const canvas = await html2canvas(targetElement, {
      width: 794,
      height: 1123,
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [794, 1123]
    });

    // Add the canvas image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);

    // Save the PDF
    pdf.save("product-fruits-conversion-uplift-report.pdf");
    
    console.log("Conversion PDF generated successfully with html2canvas");
    toast.success("PDF report downloaded successfully");

    // Clean up
    root.unmount();
    document.body.removeChild(tempContainer);

  } catch (error) {
    console.error("Error in conversion PDF generation process:", error);
    toast.error("Failed to generate PDF report", {
      description: "Please try again later"
    });
  }
};
