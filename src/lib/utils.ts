import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jsPDF } from 'jspdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return 'Never';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function countWordsAndChars(text: string) {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.ceil(words / 200); // Average 200 WPM
  return { chars, words, readTimeMinutes };
}

export function exportToTxt(filename: string, subject: string, body: string) {
  const content = `Subject: ${subject}\n\n${body}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename || 'email'}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToPdf(filename: string, subject: string, body: string, recipient = '') {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const margin = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;

  // Header banner
  doc.setFillColor(15, 31, 51); // Navy 900
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ScribeAI Professional Document', margin, 35);

  // Metadata
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Subject:', margin, 90);

  doc.setFont('helvetica', 'normal');
  const splitSubject = doc.splitTextToSize(subject || 'Untitled Email', maxLineWidth - 60);
  doc.text(splitSubject, margin + 60, 90);

  let currentY = 90 + splitSubject.length * 15 + 10;

  if (recipient) {
    doc.setFont('helvetica', 'bold');
    doc.text('Recipient:', margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(recipient, margin + 65, currentY);
    currentY += 25;
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 25;

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);

  const lines = doc.splitTextToSize(body || '', maxLineWidth);
  doc.text(lines, margin, currentY);

  doc.save(`${filename || 'email'}.pdf`);
}
