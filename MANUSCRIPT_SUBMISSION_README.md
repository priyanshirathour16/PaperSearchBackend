# Manuscript Submission System - Quick Start Guide

## 🚀 What's New

A complete multi-step manuscript submission system has been implemented with:

- ✅ Email OTP verification for guest authors
- ✅ Automated author account creation  
- ✅ Custom manuscript IDs (e.g., `IJB-2025-001`)
- ✅ Automated email notifications
- ✅ Multi-file upload support
- ✅ Submission checklist tracking

---

## 📋 Prerequisites

Before running the system, ensure:

1. **Database is synced** - Run the server once to create new tables
2. **Email credentials are correct** - Check `src/utils/emailService.js`
3. **At least one journal exists** in your database
4. **Node modules installed** - `npm install` (nodemailer already in package.json)

---

## 🔧 Configuration

### Email Service

Update SMTP settings in `src/utils/emailService.js` if needed:

```javascript
host: 'smtp.mailserver.com', // Your Reseller Club SMTP host
port: 587,
auth: {
    user: 'supportdesk@elkjournals.com',
    pass: 'Owz(^^J)hF(!0vlX'
}
```

> **Note:** The provided credentials are already configured. Update the SMTP host if different from `smtp.mailserver.com`.

---

## 🧪 Testing

### 1. Start the Server

```bash
npm run dev
```

The server should sync the database and create new tables:
- `otps`
- `submission_checklists`
- Updated `manuscripts` and `manuscript_authors` tables

### 2. Test OTP Flow

```bash
node verify_otp_flow.js
```

This will:
1. Send an OTP to a test email
2. Prompt you to enter the OTP
3. Verify the OTP
4. Test invalid OTP rejection

### 3. Test Complete Submission

```bash
node verify_manuscript_submission_flow.js
```

This will:
1. Create dummy PDF files
2. Send and verify OTP
3. Submit a complete manuscript
4. Retrieve manuscript details
5. Clean up test files

**Check your email** for:
- OTP verification email
- Submission acknowledgment email
- Welcome email (for new authors)

---

## 📡 API Endpoints

### OTP Verification

**Send OTP:**
```http
POST /api/otp/send
Content-Type: application/json

{
  "email": "author@example.com",
  "name": "John Doe"
}
```

**Verify OTP:**
```http
POST /api/otp/verify
Content-Type: application/json

{
  "email": "author@example.com",
  "otp": "123456"
}
```

### Manuscript Submission

**Submit Manuscript:**
```http
POST /api/manuscripts/submit
Content-Type: multipart/form-data

Required Fields:
- name: Author's full name
- email: Author's email (must be verified via OTP)
- phone: Author's phone number
- journalId: Journal ID
- manuscriptType: Type of manuscript
- paperTitle: Manuscript title
- abstract: Abstract (max 200 words)
- manuscriptFile: PDF/DOC/DOCX file

Optional Fields:
- wordCount: Total word count
- keywords: JSON array or comma-separated
- authors: JSON array of co-authors
- reviewerFirstName, reviewerEmail, etc.
- coverLetter: Cover letter file
- checklist: JSON object with consents
```

**Get Manuscript Details:**
```http
GET /api/manuscripts/:manuscriptId
```

**Get Author's Manuscripts:**
```http
GET /api/manuscripts/author/:authorId
```

---

## 📄 Documentation

- **API Documentation:** `manuscript_submission_api_docs.json`
- **Implementation Plan:** See artifacts folder
- **Walkthrough:** See artifacts folder

---

## 🔑 Key Features

### Custom Manuscript IDs

Format: `{JOURNAL_INITIALS}-{YEAR}-{SEQUENCE}`

Example:
- "International Journal of Biology" → `IJB-2025-001`
- Next submission → `IJB-2025-002`

### Auto-Created Author Accounts

For guest submissions:
- Account created automatically
- Temporary password: `Password@123`
- Credentials sent via email

### Email Notifications

Three types of emails sent automatically:
1. **OTP Email** - 6-digit code, expires in 10 minutes
2. **Submission Acknowledgment** - Includes manuscript ID
3. **Welcome Email** - For new authors with login credentials

### Word Count Conversion

Automatically converts numbers to text:
- `2000` → `"Two Thousand words only"`
- `5000` → `"Five Thousand words only"`

### Abstract Validation

- Maximum 200 words enforced
- Submission blocked if exceeded
- Returns word count in error message

---

## 🗂️ File Structure

```
src/
├── models/
│   ├── OTP.js (new)
│   ├── SubmissionChecklist.js (new)
│   ├── Manuscript.js (updated)
│   └── ManuscriptAuthor.js (updated)
├── repositories/
│   ├── OTPRepository.js (new)
│   ├── SubmissionChecklistRepository.js (new)
│   └── ManuscriptRepository.js (updated)
├── services/
│   ├── OTPService.js (new)
│   └── ManuscriptService.js (updated)
├── controllers/
│   └── otpController.js (new)
├── routes/
│   └── otpRoutes.js (new)
└── utils/
    ├── emailService.js (new)
    ├── emailTemplates.js (new)
    └── textUtils.js (new)
```

---

## 🐛 Troubleshooting

### Emails Not Sending

1. Check SMTP host in `emailService.js`
2. Verify email credentials are correct
3. Check server console for email errors
4. Test connection: The service logs "Email service is ready" on startup

### Database Errors

1. Stop the server
2. Delete `database.sqlite` (if using SQLite)
3. Restart server to recreate tables
4. Re-seed data if needed

### OTP Not Working

1. Check OTP hasn't expired (10 minutes)
2. Verify email matches exactly
3. OTP is 6 digits, numeric only
4. Check server console for OTP code (during development)

### File Upload Errors

1. Ensure files are `.doc`, `.docx`, or `.pdf`
2. Check file size limits
3. Verify `uploads/` directory exists and is writable

---

## 📞 Support

For issues or questions:
- Check `manuscript_submission_api_docs.json` for API details
- Review `walkthrough.md` for implementation details
- Check server console for error messages

---

## ✅ Checklist Before Production

- [ ] Update SMTP host in emailService.js
- [ ] Test email delivery to real addresses
- [ ] Configure production database
- [ ] Add file size validation
- [ ] Implement rate limiting for OTP
- [ ] Add logging for submissions
- [ ] Test with real PDF files
- [ ] Update frontend integration
- [ ] Set up error monitoring
- [ ] Configure backup strategy

---

**System Status:** ✅ Ready for Testing

All components implemented and ready for verification. Run the test scripts to validate functionality.
