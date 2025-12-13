const mongoose = require('mongoose');

const FileMetaSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // 5-digit string
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    length: { type: Number, required: true }, // size in bytes
    contentType: { type: String },
    uploadDate: { type: Date, default: Date.now },
    passwordHash: { type: String, required: true },
    gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true }, // file id in GridFS
    downloadTokens: [{
        token: String,
        expiresAt: Date,
        used: { type: Boolean, default: false }
    }],
    downloadsLeft: { type: Number, default: 1 }, // optional: single-use by default

    expiresAt: { type: Date, required: true },

    // NEW: Allowed download logic
    allowedDownloads: { type: Number, default: 1 },
    downloadsUsed: { type: Number, default: 0 },
});

module.exports = mongoose.model('FileMeta', FileMetaSchema);
