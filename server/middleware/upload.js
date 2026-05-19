const multer = require('multer')
const path   = require('path')

const fileFilter = (_req, file, cb) => {
  const extOk  = /jpeg|jpg|png|gif|pdf/.test(path.extname(file.originalname).toLowerCase())
  const mimeOk = /image\/(jpeg|jpg|png|gif)|application\/pdf/.test(file.mimetype)
  if (extOk && mimeOk) cb(null, true)
  else cb(new Error('Only images and PDFs are allowed.'))
}

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})
