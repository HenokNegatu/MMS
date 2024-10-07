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
}

export function getHomePage(req: Request, res: Response) {
    let jsonDataArray: JsonData[] = [];
    fs.readdir(rootDir, (error, files) => {
        if (error) {
            console.log(error)
            res.sendStatus(500)
        }
        for (const file of files) {
            const fileStats = fs.statSync(path.join(rootDir, file));
            const jsonData: JsonData = {
                type: getFileType(fileStats, file),
                size: fileStats.size,
                name: file,
                created: fileStats.ctime,
                modified: fileStats.mtime
            };
            jsonDataArray.push(jsonData)
        }
        res.send(JSON.stringify(jsonDataArray))
    })

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
