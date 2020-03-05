import express from 'express';
import { imgUpload } from '../utils/upload/image';

const uploadRouter = express.Router();

uploadRouter.post('/', imgUpload.single('file'), function(req, res) {
    res.status(200).json({ data: req.file });
});

export { uploadRouter };
