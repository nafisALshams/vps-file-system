import express, { Request, Response, NextFunction, Application } from 'express';
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';

const app: Application = express();
const port: number = 3000;
const uploadDir: string = 'uploads';


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    
    const allowedTypes = ['video/mp4', 'audio/wav', 'audio/mpeg']; // .mp4, .wav, .mp3

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type. Only .mp4 and .wav are allowed.'));
    }
};


const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter 
});



app.post(
    '/upload',
    upload.single('file'),
    (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }

        res.status(200).send({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            path: req.file.path
        });
    },
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        
        res.status(400).send({ error: error.message });
    }
);


app.delete('/file/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;

    const safeUploadDir = path.resolve(__dirname, '..', uploadDir);
    const filePath = path.resolve(safeUploadDir, filename);

    if (!filePath.startsWith(safeUploadDir)) {
        return res.status(403).send('Forbidden: Invalid file path.');
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            if ((err as any).code === 'ENOENT') return res.status(404).send('File not found.');
            return res.status(500).send(`Error: ${(err as Error).message}`);
        }
        res.status(200).send(`File deleted: ${filename}`);
    });
});


app.listen(port, () => {
    console.log(`Server running on http://YOUR_VPS_IP:${port}`);
});