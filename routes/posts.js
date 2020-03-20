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
        console.log(req.body);
        const { tags } = req.body;
        const tagsArray = tags.length > 0 ? tags.split(',') : [];
        console.log(req.file);
        const sumnailPath = req.file
            ? req.file.destination.replace('public', '')
            : '';
        const doc = await PostModel.create({
            ...req.body,
            image: req.file ? `${sumnailPath}/${req.file.filename}` : '',
            tags: tagsArray,
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
                      .sort({ _id: -1 })
                      .lean()
                      .exec()
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

postRouter.get('/:id', async (req, res) => {
    try {
        const doc = await PostModel.findOne({
            _id: req.params.id,
        })
            .lean()
            .exec();

        if (!doc) {
            return res.status(400).json({ message: 'The data is not found' });
        }
        res.status(200).json({
            posts: doc,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'sth wrong', error });
    }
});

postRouter.put('/:id', uploader.single('sumnail'), async (req, res) => {
    try {
        console.log(req.body);

        const { tags } = req.body;
        const tagsArray = tags ? tags.split(',') : [];
        const sumnailPath = req.file
            ? req.file.destination.replace('public', '')
            : '';
        const updatedDoc = await PostModel.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                ...req.body,
                image: req.file
                    ? `${sumnailPath}/${req.file.filename}`
                    : req.body.image,
                tags: tagsArray,
            },
            { new: true },
        )
            .lean()
            .exec();

        if (!updatedDoc) {
            return res.status(400).json({ message: 'cannot update the data' });
        }

        res.status(200).json({ ...updatedDoc });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'sth wrong', error });
    }
});
export { postRouter };
