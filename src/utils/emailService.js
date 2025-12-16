const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configure transporter with Reseller Club SMTP settings
        this.transporter = nodemailer.createTransport({
            host: 'smtp.mailserver.com', // Reseller Club SMTP host
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: 'supportdesk@elkjournals.com',
                pass: 'Owz(^^J)hF(!0vlX'
            },
            tls: {
                rejectUnauthorized: false
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
                from: '"ELK Journals" <supportdesk@elkjournals.com>',
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
