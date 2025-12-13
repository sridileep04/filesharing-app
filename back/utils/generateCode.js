const FileMeta = require('../models/FileMeta');

async function generateUnique5DigitCode() {
    for (let i = 0; i < 10; i++) {
        const code = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
        const exists = await FileMeta.findOne({ code });
        if (!exists) return code;
    }
    return "99999"; // fallback
}
module.exports = generateUnique5DigitCode;
