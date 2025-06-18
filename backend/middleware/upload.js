// src/middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ricreiamo __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// directory di upload
const uploadDir = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// storage Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:   (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// esportiamo solo il middleware configurato
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB
  fileFilter: (_req, file, cb) => {
    // accetta solo immagini
    cb(null, file.mimetype.startsWith('image/'));
  }
});
