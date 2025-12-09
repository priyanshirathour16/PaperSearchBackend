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


// Global Error Handler
app.use(errorHandler);

db.sequelize.sync().then(() => {
    console.log('Database connected and synced (SQLite)');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
