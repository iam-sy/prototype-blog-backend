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
        const { tags } = req.body;
        const tagsArray = tags.split(',');
        const sumnailPath = req.file
            ? req.file.destination.replace('/public')
            : '';
        const doc = await PostModel.create({
            ...req.body,
            tags: tagsArray,
            sumnail: req.file ? `${sumnailPath}/${req.file.filename}` : '',
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

postRouter.get('/', async (req, res) => {
    try {
        const { sec } = req.query;
        let docs =
            sec === 'all'
                ? await PostModel.find()
                : await PostModel.find({ sec: sec })
                      .sort({ _id: -1 })
                      .lean()
                      .exec();

        res.status(200).json({
            posts: docs,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'sth wrong', error });
    }
});

export { postRouter };
