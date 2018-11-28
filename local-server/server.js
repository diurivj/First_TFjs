const express = require('express');
const app = express();

app.use(express.static('../static'));

app.use((req, res, next) =>  {
  console.log(`${new Date()} - ${req.method} request for ${req.url}`);
  next();
});

app.listen(3000, () => {
  console.log('Serving on 3000');
});