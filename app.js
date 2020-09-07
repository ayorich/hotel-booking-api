const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello fro the server side', app: 'booking app' });
});
app.post('/', (req, res) => {
  res.status(200).json({ message: 'you can post here', app: 'booking app' });
});
const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}....`);
});
