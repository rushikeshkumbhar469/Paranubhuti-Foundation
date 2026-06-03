const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');

// Helper to convert number to Indian Rupees words
function amountInWords(amount) {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const num = Math.floor(amount);
  if (num === 0) return 'Zero Rupees';
  
  function helper(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);
    if (n < 100000) return helper(Math.floor(n / 1000)) + ' Thousand ' + helper(n % 1000);
    if (n < 10000000) return helper(Math.floor(n / 100000)) + ' Lakh ' + helper(n % 100000);
    return helper(Math.floor(n / 10000000)) + ' Crore ' + helper(n % 10000000);
  }
  
  return helper(num).trim() + ' Rupees Only';
}

const generatePdf = async (request) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  let qrUrl = '';
  
  if (request.docType === 'id') {
    qrUrl = `${frontendUrl}/generate-id?requestId=${request.requestNumber}`;
  } else if (request.docType === 'receipt') {
    qrUrl = `${frontendUrl}/receipt?requestId=${request.requestNumber}`;
  } else if (request.docType === 'certificate') {
    qrUrl = `${frontendUrl}/certificate/${request.certificateType || 'participation'}?requestId=${request.requestNumber}`;
  }
  
  // Generate QR Code data URL
  const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, { margin: 1, width: 200 });

  if (request.docType === 'id') {
    // Standard CR80 ID Card dimensions: 54mm width, 85.6mm height
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [54, 85.6]
    });

    // Dark Slate Background
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 54, 85.6, 'F');

    // Top Header Banner (Rose color)
    doc.setFillColor(225, 29, 72); // rose-600 (brand)
    doc.rect(0, 0, 54, 12, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('PARANUBHUTI', 27, 5, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(5);
    doc.text('FOUNDATION', 27, 8.5, { align: 'center' });

    // Photo Box Placeholder
    doc.setDrawColor(51, 65, 85); // slate-700
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(19, 17, 16, 16, 'FD');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(6);
    doc.text('VOLUNTEER', 27, 26, { align: 'center' });

    // Volunteer Name & Role
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(request.fullName.toUpperCase(), 27, 39, { align: 'center' });

    doc.setTextColor(225, 29, 72); // rose-600
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(request.role || 'Volunteer', 27, 43, { align: 'center' });

    // Inner details divider line
    doc.setDrawColor(51, 65, 85);
    doc.line(6, 46, 48, 46);

    // Detail Columns
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(4.5);
    doc.text('JOINED ON', 6, 50);
    doc.text('BLOOD GROUP', 30, 50);

    const joinDateStr = request.joinDate 
      ? new Date(request.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '—';
      
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text(joinDateStr, 6, 53.5);
    doc.text(request.bloodGroup || 'O+', 30, 53.5);

    // Bottom divider line
    doc.setDrawColor(51, 65, 85);
    doc.line(6, 56, 48, 56);

    // Signatory and QR Code section
    doc.setTextColor(148, 163, 184);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(4);
    doc.text('AUTHORIZED SIGNATORY', 6, 61);
    
    // Fake Elegant Signature
    doc.setTextColor(255, 255, 255);
    doc.setFont('Courier', 'oblique');
    doc.setFontSize(7.5);
    doc.text('P. Foundation', 6, 66);
    
    // Request Number at bottom
    doc.setTextColor(148, 163, 184);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(4.5);
    doc.text(request.requestNumber, 6, 73);

    // Embed QR code
    doc.addImage(qrCodeDataUrl, 'PNG', 34, 59, 14, 14);

    // Footer Info
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 80, 54, 5.6, 'F');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(3.8);
    doc.text('FOR FIELD VERIFICATION, SCAN QR CODE', 27, 83.5, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));

  } else if (request.docType === 'receipt') {
    // Standard A4: 210mm x 297mm
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Outer Decorative Border
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(10, 10, 190, 277);

    // Brand Accent Header Bar
    doc.setFillColor(225, 29, 72); // rose-600
    doc.rect(10, 10, 190, 4, 'F');

    // Foundation Logo/Header Title
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PARANUBHUTI FOUNDATION', 105, 28, { align: 'center' });
    
    doc.setTextColor(225, 29, 72);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('STAND FOR HUMANITY • REGISTERED NGO', 105, 33, { align: 'center' });

    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Reg No. 80-2023-PBD3 | Section 80G Tax-Exempt Status Approved', 105, 38, { align: 'center' });
    doc.text('Office: E-45, 2nd Floor, South Extension Part I, New Delhi, Delhi 110049', 105, 42, { align: 'center' });

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 48, 190, 48);

    // Title of Document
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('OFFICIAL DONATION RECEIPT', 105, 57, { align: 'center' });

    // Receipt details block
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    
    // Receipt Info (Left)
    doc.text(`Receipt ID: ${request.requestNumber}`, 20, 72);
    const dateStr = request.date
      ? new Date(request.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Date of Receipt: ${dateStr}`, 20, 78);

    // Tax Details (Right)
    doc.text(`Tax exemption status: Eligible (80G)`, 130, 72);
    doc.text(`Donor PAN/Tax ID: ${request.pan ? request.pan.toUpperCase() : 'Not Provided'}`, 130, 78);

    // Main Transaction Content Table
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, 88, 170, 60, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, 88, 170, 60);

    // Table Header
    doc.line(20, 98, 190, 98);
    doc.setFont('Helvetica', 'bold');
    doc.text('DONOR DETAILS & PURPOSE', 25, 94);
    doc.text('AMOUNT (INR)', 150, 94);

    // Table Body Values
    doc.setFont('Helvetica', 'normal');
    doc.text(`Received with thanks from:`, 25, 106);
    doc.setFont('Helvetica', 'bold');
    doc.text(request.fullName.toUpperCase(), 75, 106);
    
    doc.setFont('Helvetica', 'normal');
    doc.text(`Purpose / Project Fund:`, 25, 114);
    doc.text(request.project || 'General Fund', 75, 114);

    doc.text(`Mode of Delivery:`, 25, 122);
    doc.text(request.deliveryMethod === 'email' ? 'Email Transfer' : 'Download Link', 75, 122);

    // Amount Col
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(225, 29, 72);
    doc.setFontSize(13);
    doc.text(`INR ${Number(request.amount || 0).toLocaleString('en-IN')}/-`, 150, 112);

    // Divider for total word amount
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 130, 190, 130);

    // Amount in Words
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.text(`Amount in Words: ${amountInWords(request.amount || 0)}`, 25, 137);

    // Declaration note
    doc.setTextColor(100, 116, 139);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('* This donation is eligible for 50% tax exemption under Section 80G of the Income Tax Act, 1961.', 20, 158);

    // Signatures and QR Code
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 168, 190, 168);

    // QR Verification description
    doc.setTextColor(71, 85, 105);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('SCAN QR CODE TO VERIFY RECEIPT', 20, 185);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('This is an authentic receipt issued dynamically from', 20, 190);
    doc.text('our digital donation records. Verify directly on website.', 20, 194);

    // Embed QR code
    doc.addImage(qrCodeDataUrl, 'PNG', 20, 198, 25, 25);

    // Authorized Signatory info (Right side)
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('A.K. Sharma', 145, 185);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('PROJECT DIRECTOR', 145, 189);
    doc.text('PARANUBHUTI FOUNDATION', 145, 193);

    // Fake Elegant Signature (drawn path or script font)
    doc.setTextColor(15, 23, 42);
    doc.setFont('Courier', 'oblique');
    doc.setFontSize(15);
    doc.text('AKSharma', 145, 212);

    // Thank you banner
    doc.setFillColor(244, 63, 94); // rose-500
    doc.rect(20, 238, 170, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('THANK YOU FOR YOUR VALUABLE CONTRIBUTION', 105, 249, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Your kindness fuels equality, education, and development projects.', 105, 254, { align: 'center' });

    // Official Footer
    doc.setTextColor(148, 163, 184);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('This is a system-generated document and requires no physical seal.', 105, 278, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));

  } else if (request.docType === 'certificate') {
    // Landscape A4 size: 297mm x 210mm
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background Elegant Border
    doc.setDrawColor(225, 29, 72); // rose-600
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(15, 23, 42); // slate-900
    doc.setLineWidth(0.4);
    doc.rect(13, 13, 271, 184);

    // Corner decorative lines
    doc.line(10, 20, 20, 10);
    doc.line(287, 20, 277, 10);
    doc.line(10, 190, 20, 200);
    doc.line(287, 190, 277, 200);

    // Certificate Header
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('PARANUBHUTI FOUNDATION', 148.5, 28, { align: 'center', charSpace: 3 });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('STAND FOR HUMANITY', 148.5, 32, { align: 'center', charSpace: 2 });

    // Divider under header
    doc.setFillColor(225, 29, 72); // rose-600
    doc.rect(133.5, 36, 30, 0.8, 'F');

    // Main Certificate Title
    const certTitles = {
      participation: 'CERTIFICATE OF PARTICIPATION',
      internship: 'CERTIFICATE OF INTERNSHIP',
      achievement: 'CERTIFICATE OF ACHIEVEMENT',
      training: 'CERTIFICATE OF TRAINING COMPLETION'
    };
    const titleText = certTitles[request.certificateType] || 'CERTIFICATE OF RECOGNITION';
    
    doc.setTextColor(225, 29, 72); // rose-600
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(titleText, 148.5, 52, { align: 'center' });

    // Certificate Body
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.text('THIS IS PROUDLY PRESENTED TO', 148.5, 72, { align: 'center', charSpace: 1 });

    // Participant Name (Big Bold)
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(request.fullName.toUpperCase(), 148.5, 87, { align: 'center' });

    // Underline name
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(58.5, 93, 238.5, 93);

    // Body texts mapped to certificate types
    const certBodies = {
      participation: 'for actively participating and successfully completing the social service program titled',
      internship: 'for successfully completing their professional internship project titled',
      achievement: 'in recognition of outstanding leadership, dedication, and exemplary achievements in',
      training: 'for successfully completing the vocational skill training program titled'
    };
    const bodyText = certBodies[request.certificateType] || 'for dedication and outstanding contributions to the program titled';

    doc.setTextColor(71, 85, 105);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(bodyText, 148.5, 104, { align: 'center' });

    // Program/Course/Internship Title
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.text(`"${request.title || 'Outreach Program'}"`, 148.5, 112, { align: 'center' });

    const completionDateStr = request.date
      ? new Date(request.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()
      : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
      
    doc.setTextColor(71, 85, 105);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.text(`ISSUED ON ${completionDateStr} FOR YOUR DEDICATED CONTRIBUTION AND EXCELLENCE`, 148.5, 122, { align: 'center' });

    // Decorative Separator
    doc.line(128.5, 131, 168.5, 131);

    // Left Side: Director Signature & Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('A.K. Sharma', 45, 163);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('PROJECT DIRECTOR', 45, 167);
    doc.text('PARANUBHUTI FOUNDATION', 45, 171);
    
    // Sign line
    doc.line(25, 157, 75, 157);
    // Fake script signature
    doc.setTextColor(15, 23, 42);
    doc.setFont('Courier', 'oblique');
    doc.setFontSize(13);
    doc.text('AKSharma', 38, 152);

    // Right Side: Issue Date
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(completionDateStr, 252, 163, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('DATE OF CONFERRAL', 252, 167, { align: 'center' });
    doc.text('OFFICIALLY CERTIFIED', 252, 171, { align: 'center' });
    
    // Date line
    doc.line(227, 157, 277, 157);

    // Center Bottom: QR Code Verification
    doc.addImage(qrCodeDataUrl, 'PNG', 137.5, 142, 22, 22);
    
    doc.setTextColor(100, 116, 139);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(`VERIFICATION ID: ${request.requestNumber}`, 148.5, 169, { align: 'center' });
    doc.text('SCAN QR CODE TO VERIFY CERTIFICATE ONLINE', 148.5, 173, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
  }
};

module.exports = { generatePdf };
