const express = require('express');
const app = express();
const cors = require('cors');  
const PORT = 3000;
const bookRouter = require('./api/book');
const scanRouter = require('./api/scan');


app.use(cors());

app.use(express.json());

app.use('/api', bookRouter);
app.use('/api', scanRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
