import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
