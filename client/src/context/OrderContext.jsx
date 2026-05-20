import { createContext, useContext, useState } from 'react'

const OrderContext = createContext(null)

export const useOrder = () => {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within OrderProvider')
  return ctx
}

const INITIAL = {
  // Step 1 — Occasion & Recipient
  collection:        '',   // collection id (e.g. 'lavender-longing')
  recipientName:     '',   // recipient name or nickname

  // Step 2 — Tier
  tier:              '',   // 'designer' | 'scribe'

  // Step 3 — Content (designer path)
  designerMessage:   '',   // their own words

  // Step 3 — Content (scribe path)
  littleThings:      '',   // small habit they secretly love
  coreMemory:        '',   // specific moment / inside joke
  unspoken:          '',   // 30-second declaration

  // Step 3 — Format (both paths)
  format:            '',   // 'pocket-hug' | 'heartfelt-heirloom' | 'cinematic-scribe'

  // Step 4 — Final details
  letterImages:      [],   // File objects (uploaded to Cloudinary on submit)
  signature:         '',   // how to sign it
  deliveryDate:      '',
  senderName:        '',
  senderEmail:       '',
  senderPhone:       '',
  recipientEmail:    '',   // where digital letter is delivered
  paymentProof:      null, // File object (uploaded to Cloudinary on submit)
}

export function OrderProvider({ children }) {
  const [step,       setStep]      = useState(1)
  const [orderData,  setOrderData] = useState(INITIAL)
  const [orderId,    setOrderId]   = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const updateOrder = (updates) =>
    setOrderData((prev) => ({ ...prev, ...updates }))

  const nextStep = () => setStep((s) => Math.min(s + 1, 5))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))
  const goToStep = (n) => setStep(n)

  const resetOrder = () => {
    setStep(1)
    setOrderData(INITIAL)
    setOrderId(null)
    setSubmitting(false)
  }

  return (
    <OrderContext.Provider value={{
      step, orderData, orderId, submitting,
      updateOrder, nextStep, prevStep, goToStep,
      setOrderId, setSubmitting, resetOrder,
    }}>
      {children}
    </OrderContext.Provider>
  )
}
