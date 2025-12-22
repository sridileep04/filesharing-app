const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: process.env.MONGODB_URL,
    file: (req, file) => {
        return {
            filename: Date.now() + "-" + file.originalname,
            bucketName: "uploads",
        };
    }
});

module.exports = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});
