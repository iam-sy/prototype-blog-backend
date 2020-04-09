import path from 'path';
//const sharp = require('sharp');
const Jimp = require('jimp');

const mkdirp = require('mkdirp');

import express from 'express';
import { imgUpload, checkUploadPath } from '../lib/upload/image';
import fs from 'fs';

const uploadRouter = express.Router();
const uploadDir = 'uploads/paste';
const resizePath = 'uploads/paste';
const uploader = imgUpload(uploadDir);
mkdirp.sync(uploadDir);

uploadRouter.post('/', uploader.single('file'), async (req, res) => {

    let image = await Jimp.read(req.file.path);
    await image.resize(900, Jimp.AUTO);
    await image.writeAsync(req.file.path);

    /*sharp(req.file.path)
        .resize(900)
        .toBuffer((e, buffer) => {
            fs.writeFileSync(req.file.path, buffer);
        });*/
    //fs.unlinkSync(req.file.path);
    try {
        res.status(200).json({ data: req.file });
    } catch (e) {
        console.log(e);
    }
});

export { uploadRouter };
