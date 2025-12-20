const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const authorRoutes = require('./routes/authorRoutes');
const journalRoutes = require('./routes/journalRoutes');
const journalIssueRoutes = require('./routes/journalIssueRoutes');
const editorApplicationRoutes = require('./routes/editorApplicationRoutes');
const journalCategoryRoutes = require('./routes/journalCategoryRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
console.log(" this is connected");

app.use('/api/auth', authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/journal-issues', journalIssueRoutes);
app.use('/api/editor-applications', editorApplicationRoutes);
app.use('/api/editor-applications', editorApplicationRoutes);
app.use('/api/journal-categories', journalCategoryRoutes);
app.use('/api/journal-impact-factors', require('./routes/journalImpactFactorRoutes'));
app.use('/api/contact-us', require('./routes/contactUsRoutes'));
app.use('/api/manuscripts', require('./routes/manuscriptRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/publications', require('./routes/publicationRoutes'));
app.use('/api/conferences', require('./routes/conferenceRoutes'));


// Global Error Handler
app.use(errorHandler);

// ---------------------  local database connection ---------------------

db.sequelize.sync().then(() => {
    console.log('Database connected and synced (SQLite)');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});


// ---------------------  production database connection ---------------------

// db.sequelize.sync()
//     .then(() => console.log("Database connected"))
//     .catch((err) => console.error("DB connection error:", err));

// module.exports = app;
