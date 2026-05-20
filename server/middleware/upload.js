const multer = require('multer')
const path   = require('path')

const ALLOWED_EXT  = /\.(jpe?g|png|gif|webp|pdf|doc|docx)$/i
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const fileFilter = (_req, file, cb) => {
  const extOk  = ALLOWED_EXT.test(path.extname(file.originalname).toLowerCase())
  const mimeOk = ALLOWED_MIME.has(file.mimetype)
  if (extOk && mimeOk) cb(null, true)
  else cb(new Error('Only images (JPG, PNG, GIF, WEBP) and documents (PDF, DOC, DOCX) are allowed. No videos.'))
}

module.exports = multer({
  storage:    multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
})
