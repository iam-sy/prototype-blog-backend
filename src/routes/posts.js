const mkdirp = require('mkdirp');
import fs from 'fs';
import path from 'path';
import express from 'express';
import PostModel from '../db/models/PostModel.js';
import { imgUpload } from '../lib/upload/image';
//const sharp = require('sharp');
const Jimp = require('jimp');
const postRouter = express.Router();
const uploadDir = 'uploads/posts';
const uploader = imgUpload(uploadDir);

mkdirp.sync(uploadDir);

postRouter.post('/', uploader.single('sumnail'), async (req, res) => {
    try {
        const { tags } = req.body;
        const tagsArray = tags.length > 0 ? tags.split(',') : [];
        console.log(req.file);
        const sumnailPath = req.file
            ? req.file.destination.replace('public', '')
            : '';

        if (req.file) {
            let image = await Jimp.read(req.file.path);
            console.log(image)
                /*.then(lenna => {
                    return lenna
                        .resize(900) // resize
                        .quality(60) // set JPEG quality
                        .greyscale() // set greyscale
                        .write('lena-small-bw.jpg'); // save
                })
                .catch(err => {
                    console.error(err);
                });*/

            /*sharp(req.file.path)
                .resize(900)
                .toBuffer((e, buffer) => {
                    fs.writeFileSync(req.file.path, buffer);
                });*/
        }

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
        const {
            sec,
            schtext,
            schtags,
            perPage,
            pageGroup,
            limit,
            currentPage,
        } = req.query;
        let findQuery = {};
        let searchQuery = [];
        if (sec !== 'all') {
            searchQuery.push({ sec: sec });
        }
        if (schtext) {
            const newSearchRegex = new RegExp(schtext, 'g');
            searchQuery.push({
                $or: [{ desc: newSearchRegex }, { title: newSearchRegex }],
            });
        }
        if (schtags) {
            const tagArray = schtags.split(',');
            searchQuery.push({ tags: { $in: tagArray } });
        }
        if (searchQuery.length !== 0) {
            findQuery = {
                $and: searchQuery,
            };
        }
        let totalCount = await PostModel.countDocuments(
            findQuery,
            (err, count) => {
                return count;
            },
        );
        let docs = await PostModel.find(findQuery)
            .sort({ _id: -1 })
            .skip(parseInt((currentPage - 1) * limit))
            .limit(parseInt(limit))
            .lean()
            .exec();

        res.status(200).json({
            totalCount: totalCount,
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
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        const prev = await PostModel.findOne({
            _id: { $gt: req.params.id },
        })
            .sort({ createdAt: 1 })
            .limit(1)
            .lean()
            .exec();
        const next = await PostModel.findOne({
            _id: { $lt: req.params.id },
        })
            .sort({ createdAt: -1 })
            .limit(1)
            .lean()
            .exec();

        if (!doc) {
            return res.status(400).json({ message: 'The data is not found' });
        }
        res.status(200).json({
            posts: doc,
            next,
            prev,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'sth wrong', error });
    }
});

postRouter.put('/:id', uploader.single('sumnail'), async (req, res) => {
    try {
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

        if (req.file) {
            let image = await Jimp.read(req.file.path);
            await image.resize(900, Jimp.AUTO);
            await image.writeAsync(req.file.path);
        }
        if (!updatedDoc) {
            return res.status(400).json({ message: 'cannot update the data' });
        }

        res.status(200).json({ ...updatedDoc });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'sth wrong', error });
    }
});

postRouter.delete('/:id', async (req, res) => {
    try {
        const removed = await PostModel.findOneAndRemove({
            _id: req.params.id,
        })
            .lean()
            .exec();

        if (!removed) {
            return res.status(400).json({ message: 'cannot remove the data' });
        }

        return res.status(200).json({ ...removed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'sth wrong', error });
    }
});

export { postRouter };
