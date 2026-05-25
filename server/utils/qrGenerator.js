const QRCode = require('qrcode');

/**
 * Generate a QR code as a Base64 data URL.
 * @param {string} text - The text/URL to encode.
 * @returns {Promise<string>} Base64 data URL string.
 */
const generateQRCode = async (text) => {
  const dataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    width: 120,
    margin: 1,
    color: { dark: '#0f172a', light: '#ffffff' },
  });
  return dataUrl;
};

module.exports = { generateQRCode };
