const mkdirp = require('mkdirp');

import express from 'express';
import PostModel from '../db/models/PostModel.js';
import { imgUpload } from '../lib/upload/image';

const searchRouter = express.Router();

searchRouter.get('/', async (req, res) => {
    try {
        console.log('query >>>>>>>>>>>>>>>>>>', req.query);
        /*const newSearchRegex = new RegExp(req.body.schtext, 'g');
        let serchQuery = [{ sec: req.body.sec }];
        if (req.body.schtext) {
            serchQuery.push({
                $or: [{ desc: newSearchRegex }, { title: newSearchRegex }],
            });
        }
        if (req.body.schtags) {
            serchQuery.push({ tags: { $in: req.body.schtags } });
        }
        const search = await PostModel.find()
            .sort({ _id: -1 })
            .lean()
            .exec();
        if (!search) {
            return res.status(400).json({ message: 'cannot search the data' });
        }*/

        //return res.status(200).json({ ...search });
        return res.status(200).json({});
        //return null;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'sth wrong', error });
    }
});

export { searchRouter };
