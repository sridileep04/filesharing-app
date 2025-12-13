const mongoose = require("mongoose");

async function deleteGridFsFile(bucket, fileId) {
    try {
        if (!bucket) {
            console.error("GridFS bucket not initialized");
            return;
        }

        await bucket.delete(new mongoose.Types.ObjectId(fileId));
        console.log("🗑️ Deleted file:", fileId);
    } catch (err) {
        console.error("❌ Error deleting GridFS file:", err);
    }
}

module.exports = deleteGridFsFile;
