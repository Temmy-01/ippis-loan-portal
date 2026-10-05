import { Link } from 'react-router-dom'

const FLOWS = [
  { label: 'Verification', to: '/verify-identity' },
  { label: 'Decision' },
  { label: 'Offer' },
  { label: 'Disbursement' },
  { label: 'Session expired' },
]

export function PrototypeFlows() {
  if (!import.meta.env.DEV) return null

  return (
    <div
      className="anim-fade-up fixed right-[18px] bottom-4 z-10 hidden items-start gap-1 rounded-[10px] border border-app-line bg-white/95 p-[7px] shadow-[0_12px_38px_0_rgb(52_34_67/0.08)] md:flex"
      style={{ ['--delay' as string]: '900ms' }}
    >
      <span className="px-2 py-1.5 font-inter text-[11px] leading-[17px] text-app-muted">Prototype flows</span>
      {FLOWS.map((flow) =>
        flow.to ? (
          <Link
            key={flow.label}
            to={flow.to}
            className="rounded-[6px] bg-app-bg px-1.5 pt-[6.28px] pb-[6.77px] font-inter text-[10px] leading-[15.5px] font-bold text-lms-purple transition-colors hover:bg-lilac-soft"
          >
            {flow.label}
          </Link>
        ) : (
          <span
            key={flow.label}
            title="Coming soon"
            className="cursor-not-allowed rounded-[6px] bg-app-bg px-1.5 pt-[6.28px] pb-[6.77px] font-inter text-[10px] leading-[15.5px] font-bold text-lms-purple/50"
          >
            {flow.label}
          </span>
        ),
      )}
    </div>
  )
}
