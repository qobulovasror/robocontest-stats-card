import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', async (req, res) => {
  // const { url, method, headers, body } = req.query;

  const response = await axios({
    url: "https://robocontest.uz/profile/qobulovasror",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response, response.data);

  res.send(response.data);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

