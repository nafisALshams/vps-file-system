import { Router } from 'express';
import { uploadMiddleware } from '../middleware/upload';
import { uploadFile, deleteFile, listFiles } from '../controllers/files.controller';

const router = Router();

router.post('/upload', uploadMiddleware, uploadFile);
router.delete('/delete/:filename', deleteFile);
router.get('/list', listFiles);

export default router;
