
// Utility functions for exporting data to PDF and CSV formats
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from "sonner";

/**
 * Generate a PDF document for a given element ID
 * @param elementId ID of the element to convert to PDF (if 'invoice' mode, this is ignored)
 * @param title Title of the PDF document
 * @param mode Optional mode for special formatting (e.g., 'invoice')
 * @param data Optional data for invoice mode
 */
export const generatePDF = async (elementId: string, title: string, mode?: string, data?: any) => {
  // Show a loading toast
  toast.loading('Generating PDF...');
  
  console.log(`Generating PDF for ${elementId} with title: ${title}`);
  
  try {
    if (mode === 'invoice' && data) {
      console.log('Invoice data:', data);
      // Generate an invoice PDF with the sale data
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text(`Invoice #${data.id}`, 20, 20);
      
      // Add date
      pdf.setFontSize(12);
      const date = new Date(data.createdAt);
      pdf.text(`Date: ${date.toLocaleDateString()}`, 20, 30);
      
      // Add customer info
      pdf.text(`Customer: ${data.customerName || 'Guest'}`, 20, 40);
      
      // Add items table header
      pdf.setFontSize(10);
      pdf.text("Item", 20, 60);
      pdf.text("Qty", 100, 60);
      pdf.text("Price", 130, 60);
      pdf.text("Total", 160, 60);
      
      // Add horizontal line
      pdf.line(20, 65, 190, 65);
      
      // Add items
      let yPos = 75;
      (data.items || []).forEach((item: any, index: number) => {
        pdf.text(item.productName || `Product ${index + 1}`, 20, yPos);
        pdf.text(item.quantity?.toString() || "1", 100, yPos);
        pdf.text(`$${item.unitPrice?.toFixed(2) || "0.00"}`, 130, yPos);
        pdf.text(`$${item.total?.toFixed(2) || "0.00"}`, 160, yPos);
        yPos += 10;
      });
      
      // Add horizontal line
      pdf.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Add totals
      pdf.text("Subtotal:", 120, yPos);
      pdf.text(`$${data.total?.toFixed(2) || "0.00"}`, 160, yPos);
      yPos += 10;
      
      pdf.text("Tax:", 120, yPos);
      pdf.text(`$${data.tax?.toFixed(2) || "0.00"}`, 160, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.text("TOTAL:", 120, yPos);
      pdf.text(`$${data.grandTotal?.toFixed(2) || "0.00"}`, 160, yPos);
      
      // Save the PDF
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      toast.dismiss();
      toast.success('Invoice PDF generated successfully');
    } else {
      // Handle report PDF export
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element with ID ${elementId} not found`);
        toast.dismiss();
        toast.error(`Element with ID ${elementId} not found`);
        return;
      }
      
      // Use html2canvas with better settings for tables and graphs
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(title, 10, 10);
      
      // Calculate dimensions to fit the image on the page
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 20; // Start position after title
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);
      
      // Add new pages if content doesn't fit on one page
      while (heightLeft > 0) {
        position = 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position - imgHeight + heightLeft, imgWidth, imgHeight);
        heightLeft -= (pageHeight - position);
      }
      
      // Save the PDF
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      toast.dismiss();
      toast.success('Report PDF generated successfully');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.dismiss();
    toast.error('Error generating PDF');
  }
};

/**
 * Export data to a CSV file
 * @param data Array of arrays containing data rows
 * @param headers Array of column headers
 * @param filename Filename for the exported CSV
 */
export const exportCSV = (data: any[][], headers: string[], filename: string) => {
  toast.loading('Exporting CSV...');
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      row.map(cell => {
        // Handle cells that contain commas by wrapping in quotes
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');
  
  // Create blob and download
  setTimeout(() => {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.dismiss();
      toast.error('Error exporting CSV');
    }
  }, 300);
};

