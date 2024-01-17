import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import SmartBinRouter from 'routes/trashBin.ts'


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/smartbins', SmartBinRouter);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
