const OTP = require('../models/OTP');

class OTPRepository {
    async create(data) {
        return await OTP.create(data);
    }

    async findValidOTP(email, otpCode) {
        return await OTP.findOne({
            where: {
                email,
                otp_code: otpCode,
                is_verified: false,
                expires_at: {
                    [require('sequelize').Op.gt]: new Date()
                }
            },
            order: [['createdAt', 'DESC']]
        });
    }

    async markAsVerified(id) {
        return await OTP.update(
            {
                is_verified: true,
                verified_at: new Date()
            },
            { where: { id } }
        );
    }

    async findByEmail(email) {
        return await OTP.findAll({
            where: { email },
            order: [['createdAt', 'DESC']],
            limit: 5
        });
    }

    async cleanupExpired() {
        const { Op } = require('sequelize');
        return await OTP.destroy({
            where: {
                expires_at: {
                    [Op.lt]: new Date()
                },
                is_verified: false
            },
            force: true
        });
    }
}

module.exports = new OTPRepository();
