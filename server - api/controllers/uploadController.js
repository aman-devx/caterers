const { storeImage } = require('../utils/imageStore');

async function uploadImage(req, res) {
  try {
    if (req.body?.url && typeof req.body.url === 'string') {
      const url = req.body.url.trim();
      if (!url.startsWith('http') && !url.startsWith('data:image/')) {
        return res.status(400).json({ error: 'URL must be a valid http(s) or data:image URL' });
      }
      return res.json({ url });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded. Send multipart file or JSON { url }.' });
    }

    const url = await storeImage(req.file, req);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
}

module.exports = { uploadImage };
