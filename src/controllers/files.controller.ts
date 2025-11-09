import type { Request, Response } from 'express';
import { StorageService } from '../services/storage.service';
import { config } from '../config';

const storage = new StorageService(config.uploadDir);
storage.init();

export const uploadFile = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }
    return res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: req.file.path ?? req.file.destination + '/' + req.file.filename,
    });
};

export const deleteFile = (req: Request, res: Response) => {
    const { filename } = req.params as { filename: string };
    try {
        storage.deleteFile(filename);
        return res.status(200).json({ success: true, message: `File deleted: ${filename}` });
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            return res.status(404).json({ success: false, message: 'File not found.' });
        }
        return res.status(500).json({ success: false, message: (err as Error).message });
    }
};

export const listFiles = (_req: Request, res: Response) => {
    const files = storage.listFiles();
    return res.status(200).json({ success: true, files });
};
