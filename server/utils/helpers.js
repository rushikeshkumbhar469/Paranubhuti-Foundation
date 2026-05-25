/**
 * Shared helper – generate a unique document number.
 * @param {string} prefix  e.g. 'PF', 'PR', 'PC'
 * @param {number} padLen  Length to pad the random part (default 5)
 * @returns {string}  e.g. 'PF-2025-04271'
 */
const generateDocNumber = (prefix, padLen = 5) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * Math.pow(10, padLen))
    .toString()
    .padStart(padLen, '0');
  return `${prefix}-${year}-${random}`;
};

/**
 * Format a date string to a human-readable format.
 * @param {string} dateStr  ISO or 'MM/DD/YYYY' date string
 * @returns {string}  e.g. 'May 19, 2025'
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; // return as-is if unparseable
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Return the validity year (current year + 1 → Dec 31).
 */
const getValidityDate = () => {
  const year = new Date().getFullYear() + 1;
  return `31 Dec ${year}`;
};

/**
 * Generate a unique document request number.
 * @returns {string}  e.g. 'REQ-2025-04271'
 */
const generateRequestNumber = () => generateDocNumber('REQ', 5);

module.exports = { generateDocNumber, formatDate, getValidityDate, generateRequestNumber };
