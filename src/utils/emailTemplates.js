/**
 * Email template for OTP verification
 */
const otpTemplate = (otp, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .header {
                background-color: #2c3e50;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .content {
                background-color: white;
                padding: 30px;
                margin-top: 20px;
                border-radius: 5px;
            }
            .otp-box {
                background-color: #3498db;
                color: white;
                font-size: 32px;
                font-weight: bold;
                text-align: center;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
                letter-spacing: 5px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #7f8c8d;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>ELK Journals</h1>
            </div>
            <div class="content">
                <h2>Email Verification</h2>
                <p>Dear ${name || 'Author'},</p>
                <p>Thank you for choosing ELK Journals for your manuscript submission.</p>
                <p>Your One-Time Password (OTP) for email verification is:</p>
                <div class="otp-box">${otp}</div>
                <p><strong>This OTP is valid for 10 minutes.</strong></p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <p>Best regards,<br>ELK Journals Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Email template for manuscript submission acknowledgment
 */
const submissionAcknowledgmentTemplate = (data) => {
    const { name, manuscriptId, journalName, paperTitle, email } = data;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .header {
                background-color: #27ae60;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .content {
                background-color: white;
                padding: 30px;
                margin-top: 20px;
                border-radius: 5px;
            }
            .success-icon {
                text-align: center;
                font-size: 48px;
                color: #27ae60;
                margin: 20px 0;
            }
            .manuscript-id {
                background-color: #ecf0f1;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #27ae60;
                font-size: 18px;
                font-weight: bold;
            }
            .details {
                margin: 20px 0;
            }
            .details-row {
                padding: 10px 0;
                border-bottom: 1px solid #ecf0f1;
            }
            .label {
                font-weight: bold;
                color: #2c3e50;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #7f8c8d;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Manuscript Submitted Successfully!</h1>
            </div>
            <div class="content">
                <div class="success-icon">✓</div>
                <h2>Congratulations!</h2>
                <p>Dear ${name},</p>
                <p>You have successfully submitted your manuscript. Your manuscript ID is:</p>
                <div class="manuscript-id">${manuscriptId}</div>
                
                <div class="details">
                    <div class="details-row">
                        <span class="label">Journal:</span> ${journalName}
                    </div>
                    <div class="details-row">
                        <span class="label">Paper Title:</span> ${paperTitle}
                    </div>
                    <div class="details-row">
                        <span class="label">Submitted By:</span> ${email}
                    </div>
                    <div class="details-row">
                        <span class="label">Submission Date:</span> ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
                    </div>
                </div>

                <p><strong>What's Next?</strong></p>
                <ul>
                    <li>Your manuscript will be reviewed by our editorial team</li>
                    <li>You will receive updates on the review status via email</li>
                    <li>You can track your submission status in your dashboard</li>
                </ul>

                <p>Please keep this manuscript ID for future reference.</p>
                
                <p>Best regards,<br>ELK Journals Editorial Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>For any queries, please contact us at info@elkjournals.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Email template for new author account creation
 */
const welcomeAuthorTemplate = (data) => {
    const { name, email, tempPassword } = data;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .header {
                background-color: #3498db;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .content {
                background-color: white;
                padding: 30px;
                margin-top: 20px;
                border-radius: 5px;
            }
            .credentials {
                background-color: #ecf0f1;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }
            .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #7f8c8d;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to ELK Journals!</h1>
            </div>
            <div class="content">
                <h2>Your Account Has Been Created</h2>
                <p>Dear ${name},</p>
                <p>An author account has been automatically created for you following your manuscript submission.</p>
                
                <div class="credentials">
                    <p><strong>Your Login Credentials:</strong></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                </div>

                <div class="warning">
                    <strong>⚠ Important:</strong> Please change your password after your first login for security purposes.
                </div>

                <p><strong>What you can do with your account:</strong></p>
                <ul>
                    <li>Track your manuscript submission status</li>
                    <li>Submit additional manuscripts</li>
                    <li>Update your profile information</li>
                    <li>Communicate with editors</li>
                </ul>

                <p>You can log in to your dashboard at any time to manage your submissions.</p>
                
                <p>Best regards,<br>ELK Journals Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>For any queries, please contact us at info@elkjournals.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    otpTemplate,
    submissionAcknowledgmentTemplate,
    welcomeAuthorTemplate
};
