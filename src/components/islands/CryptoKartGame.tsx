/**
 * CryptoKart Game Island - Layer 1 (React Hydration)
 *
 * Interactive racing game with betting mechanics.
 * Directive: client:load (core feature, needs immediate interaction)
 */
import { useState, useEffect, useCallback } from 'react'
import { useTelegramDirect } from './TelegramContext'

interface RaceState {
  isRacing: boolean
  countdown: number | null
  positions: { [key: string]: number }
  winner: string | null
  betAmount: number
  potentialWin: number
}

const OPPONENTS = [
  { id: 'elon', name: 'Rocket Man', color: 'bg-blue-500' },
  { id: 'pepe', name: 'Lord Pepe', color: 'bg-green-500' },
  { id: 'whale', name: 'Whale Daddy', color: 'bg-cyan-500' },
]

// Simple icons
const FlagIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const PlayIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const ZapIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

const RotateIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 4v6h6" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
)

const CoinsIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="M16.71 13.88l.7.71-2.82 2.82" />
  </svg>
)

export function CryptoKartGame() {
  const { hapticFeedback } = useTelegramDirect()
  const [raceState, setRaceState] = useState<RaceState>({
    isRacing: false,
    countdown: null,
    positions: { player: 0, elon: 0, pepe: 0, whale: 0 },
    winner: null,
    betAmount: 100,
    potentialWin: 400,
  })
  const [userPoints, setUserPoints] = useState(1000)
  const [boostAvailable, setBoostAvailable] = useState(true)

  const startRace = useCallback(() => {
    if (userPoints < raceState.betAmount) return

    hapticFeedback('medium')
    setUserPoints((prev) => prev - raceState.betAmount)
    setRaceState((prev) => ({
      ...prev,
      countdown: 3,
      positions: { player: 0, elon: 0, pepe: 0, whale: 0 },
      winner: null,
    }))
    setBoostAvailable(true)
  }, [raceState.betAmount, userPoints, hapticFeedback])

  // Countdown timer
  useEffect(() => {
    if (raceState.countdown === null) return
    if (raceState.countdown > 0) {
      const timer = setTimeout(() => {
        setRaceState((prev) => ({ ...prev, countdown: prev.countdown! - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (raceState.countdown === 0) {
      setRaceState((prev) => ({ ...prev, isRacing: true, countdown: null }))
    }
  }, [raceState.countdown])

  // Race simulation
  useEffect(() => {
    if (!raceState.isRacing) return

    const interval = setInterval(() => {
      setRaceState((prev) => {
        const newPositions = { ...prev.positions }

        // Move each racer with some randomness
        Object.keys(newPositions).forEach((racer) => {
          const baseSpeed = racer === 'player' ? 3 : 2.5
          const randomBoost = Math.random() * 2
          newPositions[racer] = Math.min(100, newPositions[racer] + baseSpeed + randomBoost)
        })

        // Check for winner
        const winner = Object.entries(newPositions).find(([_, pos]) => pos >= 100)?.[0] || null

        if (winner) {
          // Award points if player won
          if (winner === 'player') {
            hapticFeedback('heavy')
            setTimeout(() => {
              setUserPoints((p) => p + prev.potentialWin)
            }, 500)
          } else {
            hapticFeedback('light')
          }
          return { ...prev, positions: newPositions, winner, isRacing: false }
        }

        return { ...prev, positions: newPositions }
      })
    }, 100)

    return () => clearInterval(interval)
  }, [raceState.isRacing, hapticFeedback])

  const useBoost = () => {
    if (!boostAvailable || !raceState.isRacing) return
    hapticFeedback('heavy')
    setBoostAvailable(false)
    setRaceState((prev) => ({
      ...prev,
      positions: {
        ...prev.positions,
        player: Math.min(100, prev.positions.player + 15),
      },
    }))
  }

  const setBet = (amount: number) => {
    hapticFeedback('light')
    setRaceState((prev) => ({
      ...prev,
      betAmount: amount,
      potentialWin: amount * 4,
    }))
  }

  return (
    <div className="card-terminal">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="text-primary"><FlagIcon /></span>
          RACE TRACK
        </h3>
        <div className="flex items-center gap-1 px-2 py-1 rounded border border-chart-5/50 text-chart-5 text-xs font-bold">
          <CoinsIcon />
          {userPoints.toLocaleString()} PTS
        </div>
      </div>

      {/* Race Track */}
      <div className="relative p-4 rounded-lg border border-border bg-card/50 space-y-3">
        {/* Finish line */}
        <div className="absolute right-4 top-0 bottom-0 w-1 bg-primary/30" />
        <div className="absolute right-2 top-2 text-xs font-mono text-primary">FINISH</div>

        {/* Player track */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono w-20 truncate text-primary">YOU</span>
            <div className="flex-1 h-8 bg-muted/50 rounded relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all duration-100"
                style={{ width: `${raceState.positions.player}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs transition-all duration-100"
                style={{ left: `calc(${raceState.positions.player}% - 12px)` }}
              >
                D
              </div>
            </div>
          </div>
        </div>

        {/* Opponent tracks */}
        {OPPONENTS.map((opp) => (
          <div key={opp.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono w-20 truncate text-muted-foreground">{opp.name}</span>
              <div className="flex-1 h-8 bg-muted/50 rounded relative overflow-hidden">
                <div
                  className={`absolute left-0 top-0 bottom-0 ${opp.color} opacity-20 transition-all duration-100`}
                  style={{ width: `${raceState.positions[opp.id]}%` }}
                />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 ${opp.color} rounded-full flex items-center justify-center text-xs text-white transition-all duration-100`}
                  style={{ left: `calc(${raceState.positions[opp.id]}% - 12px)` }}
                >
                  {opp.name[0]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Countdown overlay */}
      {raceState.countdown !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="text-6xl font-bold text-primary text-glow animate-pulse">
            {raceState.countdown || 'GO!'}
          </div>
        </div>
      )}

      {/* Winner announcement */}
      {raceState.winner && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            raceState.winner === 'player'
              ? 'border-primary bg-primary/20'
              : 'border-destructive bg-destructive/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className={raceState.winner === 'player' ? 'text-primary' : 'text-destructive'}>
              <TrophyIcon />
            </span>
            <span className="font-bold text-lg">
              {raceState.winner === 'player'
                ? `YOU WON +${raceState.potentialWin} PTS!`
                : 'REKT! TRY AGAIN'}
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        {/* Bet selector */}
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-2">BET AMOUNT</div>
          <div className="flex gap-2">
            {[50, 100, 250, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBet(amount)}
                disabled={raceState.isRacing || raceState.countdown !== null}
                className={`flex-1 px-2 py-1.5 rounded text-sm font-medium transition-all ${
                  raceState.betAmount === amount
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border hover:border-primary/50'
                } disabled:opacity-50`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Win potential */}
        <div className="text-center sm:text-right">
          <div className="text-xs text-muted-foreground mb-1">POTENTIAL WIN</div>
          <div className="text-2xl font-bold text-chart-5">{raceState.potentialWin}</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-3">
        {!raceState.isRacing && raceState.countdown === null ? (
          <button
            onClick={startRace}
            disabled={userPoints < raceState.betAmount}
            className="flex-1 h-12 text-lg bg-primary text-primary-foreground rounded-md font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <PlayIcon />
            START RACE ({raceState.betAmount} PTS)
          </button>
        ) : raceState.isRacing ? (
          <button
            onClick={useBoost}
            disabled={!boostAvailable}
            className={`flex-1 h-12 text-lg rounded-md font-bold flex items-center justify-center gap-2 transition-all ${
              boostAvailable
                ? 'border-2 border-chart-5 text-chart-5 hover:bg-chart-5/20'
                : 'border border-border text-muted-foreground'
            }`}
          >
            <ZapIcon />
            {boostAvailable ? 'USE BOOST!' : 'BOOST USED'}
          </button>
        ) : raceState.winner ? (
          <button
            onClick={startRace}
            className="flex-1 h-12 text-lg bg-primary text-primary-foreground rounded-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <RotateIcon />
            RACE AGAIN
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default CryptoKartGame
