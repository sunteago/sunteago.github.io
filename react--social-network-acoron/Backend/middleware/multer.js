const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if ((file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') && req.user) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getDate() + "-" + file.originalname);
    }
});

exports.avatarMulter =  multer({ storage: fileStorage, fileFilter: fileFilter }).single('avatar');