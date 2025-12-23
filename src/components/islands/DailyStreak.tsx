/**
 * DailyStreak Island - Layer 1 (React Hydration)
 *
 * Streak tracker with countdown timer and rewards.
 * Directive: client:idle (below fold, can wait)
 */
import { useState, useEffect } from 'react'
import { useTelegramDirect } from './TelegramContext'

// Icons
const FlameIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

const GiftIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
)

const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ZapIcon = ({ className = 'w-3 h-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const TrophyIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

export function DailyStreak() {
  const { hapticFeedback } = useTelegramDirect()
  const [streak, setStreak] = useState(7)
  const [claimed, setClaimed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 })

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const claimReward = () => {
    hapticFeedback('heavy')
    setClaimed(true)
    setStreak((s) => s + 1)
  }

  const streakRewards = [
    { day: 1, points: 10, claimed: true },
    { day: 2, points: 20, claimed: true },
    { day: 3, points: 30, claimed: true },
    { day: 4, points: 50, claimed: true },
    { day: 5, points: 75, claimed: true },
    { day: 6, points: 100, claimed: true },
    { day: 7, points: 200, claimed: claimed, bonus: 'Mystery Box' },
  ]

  return (
    <div className="rounded-lg border border-destructive/50 overflow-hidden">
      <div className="bg-gradient-to-r from-destructive/30 via-destructive/10 to-chart-5/30 p-1">
        <div className="p-4 sm:p-6 bg-card rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/20 border-4 border-destructive flex items-center justify-center">
                  <span className="text-destructive"><FlameIcon className="w-8 h-8 sm:w-10 sm:h-10" /></span>
                </div>
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded bg-chart-5 text-background font-bold text-sm">
                  {streak}
                </span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <span className="text-destructive">{streak} DAY</span> STREAK
                </h2>
                <p className="text-sm text-muted-foreground">Keep it going! Next reward in:</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-accent"><ClockIcon /></span>
                  <span className="font-mono text-accent">
                    {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={claimReward}
              disabled={claimed}
              className={`h-12 px-6 rounded-md font-bold flex items-center gap-2 transition-all ${
                claimed
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-destructive text-white hover:bg-destructive/90 animate-pulse'
              }`}
            >
              <GiftIcon />
              {claimed ? 'CLAIMED TODAY' : 'CLAIM REWARD'}
            </button>
          </div>

          {/* Streak calendar */}
          <div className="grid grid-cols-7 gap-2">
            {streakRewards.map((day) => (
              <div
                key={day.day}
                className={`relative p-2 sm:p-3 rounded-lg border text-center ${
                  day.claimed
                    ? 'bg-destructive/20 border-destructive'
                    : day.day === 7
                      ? 'bg-chart-5/20 border-chart-5 border-dashed'
                      : 'bg-muted/50 border-border'
                }`}
              >
                <div className="text-[10px] text-muted-foreground mb-1">DAY {day.day}</div>
                <div className={`font-bold ${day.claimed ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {day.bonus ? (
                    <span className="text-chart-5 flex justify-center"><TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5" /></span>
                  ) : (
                    <span className="text-xs sm:text-sm">+{day.points}</span>
                  )}
                </div>
                {day.claimed && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <ZapIcon />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Streak multiplier */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm">Current Streak Multiplier</span>
              <span className="px-2 py-0.5 rounded border border-chart-5 text-chart-5 font-bold text-xs">
                {streak >= 30 ? '3.0x' : streak >= 14 ? '2.0x' : streak >= 7 ? '1.5x' : '1.0x'} POINTS
              </span>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-destructive to-chart-5"
                style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>7 days = 1.5x</span>
              <span>14 days = 2x</span>
              <span>30 days = 3x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyStreak
