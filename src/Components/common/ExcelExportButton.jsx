import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

const ExcelExportButton = ({ 
  data, 
  filename = 'export', 
  sheetName = 'Sheet1',
  className = '',
  buttonText = 'Export to Excel',
  columns = null // Optional: specify which columns to export and their headers
}) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    try {
      let exportData = data;

      // If columns are specified, filter and rename the data
      if (columns && Array.isArray(columns)) {
        exportData = data.map(item => {
          const newItem = {};
          columns.forEach(col => {
            if (typeof col === 'string') {
              newItem[col] = item[col];
            } else if (typeof col === 'object' && col.key && col.header) {
              // Handle nested objects
              const value = col.key.split('.').reduce((obj, key) => {
                return obj && obj[key] !== undefined ? obj[key] : '';
              }, item);
              newItem[col.header] = value;
            }
          });
          return newItem;
        });
      }

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-size columns
      const colWidths = [];
      const headers = Object.keys(exportData[0] || {});
      
      headers.forEach((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...exportData.map(row => String(row[header] || '').length)
        );
        colWidths[index] = { wch: Math.min(maxLength + 2, 50) };
      });
      
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const finalFilename = `${filename}_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, finalFilename);
      
      console.log(`تم تصدير ${exportData.length} سجل إلى ${finalFilename}`);
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      alert('حدث خطأ أثناء تصدير البيانات');
    }
  };

  return (
    <button
      onClick={exportToExcel}
      className={`btn-success flex items-center gap-2 ${className}`}
      title="Export data to Excel"
    >
      <Download className="w-4 h-4" />
      {buttonText}
    </button>
  );
};

export default ExcelExportButton;
