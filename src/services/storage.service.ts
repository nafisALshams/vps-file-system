import fs from 'fs';
import path from 'path';

export class StorageService {
    private baseDir: string;

    constructor(uploadDir: string) {
        this.baseDir = path.resolve(process.cwd(), uploadDir);
    }

    init() {
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }

    private resolveSafe(fileName: string) {
        const safePath = path.resolve(this.baseDir, fileName);
        if (!safePath.startsWith(this.baseDir)) {
            throw new Error('Forbidden: Invalid file path.');
        }
        return safePath;
    }

    listFiles(): string[] {
        this.init();
        return fs.readdirSync(this.baseDir);
    }

    deleteFile(fileName: string) {
        const filePath = this.resolveSafe(fileName);
        if (!fs.existsSync(filePath)) {
            const err: NodeJS.ErrnoException = new Error('File not found.');
            err.code = 'ENOENT';
            throw err;
        }
        fs.unlinkSync(filePath);
    }
}
