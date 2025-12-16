const otpRepository = require('../repositories/OTPRepository');
const authorRepository = require('../repositories/AuthorRepository');
const { otpTemplate, welcomeAuthorTemplate } = require('../utils/emailTemplates');
const bcrypt = require('bcryptjs');

class OTPService {
    /**
     * Generate a 6-digit OTP
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Send OTP to email
     * @param {string} email - Recipient email
     * @param {string} name - Recipient name
     * @param {string} phone - Recipient phone number
     */
    async sendOTP(email, name, phone) {
        try {
            // Generate OTP
            const otpCode = this.generateOTP();

            // Set expiry time (10 minutes from now)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);

            // Save OTP to database with name and phone for later use
            await otpRepository.create({
                email,
                otp_code: otpCode,
                expires_at: expiresAt,
                is_verified: false,
                name: name,
                phone: phone
            });

            // Log OTP to console for development/testing
            console.log('\n' + '='.repeat(60));
            console.log('📧 OTP GENERATED');
            console.log('='.repeat(60));
            console.log('Email:', email);
            console.log('Name:', name);
            console.log('OTP Code:', otpCode);
            console.log('Expires:', expiresAt.toLocaleString());
            console.log('='.repeat(60) + '\n');

            // Try to send email, but don't fail if it doesn't work
            try {
                const emailService = require('../utils/emailService');
                await emailService.sendEmail({
                    to: email,
                    subject: 'Email Verification - ELK Journals',
                    html: otpTemplate(otpCode, name)
                });
                console.log('✓ OTP email sent successfully');
            } catch (emailError) {
                console.warn('⚠️  Email sending failed (SMTP not configured):', emailError.message);
                console.log('✓ OTP logged to console above - use it for verification');
            }

            return {
                success: true,
                message: 'OTP sent successfully to your email',
                expiresIn: '10 minutes',
                // Include OTP in response for development (remove in production)
                ...(process.env.NODE_ENV !== 'production' && { otp: otpCode })
            };
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Failed to send OTP. Please try again.');
        }
    }

    /**
     * Verify OTP and create author account
     * @param {string} email - Email address
     * @param {string} otpCode - OTP code to verify
     */
    async verifyOTP(email, otpCode) {
        try {
            // Find valid OTP
            const otpRecord = await otpRepository.findValidOTP(email, otpCode);

            if (!otpRecord) {
                return {
                    success: false,
                    message: 'Invalid or expired OTP'
                };
            }

            // Mark as verified
            await otpRepository.markAsVerified(otpRecord.id);

            // Check if author already exists
            const existingAuthor = await authorRepository.findByEmail(email);

            let authorCreated = false;
            let tempPassword = null;

            if (!existingAuthor) {
                // Create new author account
                tempPassword = 'Password@123'; // Default password
                const hashedPassword = await bcrypt.hash(tempPassword, 10);

                // Split name into first and last name
                const nameParts = otpRecord.name ? otpRecord.name.split(' ') : ['User', ''];
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '.';

                const newAuthorData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword,
                    contactNumber: otpRecord.phone || null,
                    role: 'author'
                };

                await authorRepository.create(newAuthorData);
                authorCreated = true;

                console.log('\n' + '='.repeat(60));
                console.log('👤 AUTHOR ACCOUNT CREATED');
                console.log('='.repeat(60));
                console.log('Email:', email);
                console.log('Name:', `${firstName} ${lastName}`);
                console.log('Phone:', otpRecord.phone);
                console.log('Password:', tempPassword);
                console.log('='.repeat(60) + '\n');

                // Try to send welcome email
                try {
                    const emailService = require('../utils/emailService');
                    await emailService.sendEmail({
                        to: email,
                        subject: 'Welcome to ELK Journals - Account Created',
                        html: welcomeAuthorTemplate({
                            name: otpRecord.name || 'Author',
                            email: email,
                            tempPassword: tempPassword
                        })
                    });
                    console.log('✓ Welcome email sent successfully');
                } catch (emailError) {
                    console.warn('⚠️  Welcome email sending failed:', emailError.message);
                    console.log('✓ Account credentials logged to console above');
                }
            }

            return {
                success: true,
                message: 'Email verified successfully',
                authorCreated: authorCreated,
                ...(authorCreated && { tempPassword: tempPassword })
            };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Failed to verify OTP. Please try again.');
        }
    }

    /**
     * Check if email is verified
     * @param {string} email - Email to check
     */
    async isEmailVerified(email) {
        const otps = await otpRepository.findByEmail(email);
        return otps.some(otp => otp.is_verified);
    }

    /**
     * Clean up expired OTPs (can be run periodically)
     */
    async cleanupExpiredOTPs() {
        try {
            const result = await otpRepository.cleanupExpired();
            console.log(`Cleaned up ${result} expired OTPs`);
            return result;
        } catch (error) {
            console.error('Error cleaning up OTPs:', error);
            throw error;
        }
    }
}

module.exports = new OTPService();
