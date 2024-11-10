import express from 'express';
import router from './routes/indext';
import { errorHandler } from './middlewares';
import cors from 'cors';
import { swaggerRouter } from './config';

const app = express();

const corsOptions = {
  origin: `http://localhost:${process.env.PORT_FRONT}` || 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/', router);
app.use(swaggerRouter);
app.use(errorHandler);

export default app;