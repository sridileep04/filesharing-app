const bcrypt = require('bcrypt');
const FileMeta = require('../models/FileMeta');
const generateUnique5DigitCode = require('../utils/generateCode');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const passwordHash = await bcrypt.hash(req.body.password, 12);
        const code = await generateUnique5DigitCode();

        const expiryMinutes = parseInt(process.env.DOWNLOAD_TOKEN_EXPIRY_MIN) || 30;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60000);

        const allowedDownloads = parseInt(req.body.allowedDownloads) || 1;


        await FileMeta.create({
            code,
            filename: req.file.filename,
            originalname: req.file.originalname,
            length: req.file.size,
            contentType: req.file.mimetype,
            passwordHash,
            gridFsId: req.file.id,
            downloadsLeft: 1,
            allowedDownloads,
            downloadsUsed: 0,
            expiresAt
        });

        res.json({ code });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
};
