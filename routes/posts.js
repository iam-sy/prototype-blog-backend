const mkdirp = require('mkdirp');

import express from 'express';
import PostModel from '../db/models/PostModel.js';
import { imgUpload } from '../lib/upload/image';

const postRouter = express.Router();
const uploadDir = 'public/uploads/posts';
const uploader = imgUpload(uploadDir);

mkdirp.sync(uploadDir);

postRouter.post('/', uploader.single('sumnail'), async (req, res) => {
    try {
        const doc = await PostModel.create({
            ...req.body,
            sumnail: req.file
                ? `${req.file.destination}/${req.file.filename}`
                : '',
        });
        //createdBy: req.user._id,
        res.status(201).json({ data: doc });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).send({ message: 'Duplicated Data', error });
        }
        res.status(400).send({ message: 'sth wrong', error });
    }
});

export { postRouter };
