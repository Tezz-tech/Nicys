import { createContext, useContext, useState } from 'react'

const OrderContext = createContext(null)

export const useOrder = () => {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within OrderProvider')
  return ctx
}

const INITIAL = {
  serviceType:          '',   // 'digital' | 'physical'
  collection:           '',
  recipientName:        '',
  occasion:             '',
  message:              '',
  deliveryDate:         '',
  tier:                 '',   // 'scribe' | 'designer'
  addons:               [],
  specialInstructions:  '',
  senderName:           '',
  senderEmail:          '',
  senderPhone:          '',
  recipientEmail:       '',
  deliveryAddress:      '',
  paymentProof:         null,
}

export function OrderProvider({ children }) {
  const [step,      setStep]      = useState(1)
  const [orderData, setOrderData] = useState(INITIAL)
  const [orderId,   setOrderId]   = useState(null)
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
