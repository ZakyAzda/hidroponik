import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Kita definisikan tipe data order di sini agar aman
interface OrderItem {
  quantity: number;
  product: { name: string };
}

interface OrderData {
  id: number;
  user: { name: string };
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
}

interface PDFParams {
  title: string;
  orders: OrderData[];
  startDate: string;
  endDate: string;
  filterStatus: string;
  themeColor: [number, number, number]; 
}

export const generateOrderPDF = ({
  title,
  orders,
  startDate,
  endDate,
  filterStatus,
  themeColor
}: PDFParams) => {
  const doc = new jsPDF();

  // --- 0. HITUNG TOTAL & TENTUKAN LABEL ---
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const formattedTotalRevenue = `Rp ${totalRevenue.toLocaleString('id-ID')}`;

  // LOGIKA BARU: Tentukan label berdasarkan status filter
  let revenueLabel = 'Pendapatan Sementara'; // Default jika filter 'all'
  
  if (filterStatus !== 'all') {
    const statusMap: { [key: string]: string } = {
        'pending': 'Pending',
        'processing': 'Dikemas',
        'shipped': 'Diperjalanan',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    const statusText = statusMap[filterStatus] || filterStatus;
    revenueLabel = `Total ${statusText}`;
  }

  // Background header dengan warna tema
  doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.rect(0, 0, 210, 45, 'F');

  // Accent bar di sisi kiri
  doc.setFillColor(themeColor[0] - 30, themeColor[1] - 30, themeColor[2] - 30);
  doc.rect(0, 0, 8, 45, 'F');

  // --- 1. KOP SURAT ---
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ARIF HIDROFARM', 14, 18);

  // Icon/Badge
  doc.setFillColor(255, 255, 255);
  doc.circle(185, 15, 8, 'F');
  doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('AH', 185, 16.5, { align: 'center' });

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 240, 240);
  doc.text('Premium Hydroponic Solutions', 14, 25);

  // Alamat Toko
  doc.setFontSize(8);
  doc.setTextColor(230, 230, 230);
  doc.text('Alamat: Jl. Hidroponik Sejahtera No. 123, Kota Petani, Indonesia', 14, 32);
  doc.text('Email: admin@arifhidrofarm.com  |  Telp: 0812-3456-7890', 14, 37);

  // Decorative line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(14, 42, 196, 42);

  // --- 2. JUDUL & INFO SECTION ---
  // Card container
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(14, 50, 182, 25, 2, 2, 'F');
  
  // Border card
  doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, 50, 182, 25, 2, 2, 'S');

  // Judul Laporan
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 18, 58);

  // Tanggal Cetak
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const printDate = `Dicetak: ${new Date().toLocaleString('id-ID')}`;
  doc.text(printDate, 192, 57, { align: 'right' });

  // Filter Info
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  let filterText = 'Filter: Semua Data';
  if (filterStatus !== 'all') filterText += ` | Status: ${filterStatus.toUpperCase()}`;
  if (startDate || endDate) filterText += ` | Periode: ${startDate || '?'} s/d ${endDate || '?'}`;
  doc.text(filterText, 18, 65);

  // --- INFO PENDAPATAN DI CARD (Gunakan revenueLabel) ---
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  // Tampilkan label dinamis di sini
  doc.text(`${revenueLabel}: ${formattedTotalRevenue}`, 192, 70, { align: 'right' });


  // --- 3. DATA TABEL ---
  const tableRows = orders.map((order) => [
    `#${order.id.toString().padStart(5, '0')}`,
    order.user.name,
    new Date(order.createdAt).toLocaleDateString('id-ID'),
    order.items.map((i) => `${i.product.name} (${i.quantity})`).join(', '),
    `Rp ${order.totalAmount.toLocaleString('id-ID')}`,
    order.status.toUpperCase(),
  ]);

  // --- 4. RENDER TABEL ---
  autoTable(doc, {
    head: [['ID', 'Pelanggan', 'Tanggal', 'Item', 'Total', 'Status']],
    body: tableRows,
    // Gunakan revenueLabel di footer tabel juga
    foot: [
        ['', '', '', revenueLabel.toUpperCase(), formattedTotalRevenue, '']
    ],
    startY: 80,
    theme: 'grid',
    styles: { 
      fontSize: 9, 
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: themeColor, 
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 10,
      cellPadding: 4
    },
    // Styling Footer
    footStyles: {
        fillColor: [240, 240, 240],
        textColor: themeColor,
        fontStyle: 'bold',
        halign: 'right',
        fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { halign: 'center', cellWidth: 25 },
      3: { cellWidth: 'auto' },
      4: { halign: 'right', fontStyle: 'bold', cellWidth: 35 },
      5: { halign: 'center', cellWidth: 25 },
    },
    didDrawPage: (data) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      
      // Footer Halaman
      doc.setFillColor(248, 249, 250);
      doc.rect(0, doc.internal.pageSize.height - 20, 210, 20, 'F');
      
      doc.setDrawColor(themeColor[0], themeColor[1], themeColor[2]);
      doc.setLineWidth(0.5);
      doc.line(14, doc.internal.pageSize.height - 20, 196, doc.internal.pageSize.height - 20);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      const str = `Halaman ${pageCount}`;
      
      const leftMargin = data.settings.margin.left;
      doc.text(str, leftMargin, doc.internal.pageSize.height - 10);
      
      doc.setTextColor(180, 180, 180);
      doc.text('ARIF HIDROFARM © 2025', 105, doc.internal.pageSize.height - 10, { align: 'center' });
      
      doc.text('Dokumen Resmi', 196, doc.internal.pageSize.height - 10, { align: 'right' });
    },
  });

  // Simpan File
  const fileName = title.replace(/ /g, '_') + `_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};