/**
 * DailyMissions Island - Layer 1 (React Hydration)
 *
 * Mission tracker with progress and claim buttons.
 * Directive: client:idle (below fold, can wait)
 */
import { useState, type ReactNode } from 'react'
import { useTelegramDirect } from './TelegramContext'

// Icons
const TargetIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const CheckIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const EyeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ShareIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const GamepadIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </svg>
)

const MessageIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const ZapIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

interface Mission {
  id: string
  title: string
  description: string
  points: number
  progress: number
  total: number
  completed: boolean
  claimed: boolean
  icon: ReactNode
  type: 'daily' | 'weekly' | 'special'
}

const initialMissions: Mission[] = [
  {
    id: 'scan',
    title: 'Token Scanner',
    description: 'Scan 5 different tokens',
    points: 50,
    progress: 3,
    total: 5,
    completed: false,
    claimed: false,
    icon: <EyeIcon />,
    type: 'daily',
  },
  {
    id: 'share',
    title: 'Social Butterfly',
    description: 'Share a token to Twitter',
    points: 30,
    progress: 1,
    total: 1,
    completed: true,
    claimed: false,
    icon: <ShareIcon />,
    type: 'daily',
  },
  {
    id: 'race',
    title: 'Speed Demon',
    description: 'Win 3 CryptoKart races',
    points: 100,
    progress: 1,
    total: 3,
    completed: false,
    claimed: false,
    icon: <GamepadIcon />,
    type: 'daily',
  },
  {
    id: 'invite',
    title: 'Recruiter',
    description: 'Invite a friend who joins',
    points: 200,
    progress: 0,
    total: 1,
    completed: false,
    claimed: false,
    icon: <MessageIcon />,
    type: 'weekly',
  },
  {
    id: 'streak',
    title: 'Dedicated Degen',
    description: 'Maintain 7 day streak',
    points: 500,
    progress: 7,
    total: 7,
    completed: true,
    claimed: true,
    icon: <ZapIcon />,
    type: 'special',
  },
]

export function DailyMissions() {
  const { hapticFeedback } = useTelegramDirect()
  const [missions, setMissions] = useState<Mission[]>(initialMissions)

  const claimMission = (id: string) => {
    hapticFeedback('medium')
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, claimed: true } : m)))
  }

  const dailyMissions = missions.filter((m) => m.type === 'daily')
  const weeklyMissions = missions.filter((m) => m.type === 'weekly')
  const specialMissions = missions.filter((m) => m.type === 'special')

  return (
    <div className="card-terminal">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-mono flex items-center gap-2">
          <span className="text-primary"><TargetIcon /></span>
          DAILY MISSIONS
        </h3>
        <span className="px-2 py-0.5 rounded border border-primary text-primary text-xs font-bold">
          {missions.filter((m) => m.completed && !m.claimed).length} CLAIMABLE
        </span>
      </div>

      <div className="space-y-4">
        {/* Daily */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground">DAILY TASKS</div>
          {dailyMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onClaim={claimMission} />
          ))}
        </div>

        {/* Weekly */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground">WEEKLY CHALLENGES</div>
          {weeklyMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onClaim={claimMission} />
          ))}
        </div>

        {/* Special */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground">SPECIAL ACHIEVEMENTS</div>
          {specialMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onClaim={claimMission} />
          ))}
        </div>
      </div>
    </div>
  )
}

function MissionCard({ mission, onClaim }: { mission: Mission; onClaim: (id: string) => void }) {
  const progressPercent = (mission.progress / mission.total) * 100

  return (
    <div
      className={`p-3 rounded-lg border ${
        mission.claimed
          ? 'bg-muted/30 border-muted opacity-60'
          : mission.completed
            ? 'bg-primary/10 border-primary'
            : 'bg-card border-border'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            mission.claimed ? 'bg-muted' : mission.completed ? 'bg-primary/20 text-primary' : 'bg-muted/50'
          }`}
        >
          {mission.claimed ? <span className="text-muted-foreground"><CheckIcon /></span> : mission.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{mission.title}</span>
            <span className="px-1.5 py-0.5 rounded border border-border text-[10px]">
              +{mission.points}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{mission.description}</p>

          {!mission.completed && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono">
                  {mission.progress}/{mission.total}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {mission.completed && !mission.claimed && (
          <button
            onClick={() => onClaim(mission.id)}
            className="h-8 px-3 text-xs font-bold bg-primary text-primary-foreground rounded hover:opacity-90 transition-all"
          >
            CLAIM
          </button>
        )}
        {mission.claimed && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckIcon className="w-3 h-3" /> Claimed
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyMissions
