import { useState, useRef } from 'react'
import api from '../../lib/api'
import { useOrder } from '../../context/OrderContext'

const PAYMENT = {
  bank:      'Moniepoint',
  name:      'Eunice Adams-Idakwo (Nicys)',
  account:   '6716866025',
}

const PROOF_MIME = new Set(['image/jpeg','image/jpg','image/png','image/gif','image/webp','application/pdf'])
const PROOF_EXT  = /\.(jpe?g|png|gif|webp|pdf)$/i

const NEEDS_IMAGES = ['heartfelt-heirloom', 'cinematic-scribe']

const ALLOWED_MIME = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ALLOWED_EXT = /\.(jpe?g|png|gif|webp|pdf|doc|docx)$/i
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_FILES = 5

export default function Step4Contact() {
  const { orderData, updateOrder, nextStep, prevStep, setOrderId, setSubmitting, submitting } = useOrder()
  const { format, letterImages, signature, deliveryDate, senderName, senderEmail, senderPhone, recipientEmail, paymentProof } = orderData
  const [errors, setErrors] = useState({})
  const fileRef  = useRef(null)
  const proofRef = useRef(null)

  const needsImages = NEEDS_IMAGES.includes(format)

  const handle = (field) => (ev) => {
    updateOrder({ [field]: ev.target.value })
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
  }

  const handleProof = (ev) => {
    const file = ev.target.files?.[0]
    if (!file) return
    if (!PROOF_EXT.test(file.name) || !PROOF_MIME.has(file.type)) {
      setErrors(p => ({ ...p, paymentProof: 'Please upload an image or PDF of your receipt.' }))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors(p => ({ ...p, paymentProof: 'Receipt file must be under 10 MB.' }))
      return
    }
    updateOrder({ paymentProof: file })
    setErrors(p => ({ ...p, paymentProof: '' }))
    ev.target.value = ''
  }

  const handleFiles = (ev) => {
    const incoming = Array.from(ev.target.files || [])
    const combined = [...letterImages]
    const fileErrors = []

    for (const file of incoming) {
      if (combined.length >= MAX_FILES) {
        fileErrors.push(`Maximum ${MAX_FILES} files allowed.`)
        break
      }
      if (!ALLOWED_EXT.test(file.name) || !ALLOWED_MIME.includes(file.type)) {
        fileErrors.push(`"${file.name}" is not supported. Use images (JPG, PNG, GIF, WEBP) or documents (PDF, DOC, DOCX).`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        fileErrors.push(`"${file.name}" exceeds 10 MB.`)
        continue
      }
      // No duplicate names
      if (!combined.find(f => f.name === file.name && f.size === file.size)) {
        combined.push(file)
      }
    }

    updateOrder({ letterImages: combined })
    if (fileErrors.length) {
      setErrors(p => ({ ...p, letterImages: fileErrors.join(' ') }))
    } else {
      setErrors(p => ({ ...p, letterImages: '' }))
    }
    // reset input so same file can be re-selected after removing
    ev.target.value = ''
  }

  const removeFile = (index) => {
    updateOrder({ letterImages: letterImages.filter((_, i) => i !== index) })
  }

  const getMinDate = () => {
    const d = new Date()
    let added = 0
    while (added < 3) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0 && d.getDay() !== 6) added++
    }
    return d.toISOString().split('T')[0]
  }

  const validate = () => {
    const e = {}
    if (!signature.trim())          e.signature     = 'Please enter how we should sign the letter.'
    if (!deliveryDate)              e.deliveryDate  = 'Please choose a delivery date.'
    if (!senderName.trim())         e.senderName    = 'Your name is required.'
    if (!senderEmail.includes('@')) e.senderEmail   = 'A valid email address is required.'
    if (!senderPhone.trim())        e.senderPhone   = 'Your phone number is required.'
    if (!recipientEmail.includes('@')) e.recipientEmail = 'A valid recipient email is required for delivery.'
    if (!paymentProof) e.paymentProof = 'Please upload your payment screenshot or receipt before submitting.'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setSubmitting(true)
    try {
      const formData = new FormData()

      // Append all scalar order data
      const scalars = [
        'collection', 'recipientName', 'tier', 'designerMessage',
        'littleThings', 'coreMemory', 'unspoken', 'format',
        'signature', 'deliveryDate', 'senderName', 'senderEmail',
        'senderPhone', 'recipientEmail',
      ]
      scalars.forEach(k => formData.append(k, orderData[k] || ''))

      // Append image/doc files
      letterImages.forEach(file => formData.append('letterImages', file))

      // Append payment proof
      if (paymentProof) formData.append('paymentProof', paymentProof)

      const { data } = await api.post('/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setOrderId(data.orderId)
      nextStep()
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-light text-midnight mb-2">Final Details</h2>
      <p className="font-body text-sm text-midnight/50 mb-10">Almost there — a few last whispers.</p>

      <div className="space-y-10">

        {/* Photo Upload — only for Heartfelt Heirloom & Cinematic Scribe */}
        {needsImages && (
          <div>
            <h3 className="font-display text-xl text-midnight mb-1">Photo Upload</h3>
            <p className="font-body text-xs text-midnight/45 mb-5 leading-relaxed">
              Upload the memories you'd like us to weave into your story. Up to {MAX_FILES} files, max 10 MB each.
              Accepted: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX — no videos.
            </p>

            <div
              className="border-2 border-dashed border-midnight/15 p-8 text-center rounded-sm transition-colors duration-200 hover:border-lavender/40"
              style={{ boxShadow: 'inset 0 1px 3px rgba(13,27,56,0.04)' }}
              onClick={() => fileRef.current?.click()}
            >
              <div className="text-2xl mb-2 text-lavender/60">◈</div>
              <p className="font-body text-sm text-midnight/50 mb-1">
                {letterImages.length < MAX_FILES
                  ? `Click to add photos or documents (${letterImages.length}/${MAX_FILES})`
                  : `${MAX_FILES} files selected — limit reached`}
              </p>
              <p className="font-body text-xs text-midnight/30">Images & documents only · Max 10 MB each</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFiles}
            />

            {letterImages.length > 0 && (
              <ul className="mt-4 space-y-2">
                {letterImages.map((file, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-3 bg-cream-dark border border-midnight/8 rounded-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lavender text-sm flex-shrink-0">
                        {file.type.startsWith('image/') ? '◉' : '▣'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-body text-xs font-medium text-midnight truncate">{file.name}</p>
                        <p className="font-body text-[10px] text-midnight/40">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="font-body text-[10px] text-midnight/35 hover:text-dusty-rose transition-colors ml-4 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {errors.letterImages && (
              <p className="font-body text-xs text-dusty-rose mt-2">{errors.letterImages}</p>
            )}
          </div>
        )}

        {/* Signature */}
        <div>
          <label className="form-label">Signature *</label>
          <p className="font-body text-xs text-midnight/40 mb-2 leading-relaxed">
            How should I sign it? (e.g. "Always yours, [Your Name]" or "Anonymously, A Secret Admirer")
          </p>
          <input
            type="text"
            className="form-input"
            placeholder="Always yours, Sarah…"
            value={signature}
            onChange={handle('signature')}
          />
          {errors.signature && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.signature}</p>}
        </div>

        {/* Delivery date */}
        <div>
          <label className="form-label">Delivery Date *</label>
          <p className="font-body text-xs text-midnight/40 mb-2">When does this need to land in their inbox/hands?</p>
          <input
            type="date"
            className="form-input"
            min={getMinDate()}
            value={deliveryDate}
            onChange={handle('deliveryDate')}
          />
          <p className="font-body text-xs text-midnight/35 mt-1.5">Minimum 3 business days from today.</p>
          {errors.deliveryDate && <p className="font-body text-xs text-dusty-rose mt-1">{errors.deliveryDate}</p>}
        </div>

        {/* Your info */}
        <div>
          <h3 className="font-display text-xl text-midnight mb-5 pb-3 border-b border-midnight/8">Your Information</h3>
          <div className="space-y-5">
            <div>
              <label className="form-label">Your Full Name *</label>
              <input type="text" className="form-input" placeholder="Jane Doe"
                value={senderName} onChange={handle('senderName')} />
              {errors.senderName && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.senderName}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Your Email *</label>
                <input type="email" className="form-input" placeholder="jane@example.com"
                  value={senderEmail} onChange={handle('senderEmail')} />
                {errors.senderEmail && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.senderEmail}</p>}
              </div>
              <div>
                <label className="form-label">Your Phone Number *</label>
                <input type="tel" className="form-input" placeholder="+234 800 000 0000"
                  value={senderPhone} onChange={handle('senderPhone')} />
                {errors.senderPhone && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.senderPhone}</p>}
              </div>
            </div>
            <div>
              <label className="form-label">Recipient's Email Address *</label>
              <p className="font-body text-xs text-midnight/40 mb-2">
                Where should the sanctuary be delivered?
              </p>
              <input type="email" className="form-input" placeholder="recipient@example.com"
                value={recipientEmail} onChange={handle('recipientEmail')} />
              {errors.recipientEmail && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.recipientEmail}</p>}
            </div>
          </div>
        </div>

        {/* Payment details */}
        <div>
          <h3 className="font-display text-xl text-midnight mb-5 pb-3 border-b border-midnight/8">Payment Details</h3>

          <div
            className="p-6 bg-cream-dark border border-lavender/22 rounded-sm mb-5"
            style={{ boxShadow: '0 3px 12px rgba(13,27,56,0.06), inset 0 1px 0 rgba(255,255,255,0.55)' }}
          >
            <p className="font-body text-[10px] tracking-widest uppercase text-lavender mb-5 font-semibold">Bank Transfer</p>
            <div className="space-y-3">
              {[
                { k: 'Bank',           v: PAYMENT.bank    },
                { k: 'Account Name',   v: PAYMENT.name    },
                { k: 'Account Number', v: PAYMENT.account },
                { k: 'Reference',      v: `${senderName || '[Your Name]'} + [Tier Name]` },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between items-center py-1.5 border-b border-midnight/6 last:border-0">
                  <span className="font-body text-xs text-midnight/45">{k}</span>
                  <span className="font-body text-sm text-midnight font-semibold tracking-wide">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-5 border border-lavender/20 bg-lavender/5 rounded-sm"
            style={{ boxShadow: 'inset 0 1px 0 rgba(196,168,240,0.15)' }}
          >
            <p className="font-body text-[10px] tracking-widest uppercase text-lavender mb-3 font-semibold">Confirmation Steps</p>
            <ol className="space-y-2">
              {[
                'Send your investment to the account above.',
                'Send a screenshot of your receipt to us on IG.',
                'In that same message, include the recipient\'s email address where the sanctuary should be delivered.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-display text-xs text-lavender/70 flex-shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="font-body text-xs text-midnight/65 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Payment proof upload */}
        <div>
          <h3 className="font-display text-xl text-midnight mb-1">Upload Payment Screenshot *</h3>
          <p className="font-body text-xs text-midnight/45 mb-5 leading-relaxed">
            Send your receipt to us on IG <strong>and</strong> upload a copy here before submitting. This helps us confirm your payment faster.
          </p>

          <div
            className="border-2 border-dashed border-midnight/15 p-8 text-center rounded-sm transition-colors duration-200 hover:border-lavender/40"
            style={{ boxShadow: 'inset 0 1px 3px rgba(13,27,56,0.04)' }}
            onClick={() => proofRef.current?.click()}
          >
            {paymentProof ? (
              <div>
                <p className="font-body text-sm text-emerald font-semibold mb-1">✓ {paymentProof.name}</p>
                <p className="font-body text-xs text-midnight/40">{(paymentProof.size / 1024).toFixed(0)} KB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); updateOrder({ paymentProof: null }) }}
                  className="mt-2 font-body text-[10px] text-midnight/35 hover:text-dusty-rose transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2 text-lavender/60">◉</div>
                <p className="font-body text-sm text-midnight/50 mb-1">Click to upload receipt screenshot</p>
                <p className="font-body text-xs text-midnight/30">JPG, PNG, PDF — max 10 MB</p>
              </div>
            )}
          </div>
          <input
            ref={proofRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleProof}
          />
          {errors.paymentProof && (
            <p className="font-body text-xs text-dusty-rose mt-2">{errors.paymentProof}</p>
          )}
        </div>

        {/* No refunds */}
        <div className="p-4 border border-midnight/8 bg-cream-dark rounded-sm">
          <p className="font-body text-xs text-midnight/55 leading-relaxed">
            <strong>Please note:</strong> No refunds are offered due to the deeply personalised nature of our work. By submitting this order, you agree to our Terms & Conditions.
          </p>
        </div>

        {errors.submit && (
          <p className="font-body text-sm text-dusty-rose">{errors.submit}</p>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={prevStep} disabled={submitting} className="btn-ghost">← Back</button>
        <button
          onClick={submit}
          disabled={submitting}
          className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? 'Placing your order…' : 'Place My Order →'}
        </button>
      </div>
    </div>
  )
}
