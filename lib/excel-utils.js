// Excel export utilities for accounting reports

export const convertToExcelFormat = (data) => {
  // Convert data to Excel-compatible format
  return data.map(row => ({
    ...row
  }))
}

export const downloadExcelWithSingleTab = (data, sheetName, fileName) => {
  try {
    // Create CSV content
    if (!data || data.length === 0) {
      console.warn('No data to export')
      return
    }

    // Get headers from first row
    const headers = Object.keys(data[0])
    
    // Create CSV content
    const csvContent = [
      // Header row
      headers.join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || ''
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${fileName}-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Error downloading Excel file:', error)
    alert('Failed to download report. Please try again.')
  }
}
