import { imgUpload } from '../utils/upload/image';

const express = require('express');
const router = express.Router(); /* GET home page. */

router.post('/', imgUpload.single('file'), function(req, res) {
    res.status(200).json({ data: req.file });
});

module.exports = router;
