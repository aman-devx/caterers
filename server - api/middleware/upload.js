const multer = require('multer');

// Memory storage only — never write to disk at module load (required for Vercel/serverless).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

function handleUploadError(err, req, res, next) {
  if (!err) return next();
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Image must be 5 MB or smaller' });
  }
  return res.status(400).json({ error: err.message || 'Upload failed' });
}

module.exports = { upload, handleUploadError };
