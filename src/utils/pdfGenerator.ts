
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import React from "react";
import { createRoot } from "react-dom/client";
import PDFReport from "@/components/PDFReport";

interface PDFData {
  customerCount: number;
  averageRevenuePerCustomer: number;
  currentChurnRate: number;
  results: {
    monthlySavings: number;
  };
  productFruitsPlanPrice: number;
}

export const generateAndDownloadPDF = async (data: PDFData): Promise<void> => {
  try {
    console.log("Starting PDF generation with html2canvas...");
    
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
      const reportElement = React.createElement(PDFReport, data);
      root.render(reportElement);
      
      // Wait a bit for the component to fully render
      setTimeout(async () => {
        try {
          // Capture the rendered component as canvas
          const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
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
          pdf.save("product-fruits-roi-report.pdf");
          
          console.log("PDF generated successfully with html2canvas");
          toast.success("PDF report downloaded successfully");
          resolve();
        } catch (error) {
          console.error("Error generating PDF:", error);
          toast.error("Failed to generate PDF report");
          reject(error);
        }
      }, 1000); // Wait 1 second for rendering
    });

    // Clean up
    root.unmount();
    document.body.removeChild(tempContainer);

  } catch (error) {
    console.error("Error in PDF generation process:", error);
    toast.error("Failed to generate PDF report", {
      description: "Please try again later"
    });
  }
};
