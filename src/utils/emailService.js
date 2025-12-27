const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configure transporter with Reseller Club SMTP settings
        // Configure transporter with SMTP settings from environment variables or defaults
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.elkjournals.com',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || 'info@elkjournals.com',
                pass: process.env.SMTP_PASS || 'Puneet@842'
            },
            tls: {
                rejectUnauthorized: false // Allow self-signed certs if necessary
            }
        });
    }

    /**
     * Send email
     * @param {Object} options - Email options
     * @param {string} options.to - Recipient email
     * @param {string} options.subject - Email subject
     * @param {string} options.html - HTML content
     * @param {string} options.text - Plain text content (optional)
     */
    async sendEmail({ to, subject, html, text }) {
        try {
            const mailOptions = {
                from: '"ELK Journals" <info@elkjournals.com>',
                to,
                subject,
                html,
                text: text || '' // Fallback to empty string if no text provided
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    /**
     * Verify email configuration
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('Email service is ready to send emails');
            return true;
        } catch (error) {
            console.error('Email service verification failed:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
