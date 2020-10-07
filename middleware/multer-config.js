const multer = require('multer');
const crypto = require('crypto');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, crypto.randomBytes(16).toString("hex") + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');