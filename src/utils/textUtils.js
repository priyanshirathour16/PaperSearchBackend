/**
 * Convert number to words
 * @param {number} num - Number to convert
 * @returns {string} - Number in words
 */
function numberToWords(num) {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    function convertLessThanThousand(n) {
        if (n === 0) return '';

        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) {
            const ten = Math.floor(n / 10);
            const one = n % 10;
            return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
        }

        const hundred = Math.floor(n / 100);
        const remainder = n % 100;
        return ones[hundred] + ' Hundred' + (remainder > 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }

    if (num < 1000) {
        return convertLessThanThousand(num) + ' words only';
    }

    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;

    let result = convertLessThanThousand(thousand) + ' Thousand';
    if (remainder > 0) {
        result += ' ' + convertLessThanThousand(remainder);
    }

    return result + ' words only';
}

/**
 * Validate abstract word count
 * @param {string} abstract - Abstract text
 * @param {number} maxWords - Maximum allowed words (default: 200)
 * @returns {object} - Validation result with word count
 */
function validateAbstractWordCount(abstract, maxWords = 200) {
    if (!abstract || typeof abstract !== 'string') {
        return {
            valid: false,
            wordCount: 0,
            message: 'Abstract is required'
        };
    }

    const words = abstract.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    return {
        valid: wordCount <= maxWords,
        wordCount,
        message: wordCount > maxWords
            ? `Abstract exceeds maximum word limit of ${maxWords} words (current: ${wordCount} words)`
            : 'Valid'
    };
}

module.exports = {
    numberToWords,
    validateAbstractWordCount
};
