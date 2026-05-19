import { useOrder } from '../../context/OrderContext'
import { COLLECTIONS, GIFT_BOXES } from '../../data/collections'

export default function Step2Collection() {
  const { orderData, updateOrder, nextStep, prevStep } = useOrder()
  const isPhysical = orderData.serviceType === 'physical'

  const select = (id) => updateOrder({ collection: id })
  const canProceed = Boolean(orderData.collection)

  const items = isPhysical ? GIFT_BOXES : COLLECTIONS

  return (
    <div>
      <h2 className="font-display text-4xl font-light text-midnight mb-2">
        {isPhysical ? 'Choose your gift box' : 'Choose your collection'}
      </h2>
      <p className="font-body text-sm text-midnight/55 mb-10 leading-relaxed">
        {isPhysical
          ? 'Select the gift box that suits your occasion.'
          : 'Each collection is crafted around a distinct mood and occasion.'}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {items.map((item) => {
          const selected = orderData.collection === item.id
          const accent   = isPhysical ? item.accent : item.mood
          return (
            <button
              key={item.id}
              onClick={() => select(item.id)}
              className={`text-left p-6 border-2 transition-all duration-300 focus:outline-none ${
                selected
                  ? 'border-lavender bg-lavender/5 shadow-md'
                  : 'border-midnight/12 hover:border-lavender/35'
              }`}
              style={selected ? {} : { borderLeft: `3px solid ${accent}` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  {isPhysical && (
                    <p className="font-body text-[10px] tracking-widest uppercase text-midnight/40 mb-1">{item.subtitle}</p>
                  )}
                  {!isPhysical && (
                    <span
                      className="inline-block font-body text-[9px] tracking-widest uppercase px-2 py-0.5 mb-2"
                      style={{ background: `${accent}22`, color: accent === '#FFF0C0' ? '#9A8A3A' : accent }}
                    >
                      {item.tag}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-medium text-midnight">{item.name}</h3>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                    selected ? 'border-lavender bg-lavender' : 'border-midnight/25'
                  }`}
                >
                  {selected && <span className="text-[10px] text-midnight">✓</span>}
                </div>
              </div>
              <p className="font-body text-xs text-midnight/55 leading-relaxed mb-3">{item.desc}</p>
              <p className="font-body text-xs text-midnight/40">{isPhysical ? item.price : item.priceRange}</p>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={prevStep} className="btn-ghost">← Back</button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
