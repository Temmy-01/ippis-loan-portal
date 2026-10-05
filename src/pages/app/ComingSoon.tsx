import { Link } from 'react-router-dom'

export default function ComingSoon() {
  return (
    <div className="anim-fade-up flex flex-col items-start gap-3 rounded-[22px] border border-dashed border-app-line bg-white p-10">
      <p className="font-inter text-[12px] font-extrabold tracking-[1.2px] text-lms-purple uppercase">In progress</p>
      <h1 className="font-inter text-[24px] font-bold text-app-ink">This page is being built next</h1>
      <p className="font-inter text-[16px] text-app-muted">Check back soon.</p>
      <Link to="/dashboard" className="mt-2 font-inter text-[16px] font-bold text-lms-purple hover:underline">
        Back to Dashboard
      </Link>
    </div>
  )
}
