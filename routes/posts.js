import express from 'express';
import PostModel from '../models/PostModel.js';

const postRouter = express.Router();

postRouter.post('/', async (req, res) => {
    try {
        const doc = await PostModel.create({
            ...req.body,
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
//module.exports = router;
