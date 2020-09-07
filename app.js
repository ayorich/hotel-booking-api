const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello fro the server side');
});
const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}....`);
});
