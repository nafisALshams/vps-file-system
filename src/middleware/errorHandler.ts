import type { NextFunction, Request, Response } from 'express';
import multer, { MulterError } from 'multer';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    let status = 500;
    let message = 'Internal Server Error';

    if (err instanceof Error) {
        message = err.message;
    }

    if (err instanceof MulterError) {
        status = 400;
        message = `Upload error: ${err.message}`;
    } else if (err instanceof Error && message.includes('Invalid file type')) {
        status = 400;
    }

    res.status(status).json({ success: false, message });
}

export default errorHandler;
