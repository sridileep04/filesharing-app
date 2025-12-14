const bcrypt = require('bcrypt');
const FileMeta = require('../models/FileMeta');
const crypto = require('crypto');
const deleteGridFsFile = require('../utils/deleteGridFsFile');

exports.verifyCodePassword = async (req, res) => {
    try {
        const { code, password } = req.body;
        const fileMeta = await FileMeta.findOne({ code });

        if (!fileMeta) return res.status(404).json({ error: "Code not found" });

        const bucket = req.app.locals.gfsBucket;
        if (new Date() > fileMeta.expiresAt) {
            await deleteGridFsFile(bucket, fileMeta.gridFsId);
            await FileMeta.deleteOne({ _id: fileMeta._id });

            return res.status(410).json({
                error: "This file has expired and was automatically deleted."
            });
        }

        const match = await bcrypt.compare(password, fileMeta.passwordHash);
        if (!match) return res.status(403).json({ error: "Wrong password" });

        if (fileMeta.downloadsLeft == 0) {
            await deleteGridFsFile(bucket, fileMeta.gridFsId);
            await FileMeta.deleteOne({ _id: fileMeta._id });
            return res.status(403).json({ error: "There are no downloads left" });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60000);

        const currentTime = Date.now();
        const timeDifferenceMs = expiresAt - currentTime; // Difference in milliseconds

        // Calculate minutes remaining
        const minutesRemaining = Math.ceil(timeDifferenceMs / (1000 * 60));



        fileMeta.downloadTokens.push({ token, expiresAt, used: false });
        await fileMeta.save();

        const link = `${process.env.BASE_URL}/api/download/${token}`;

        res.json({
            filename: fileMeta.originalname,
            size: fileMeta.length,
            downloadLink: link,
            tokenExpiryMinutes: minutesRemaining
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Verification failed" });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const token = req.params.token;
        const fileMeta = await FileMeta.findOne({ "downloadTokens.token": token });

        if (!fileMeta) return res.status(404).send("Invalid link");

        if (new Date() > fileMeta.expiresAt) {
            await deleteGridFsFile(fileMeta.gridFsId);
            await FileMeta.deleteOne({ _id: fileMeta._id });

            return res.status(410).send("This file has expired and is deleted.");
        }

        const tokenObj = fileMeta.downloadTokens.find(t => t.token === token);

        if (tokenObj.used || new Date() > tokenObj.expiresAt)
            return res.status(403).send("Expired or already used");
        if (fileMeta.downloadsLeft == 0) {
            await deleteGridFsFile(fileMeta.gridFsId);
            await FileMeta.deleteOne({ _id: fileMeta._id });
            return res.status(403).send("There are no downloads left");
        }

        const gfsBucket = req.app.locals.gfsBucket;
        const stream = gfsBucket.openDownloadStream(fileMeta.gridFsId);

        tokenObj.used = true;
        fileMeta.downloadsLeft -= 1;
        await fileMeta.save();

        res.set("Content-Type", fileMeta.contentType);
        res.set("Content-Disposition", `attachment; filename="${fileMeta.originalname}"`);

        stream.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send("Download failed");
    }
};
