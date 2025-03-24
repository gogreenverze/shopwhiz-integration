
// Utility functions for exporting data to PDF and CSV formats

/**
 * Generate a PDF document for a given element ID
 * @param elementId ID of the element to convert to PDF (if 'invoice' mode, this is ignored)
 * @param title Title of the PDF document
 * @param mode Optional mode for special formatting (e.g., 'invoice')
 * @param data Optional data for invoice mode
 */
export const generatePDF = (elementId: string, title: string, mode?: string, data?: any) => {
  // In a real app, this would use a library like jsPDF, html2canvas, or pdfmake
  // For this demo, we'll create a simulated PDF download
  
  console.log(`Generating PDF for ${elementId} with title: ${title}`);
  
  if (mode === 'invoice' && data) {
    console.log('Invoice data:', data);
    // In a real implementation, this would generate an invoice PDF with the sale data
  }
  
  // Simulate PDF download with a delay
  setTimeout(() => {
    const blob = new Blob(['PDF Content Simulation'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 500);
};

/**
 * Export data to a CSV file
 * @param data Array of arrays containing data rows
 * @param headers Array of column headers
 * @param filename Filename for the exported CSV
 */
export const exportCSV = (data: any[][], headers: string[], filename: string) => {
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
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
