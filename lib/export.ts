export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) return
  
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(obj => 
    Object.values(obj).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  )
  
  const csvContent = [headers, ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export async function exportToPDF(elementId: string, filename: string) {
  // Dynamically import jspdf and html2canvas internally to avoid SSR issues
  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')
  
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save(`${filename}.pdf`)
}
