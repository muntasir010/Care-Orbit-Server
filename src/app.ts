import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'CareOrbit Server is running!' });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;