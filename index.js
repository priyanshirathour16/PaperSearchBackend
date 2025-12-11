const serverless = require("serverless-http");
const express = require('express');
const app = express();
// const app = require("./src/index.js");
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// module.exports = serverless(app);