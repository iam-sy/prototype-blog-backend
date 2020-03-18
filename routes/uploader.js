const mkdirp = require('mkdirp');

import express from 'express';
import { imgUpload, checkUploadPath } from '../lib/upload/image';

const uploadRouter = express.Router();
const uploadDir = 'public/uploads/paste';
const uploader = imgUpload(uploadDir);
mkdirp.sync(uploadDir);

uploadRouter.post('/', uploader.single('file'), function(req, res) {
    try {
        res.status(200).json({ data: req.file });
    } catch (e) {
        console.log(e);
    }
});

export { uploadRouter };
