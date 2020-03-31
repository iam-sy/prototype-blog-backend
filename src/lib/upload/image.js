//const fs = require('fs');
//const path = require('path');
//import uuid from 'uuid';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const imgUpload = dir => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            // [todo] user정보 가져와서 폴더/파일별 정리
            // uuid : folder,
            // filename : orgname + date.now() + ext
            cb(null, dir);
        },

        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            //cb(null, `${uuid.v4().toString()}${ext}`);
            cb(null, `${uuidv4().toString()}${ext}`);
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
            req.fileValidationError =
                'jpg, jpeg, png, gif 파일만 업로드 가능합니다.';
            cb(null, false);
        }
    };

    return multer({
        storage,
        fileFilter,
    });
};

export const checkUploadPath = dir => {
    console.log(dir);
    !fs.existsSync(dir) && fs.mkdirSync(dir);
};
