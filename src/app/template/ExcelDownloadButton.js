import React from 'react';
import * as XLSX from 'xlsx';

const ExcelDownloadButton = ({ data, fileName }) => {
  console.log('data',data);
  const downloadExcel = () => {
    // Convert data to Excel format
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Save the Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <button onClick={downloadExcel}>
      Download Excel
    </button>
  );
};

export default ExcelDownloadButton;
