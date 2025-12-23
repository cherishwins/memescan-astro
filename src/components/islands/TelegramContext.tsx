/**
 * Telegram Context for Astro Islands
 *
 * Provides a hook to access Telegram Mini App APIs.
 * Each island can use this independently.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface TelegramContextValue {
  user: TelegramUser | null
  isInTelegram: boolean
  isMiniApp: boolean
  expand: () => void
  close: () => void
  showAlert: (message: string) => void
  hapticFeedback: (type: 'light' | 'medium' | 'heavy') => void
}

const TelegramContext = createContext<TelegramContextValue>({
  user: null,
  isInTelegram: false,
  isMiniApp: false,
  expand: () => {},
  close: () => {},
  showAlert: () => {},
  hapticFeedback: () => {},
})

export function useTelegram() {
  return useContext(TelegramContext)
}

/**
 * Simple hook for components that just need Telegram access
 * without the provider wrapper (useful for standalone islands)
 */
export function useTelegramDirect() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isInTelegram, setIsInTelegram] = useState(false)

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      setIsInTelegram(true)
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user)
      }
    }
  }, [])

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy') => {
    const tg = (window as any).Telegram?.WebApp
    tg?.HapticFeedback?.impactOccurred(type)
  }

  const showAlert = (message: string) => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.showAlert(message)
    } else {
      alert(message)
    }
  }

  return { user, isInTelegram, hapticFeedback, showAlert }
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isInTelegram, setIsInTelegram] = useState(false)
  const [isMiniApp, setIsMiniApp] = useState(false)

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      setIsInTelegram(true)
      setIsMiniApp(true)

      // Get user data
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user)
      }
    }
  }, [])

  const expand = () => {
    const tg = (window as any).Telegram?.WebApp
    tg?.expand()
  }

  const close = () => {
    const tg = (window as any).Telegram?.WebApp
    tg?.close()
  }

  const showAlert = (message: string) => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.showAlert(message)
    } else {
      alert(message)
    }
  }

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy') => {
    const tg = (window as any).Telegram?.WebApp
    tg?.HapticFeedback?.impactOccurred(type)
  }

  return (
    <TelegramContext.Provider
      value={{
        user,
        isInTelegram,
        isMiniApp,
        expand,
        close,
        showAlert,
        hapticFeedback,
      }}
    >
      {children}
    </TelegramContext.Provider>
  )
}
