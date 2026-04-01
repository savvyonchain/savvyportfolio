'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useSoundEffects } from '@/hooks/useSoundEffects'

const SoundContext = createContext()

export function SoundProvider({ children }) {
	const { playClick, playScroll, playNavigation, playHover } = useSoundEffects()
	const lastScrollTimeRef = useRef(0)
	const [soundEnabled, setSoundEnabled] = useState(false) // Sounds off by default

	// Add scroll sound effect with debouncing
	useEffect(() => {
		let lastScrollY = 0

		const handleScroll = () => {
			if (!soundEnabled) return

			const now = Date.now()
			const currentScrollY = window.scrollY

			// Only play scroll sound every 300ms to avoid spam
			if (now - lastScrollTimeRef.current > 300) {
				// Only play if actually scrolling
				if (Math.abs(currentScrollY - lastScrollY) > 50) {
					playScroll()
					lastScrollTimeRef.current = now
				}
			}

			lastScrollY = currentScrollY
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [playScroll, soundEnabled])

	// Add click sound effects
	useEffect(() => {
		const handleClick = (e) => {
			if (!soundEnabled) return

			const target = e.target

			// Play different sounds for different elements
			if (
				target.closest('a') ||
				target.closest('button') ||
				target.closest('[role="button"]')
			) {
				playClick()
			}
		}

		document.addEventListener('click', handleClick)
		return () => document.removeEventListener('click', handleClick)
	}, [playClick, soundEnabled])

	// Handle link navigation with sound
	useEffect(() => {
		const handleLinkClick = (e) => {
			if (!soundEnabled) return

			if (e.target.closest('a')) {
				playNavigation()
			}
		}

		document.addEventListener('click', handleLinkClick)
		return () => document.removeEventListener('click', handleLinkClick)
	}, [playNavigation, soundEnabled])

	// Expose sound functions and settings
	const value = {
		playClick,
		playScroll,
		playNavigation,
		playHover,
		soundEnabled,
		setSoundEnabled,
		toggleSound: () => {
			setSoundEnabled((prev) => !prev)
		},
	}

	return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSounds() {
	const context = useContext(SoundContext)
	if (!context) {
		throw new Error('useSounds must be used within SoundProvider')
	}
	return context
}
