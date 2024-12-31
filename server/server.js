const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let dataArray = [];

app.post('/', (req, res) => {
  const data = req.body;
  console.log(data);
  if (data !== null && data !== undefined) {
    dataArray.push(data);
    res.status(201).send({ message: 'Data added successfully' });
  } else {
    res.status(400).send({ message: 'Invalid data' });
  }
});

app.get('/', (req, res) => {
  res.status(200).send(dataArray);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});