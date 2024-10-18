import { Request, Response } from "express";
import path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();


const rootDir = `${process.env.MOUNTED_DIR}`

// console.log(rootDir)

const fileStats = fs.statSync(rootDir);

interface JsonData {
    type: string
    size: number
    name: string
    created: Date
    modified: Date
    dir: string  // Add this new property
}

export function getHomePage(req: Request, res: Response) {
    const subDir = req.query.dir as string | undefined;
    let currentDir = rootDir;

    if (subDir) {
        // Sanitize and validate the subDir
        const sanitizedSubDir = path.normalize(subDir).replace(/^(\.\.(\/|\\|$))+/, '');
        currentDir = path.join(rootDir, sanitizedSubDir);

        // Check if the resulting path is still within rootDir
        if (!currentDir.startsWith(rootDir)) {
            res.status(400).send('Invalid directory');
            return;
        }
    }

    let jsonDataArray: JsonData[] = [];
    fs.readdir(currentDir, { withFileTypes: true }, (error, dirents) => {
        if (error) {
            console.log(error);
            res.status(error.code === 'ENOENT' ? 404 : 500).send(error.message);
            return;
        }
        for (const dirent of dirents) {
            const filePath = path.join(currentDir, dirent.name);
            const fileStats = fs.statSync(filePath);
            const relativePath = path.relative(rootDir, path.dirname(filePath));
            const jsonData: JsonData = {
                type: getFileType(fileStats, dirent.name),
                size: fileStats.size,
                name: dirent.name,
                created: fileStats.ctime,
                modified: fileStats.mtime,
                dir: relativePath === '' ? '/' : '/' + relativePath.replace(/\\/g, '/')
            };
            jsonDataArray.push(jsonData);
        }
        res.json(jsonDataArray);
    });

    function getFileType(stats: fs.Stats, file: string): string {
        if (stats.isDirectory()) {
            return 'folder'
        }
        else {
            const fileExtention = file.split('.').pop();
            return fileExtention !== undefined ? fileExtention : ''
        }
    }
}


const uploadDir = path.join(rootDir, 'uploads');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export function handleUpload(req: Request, res: Response) {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('Multer error:', err.message);
            return res.status(500).json({ error: err.message });
        } else if (err) {
            console.log('Unknown error:', err.message);
            return res.status(500).json({ error: 'An unknown error occurred when uploading.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file was uploaded.' });
        }

        res.json({ message: 'File uploaded successfully', file: req.file.filename });
    });
}
