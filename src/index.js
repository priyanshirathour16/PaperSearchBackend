const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
console.log(" this is connected");

app.use('/api/auth', authRoutes);


// Global Error Handler
app.use(errorHandler);

db.sequelize.sync().then(() => {
    console.log('Database connected and synced (MySQL)');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
