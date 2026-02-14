const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('National EHR API Gateway Running');
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
