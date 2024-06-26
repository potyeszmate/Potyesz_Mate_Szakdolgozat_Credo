const express = require('express');
const paymentRoutes = require('./router/paymentRoutes');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.send('<h2>Hello world </h2>');
});
  
app.listen(PORT, () => {
    console.log('API is listening on port', PORT);
});
