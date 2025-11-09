import fs from 'fs';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import type { Request } from 'express';
import { config } from '../config';

const baseUploadDir = path.resolve(process.cwd(), config.uploadDir);

// Ensure upload directory exists
if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
}

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const mime = file.mimetype.toLowerCase();
    if (config.allowedMimeTypes.includes(mime)) {
        return cb(null, true);
    }
    // Fallback to extension check (handles generic application/octet-stream cases)
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.mp4' || ext === '.wav') {
        return cb(null, true);
    }
    cb(new Error('Invalid file type. Only .mp4 and .wav are allowed.'));
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, baseUploadDir);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const uploadMiddleware = multer({ storage, fileFilter }).single('file');
