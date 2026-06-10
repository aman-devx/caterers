const fs = require('fs');
const path = require('path');

const MAX_DATA_URL_BYTES = 800 * 1024;

function isServerless() {
  return Boolean(
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    __dirname.includes('/var/task')
  );
}

function canUseLocalDisk() {
  if (isServerless()) return false;

  try {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) return false;
    fs.accessSync(uploadDir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureUploadDir() {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

async function uploadToCloudinary(file) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) return null;

  const base64 = file.buffer.toString('base64');
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  const body = new URLSearchParams();
  body.append('file', dataUri);
  body.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }
  return data.secure_url;
}

function getBaseUrl(req) {
  if (process.env.API_BASE_URL) return process.env.API_BASE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (req?.get?.('host')) return `${req.protocol}://${req.get('host')}`;
  return `http://localhost:${process.env.PORT || 4000}`;
}

function saveToLocalDisk(file, req) {
  if (isServerless()) {
    throw new Error('Local disk storage is not available on serverless');
  }

  const uploadDir = ensureUploadDir();
  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, file.buffer);

  return `${getBaseUrl(req)}/uploads/${filename}`;
}

function toDataUrl(file) {
  if (file.buffer.length > MAX_DATA_URL_BYTES) {
    throw new Error(
      'Image too large for serverless storage. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET, or use an image URL instead.'
    );
  }
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
}

async function storeImage(file, req) {
  if (!file?.buffer) {
    throw new Error('Invalid file');
  }

  const cloudinaryUrl = await uploadToCloudinary(file);
  if (cloudinaryUrl) return cloudinaryUrl;

  if (canUseLocalDisk()) {
    return saveToLocalDisk(file, req);
  }

  return toDataUrl(file);
}

module.exports = { storeImage, isServerless, canUseLocalDisk };
