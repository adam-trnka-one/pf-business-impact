
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import React from "react";
import { createRoot } from "react-dom/client";
import SupportPDFReport from "@/components/SupportPDFReport";

interface SupportPDFData {
  ticketsPerMonth: number;
  timePerTicket: number;
  hourlyRate: number;
  ticketReduction: number;
  userCount: number;
  results: {
    totalTimeSpent: number;
    totalCost: number;
    estimatedSavings: {
      monthly: number;
      annual: number;
    };
    potentialTicketsReduced: number;
    netSavings: {
      monthly: number;
      annual: number;
    };
  };
  monthlyPaymentTier: number;
}

export const generateAndDownloadSupportPDF = async (data: SupportPDFData): Promise<void> => {
  try {
    console.log("Starting support PDF generation with html2canvas...");
    
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
      const reportElement = React.createElement(SupportPDFReport, data);
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
    pdf.save("product-fruits-support-savings-report.pdf");
    
    console.log("Support PDF generated successfully with html2canvas");
    toast.success("PDF report downloaded successfully");

    // Clean up
    root.unmount();
    document.body.removeChild(tempContainer);

  } catch (error) {
    console.error("Error in support PDF generation process:", error);
    toast.error("Failed to generate PDF report", {
      description: "Please try again later"
    });
  }
};
