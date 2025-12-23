/**
 * Leaderboard Island - Layer 1 (React Hydration)
 *
 * Displays top players and user's position.
 * Directive: client:idle (can wait for main thread)
 */

// Simple icons
const TrophyIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

const MedalIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
)

const FlameIcon = ({ className = 'h-3 w-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

const TrendUpIcon = ({ className = 'h-3 w-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const LEADERBOARD = [
  { rank: 1, name: 'DiamondHands69', points: 125420, streak: 15, wins: 89 },
  { rank: 2, name: 'DegenerateApe', points: 98750, streak: 12, wins: 72 },
  { rank: 3, name: 'MoonBoy2024', points: 87300, streak: 8, wins: 65 },
  { rank: 4, name: 'WhaleWatcher', points: 76500, streak: 5, wins: 58 },
  { rank: 5, name: 'PepeMaxi', points: 65200, streak: 3, wins: 51 },
  { rank: 6, name: 'SatoshiJr', points: 54100, streak: 7, wins: 45 },
  { rank: 7, name: 'LeverageKing', points: 48900, streak: 2, wins: 42 },
  { rank: 8, name: 'NotFinancialAdvice', points: 42300, streak: 1, wins: 38 },
  { rank: 9, name: 'BuyHighSellLow', points: 38700, streak: 0, wins: 35 },
  { rank: 10, name: 'RektButNotDead', points: 35200, streak: 4, wins: 32 },
]

export function Leaderboard() {
  return (
    <div className="card-terminal h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-chart-5"><TrophyIcon /></span>
        <h3 className="text-lg font-bold font-mono">LEADERBOARD</h3>
      </div>

      {/* Leaderboard entries */}
      <div className="space-y-2">
        {LEADERBOARD.map((player) => (
          <div
            key={player.rank}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              player.rank <= 3 ? 'bg-primary/10 border border-primary/30' : 'bg-card/50'
            }`}
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {player.rank === 1 ? (
                <span className="text-chart-5"><TrophyIcon /></span>
              ) : player.rank === 2 ? (
                <span className="text-gray-400"><MedalIcon /></span>
              ) : player.rank === 3 ? (
                <span className="text-amber-600"><MedalIcon /></span>
              ) : (
                <span className="text-sm font-mono text-muted-foreground">{player.rank}</span>
              )}
            </div>

            {/* Player info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{player.name}</span>
                {player.streak >= 5 && (
                  <span className="inline-flex items-center px-1 py-0.5 rounded border border-destructive text-destructive text-[10px]">
                    <FlameIcon />
                    <span className="ml-0.5">{player.streak}</span>
                  </span>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground">{player.wins} wins</div>
            </div>

            {/* Points */}
            <div className="text-right">
              <div className="font-mono font-bold text-primary text-sm">
                {player.points.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground">PTS</div>
            </div>
          </div>
        ))}

        {/* Your position */}
        <div className="pt-2 mt-2 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/20 border border-accent/30">
            <div className="w-8 text-center">
              <span className="text-sm font-mono text-accent">#42</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-accent">You</span>
                <span className="inline-flex items-center px-1 py-0.5 rounded border border-primary text-primary text-[10px]">
                  <TrendUpIcon />
                  <span className="ml-0.5">+5</span>
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">12 wins</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-accent text-sm">1,000</div>
              <div className="text-[10px] text-muted-foreground">PTS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
