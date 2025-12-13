const express = require('express');
const router = express.Router();
const upload = require('../utils/storage');
const { uploadFile } = require('../controllers/sendController');
const {
    verifyCodePassword,
    downloadFile
} = require('../controllers/receiveController');

router.post('/send', upload.single('file'), uploadFile);
router.post('/verify', verifyCodePassword);
router.get('/download/:token', downloadFile);


module.exports = router;
