const addItemBtn = document.getElementById('addItem');
const generatePDFBtn = document.getElementById('generatePDF');
const tableBody = document.querySelector('#invoiceTable tbody');
const totalText = document.getElementById('total');

let items = [];

addItemBtn.addEventListener('click', () => {
  const service = document.getElementById('service').value;
  const amount = parseFloat(document.getElementById('amount').value);
  if (!service || isNaN(amount)) return alert("Please fill in both fields.");

  items.push({ service, amount });
  updateTable();

  document.getElementById('service').value = '';
  document.getElementById('amount').value = '';
});

function updateTable() {
  tableBody.innerHTML = '';
  let total = 0;
  items.forEach((item, index) => {
    total += item.amount;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.service}</td>
      <td>ZAR ${item.amount.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });

  totalText.textContent = `Total: ZAR ${total.toFixed(2)}`;
}

generatePDFBtn.addEventListener('click', () => {
  const client = document.getElementById('clientName').value || 'N/A';
  const clientAddress = document.getElementById('clientAddress').value || 'N/A';
  const provider = document.getElementById('serviceProvider').value || 'N/A';
  const providerAddress = document.getElementById('providerAddress').value || 'N/A';

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.setTextColor('#00796b');
  doc.text("Invoice", 14, 22);

  // Draw line under title
  doc.setDrawColor('#00796b');
  doc.setLineWidth(0.5);
  doc.line(14, 26, 196, 26);

  // Service Provider details
  doc.setFontSize(12);
  doc.setTextColor('#333');
  doc.text("Service Provider:", 14, 36);
  doc.setFontSize(10);
  doc.text(provider, 14, 42);
  doc.text(providerAddress, 14, 48);

  // Client details
  doc.setFontSize(12);
  doc.text("Client:", 140, 36);
  doc.setFontSize(10);
  doc.text(client, 140, 42);
  doc.text(clientAddress, 140, 48);

  // Invoice date
  doc.setFontSize(10);
  doc.setTextColor('#555');
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 58);

  // Table with invoice items
  const rows = items.map((item, index) => [
    index + 1,
    item.service,
    `ZAR ${item.amount.toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 65,
    head: [['#', 'Service', 'Amount']],
    body: rows,
    theme: 'striped',
    styles: {
      fontSize: 11,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [0, 121, 107], // teal color
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [224, 242, 241]
    },
    columnStyles: {
      2: { halign: 'right' }
    }
  });

  // Total amount, aligned right under the table
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const finalY = doc.lastAutoTable.finalY || 65;
  doc.setFontSize(12);
  doc.setTextColor('#00796b');
  doc.text(`Total: ZAR ${total.toFixed(2)}`, 170, finalY + 10, null, null, 'right');

  doc.save('invoice.pdf');
});
