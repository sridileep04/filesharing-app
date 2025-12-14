const FileMeta = require("../models/FileMeta");
const deleteGridFsFile = require("../utils/deleteGridFsFile");

module.exports = function startCleanupJob(app) {
    const INTERVAL = 30 * 60 * 1000; // 5 minutes

    setInterval(async () => {
        console.log("Cleaning expired files...");

        try {
            const now = new Date();

            // Find all expired items
            const expiredFiles = await FileMeta.find({
                expiresAt: { $lte: now }
            });

            if (expiredFiles.length === 0) return;

            const bucket = app.locals.gfsBucket;

            for (const file of expiredFiles) {
                await deleteGridFsFile(bucket, file.gridFsId);
                await FileMeta.deleteOne({ _id: file._id });

                console.log(`Removed expired file: ${file.originalname}`);
            }
        } catch (err) {
            console.error("Cleanup job failed:", err);
        }
    }, INTERVAL);
};
