import express from 'express';
import path from 'path';

const homeRouter = express.Router();

homeRouter.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

//module.exports = router;
export { homeRouter };
