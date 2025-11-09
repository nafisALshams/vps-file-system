import express from 'express';
import filesRouter from './routes';
import errorHandler from './middleware/errorHandler';

const app = express();

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
    res.json({ message: 'VPS File System API', routes: ['/health', '/api/files/upload', '/api/files/list', '/api/files/delete/:filename'] });
});

app.use('/api/files', filesRouter);

app.use(errorHandler);

export default app;
