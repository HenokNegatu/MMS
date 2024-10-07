import { Router } from "express";
import { getHomePage, uploadFile } from "../handlers/home";

const router = Router()

router.get('/', getHomePage)

router.post('/', uploadFile)

export default router;