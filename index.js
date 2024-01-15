import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const app = express();

app.use(cors());

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
