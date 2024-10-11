import { Request, Response } from "express";
import path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

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

export function uploadFile(req: Request, res: Response) {
    res.send('file posted!')
}
