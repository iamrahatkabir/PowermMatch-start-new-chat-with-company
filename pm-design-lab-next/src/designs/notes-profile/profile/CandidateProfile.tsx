'use client'
// Left column of the candidate profile: photo + facts, Interested / Not Interested, match breakdown, requirements.
import { BadgeCheck, BadgeHelp, Briefcase, CalendarClock, Car, ChevronDown, Clock, Hammer, MapPin, Timer, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '@/lib/cx'
import type { ProfileCandidate, Requirement } from '@/mock/notes'

type Props = {
  candidate: ProfileCandidate
  onInterested?: () => void
  onNotInterested?: () => void
  onPlayVideo?: () => void
  onHowItWorks?: () => void
}

const requirementIcon: Record<Requirement['icon'], LucideIcon> = { wage: Timer, start: CalendarClock, commute: Car, hours: Clock, tools: Hammer }

export function CandidateProfile({ candidate: c, onInterested, onNotInterested, onPlayVideo, onHowItWorks }: Props) {
  return (
    <div className="flex flex-col">
      <div className="p-8">
        <div className="flex items-start gap-6">
          <button type="button" className="relative shrink-0" onClick={onPlayVideo} title="Play video">
            <img src={c.photo} alt="" className="size-24 rounded-full border-[3px] border-warning-500 object-cover p-0.5" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-warning-500 px-1.5 py-0.5 text-[11px] font-medium text-white">Watch Video</span>
          </button>
          <div className="min-w-0 pt-1">
            <h1 className="text-2xl font-semibold text-gray-900">{c.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
              <span className="flex items-center gap-1.5"><User size={16} className="text-gray-600" />{c.age} Years old</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-600" />{c.city}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-700"><Briefcase size={16} className="text-gray-600" />{c.experienceYears} Years of Experience</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-gray-900 hover:bg-brand-dark" onClick={onInterested}>
            Interested <ChevronDown size={16} />
          </button>
          <button type="button" className="flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onNotInterested}>
            Not Interested
          </button>
        </div>
        <button type="button" className="mx-auto mt-3 flex items-center gap-1 text-xs font-medium text-info-500 hover:text-info-700" onClick={onHowItWorks}>
          <BadgeHelp size={14} />How it Works?
        </button>

        <div className="mt-10 overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 border-b border-gray-200 bg-success-50 px-4 py-4">
            <BadgeCheck size={28} className="fill-success-500 text-white" />
            <span className="text-lg font-semibold text-gray-900">{c.match}% Match</span>
          </div>
          {c.factors.map((f, i) => (
            <div key={f.label} className={cx('flex items-start gap-4 px-4 py-4', i > 0 && 'border-t border-gray-200')}>
              <ScoreRing score={f.score} />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">{f.label}</div>
                <p className="mt-0.5 text-sm text-gray-600">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
        <div className="mt-6 flex flex-col gap-5">
          {c.requirements.map((r) => {
            const Icon = requirementIcon[r.icon]
            return (
              <div key={r.label}>
                <div className="flex items-center gap-3 text-sm">
                  <Icon size={20} className="shrink-0 text-warning-500" />
                  <span className="text-gray-700">{r.label}</span>
                  {r.value && <span className="ml-auto text-gray-900">{r.value}</span>}
                </div>
                {r.detail && <p className="mt-1 pl-8 text-sm text-gray-900">{r.detail}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Round score: green ≥ 80, amber ≥ 50, red below
function ScoreRing({ score }: { score: number }) {
  const r = 22
  const len = 2 * Math.PI * r
  const tone = score >= 80 ? 'text-success-500' : score >= 50 ? 'text-warning-500' : 'text-error-500'
  return (
    <div className="relative size-[52px] shrink-0">
      <svg viewBox="0 0 52 52" className="size-full -rotate-90">
        <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" className="stroke-gray-100" />
        <circle cx="26" cy="26" r={r} fill="none" strokeWidth="5" strokeLinecap="round" stroke="currentColor" className={tone} strokeDasharray={`${(score / 100) * len} ${len}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-900">{score}%</span>
    </div>
  )
}
