/* CSS-based ambient floating particles — works on every page, zero canvas overhead */

const PETALS = [
  { cls: 'petal-1',  x: '8%',  size: 5,  color: '#800000', opacity: 0.45 },
  { cls: 'petal-2',  x: '18%', size: 3,  color: '#D4A5A5', opacity: 0.35 },
  { cls: 'petal-3',  x: '30%', size: 6,  color: '#F4C2C2', opacity: 0.30 },
  { cls: 'petal-4',  x: '43%', size: 4,  color: '#800000', opacity: 0.40 },
  { cls: 'petal-5',  x: '55%', size: 3,  color: '#FFF8F0', opacity: 0.50 },
  { cls: 'petal-6',  x: '64%', size: 5,  color: '#D4A5A5', opacity: 0.35 },
  { cls: 'petal-7',  x: '73%', size: 4,  color: '#800000', opacity: 0.40 },
  { cls: 'petal-8',  x: '83%', size: 3,  color: '#F4C2C2', opacity: 0.45 },
  { cls: 'petal-9',  x: '91%', size: 5,  color: '#D4A5A5', opacity: 0.30 },
  { cls: 'petal-10', x: '14%', size: 4,  color: '#800000', opacity: 0.38 },
  { cls: 'petal-11', x: '49%', size: 6,  color: '#F4C2C2', opacity: 0.28 },
  { cls: 'petal-12', x: '78%', size: 3,  color: '#D4A5A5', opacity: 0.42 },
]

export default function FloatingPetals() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {PETALS.map((p) => (
        <div
          key={p.cls}
          className={`absolute rounded-full ${p.cls}`}
          style={{
            left: p.x,
            bottom: '-20px',
            width:  `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            opacity: p.opacity,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  )
}
