const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuid.v4().toString()}${ext}`);
    },
});

const fileFilter = function(req, file, cb) {
    let typeArray = file.mimetype.split('/');
    let fileType = typeArray[1];
    if (
        fileType === 'jpg' ||
        fileType === 'png' ||
        fileType === 'jpeg' ||
        fileType === 'gif'
    ) {
        cb(null, true);
    } else {
        req.fileValidationError = 'jpg, jpeg,png,gif 파일만 업로드 가능합니다.';
        cb(null, false);
    }
};

export const imgUpload = multer({
    storage,
    fileFilter,
});
