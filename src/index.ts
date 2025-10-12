import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// status
app.get('/status', (req, res) => {
  res.send('OK');
});

// iniciar
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
