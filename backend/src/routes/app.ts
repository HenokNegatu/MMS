import { Router } from "express";
import { getHomePage, handleUpload } from "../handlers/home";

const router = Router()

router.get('/', getHomePage)
router.post('/upload', handleUpload)


export default router;