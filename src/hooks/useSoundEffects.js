'use client'

import { useEffect, useRef } from 'react'

export function useSoundEffects() {
	const audioContextRef = useRef(null)

	// Initialize audio context
	useEffect(() => {
		const initAudioContext = () => {
			if (!audioContextRef.current) {
				audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
			}
		}

		// Initialize on first user interaction
		const handleUserInteraction = () => {
			initAudioContext()
			document.removeEventListener('click', handleUserInteraction)
			document.removeEventListener('touchstart', handleUserInteraction)
		}

		document.addEventListener('click', handleUserInteraction)
		document.addEventListener('touchstart', handleUserInteraction)

		return () => {
			document.removeEventListener('click', handleUserInteraction)
			document.removeEventListener('touchstart', handleUserInteraction)
		}
	}, [])

	// Play a cinematic click sound
	const playClick = () => {
		if (!audioContextRef.current) return

		const ctx = audioContextRef.current
		const time = ctx.currentTime

		// Deep bass kick with reverb-like decay
		const osc1 = ctx.createOscillator()
		const gain1 = ctx.createGain()

		osc1.frequency.setValueAtTime(150, time)
		osc1.frequency.exponentialRampToValueAtTime(40, time + 0.15)
		osc1.type = 'sine'
		osc1.connect(gain1)

		// Top end ping
		const osc2 = ctx.createOscillator()
		const gain2 = ctx.createGain()

		osc2.frequency.setValueAtTime(1200, time)
		osc2.frequency.exponentialRampToValueAtTime(400, time + 0.12)
		osc2.type = 'sine'
		osc2.connect(gain2)

		// Master gain
		const masterGain = ctx.createGain()
		gain1.connect(masterGain)
		gain2.connect(masterGain)
		masterGain.connect(ctx.destination)

		// Bass envelope
		gain1.gain.setValueAtTime(0.4, time)
		gain1.gain.exponentialRampToValueAtTime(0.02, time + 0.15)

		// Top end envelope
		gain2.gain.setValueAtTime(0.25, time)
		gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.12)

		osc1.start(time)
		osc2.start(time)
		osc1.stop(time + 0.15)
		osc2.stop(time + 0.12)
	}

	// Play a cinematic scroll/whoosh sound
	const playScroll = () => {
		if (!audioContextRef.current) return

		const ctx = audioContextRef.current
		const time = ctx.currentTime

		// Create filtered noise for futuristic whoosh
		const bufferSize = ctx.sampleRate * 0.25
		const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
		const data = buffer.getChannelData(0)

		for (let i = 0; i < bufferSize; i++) {
			data[i] = Math.random() * 2 - 1
		}

		const source = ctx.createBufferSource()
		source.buffer = buffer

		// High-pass for bright future effect
		const highPass = ctx.createBiquadFilter()
		highPass.type = 'highpass'
		highPass.frequency.setValueAtTime(800, time)
		highPass.Q.setValueAtTime(2, time)

		// Low-pass for body
		const lowPass = ctx.createBiquadFilter()
		lowPass.type = 'lowpass'
		lowPass.frequency.setValueAtTime(5000, time)
		lowPass.Q.setValueAtTime(1, time)

		const gain = ctx.createGain()
		gain.gain.setValueAtTime(0.2, time)
		gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25)

		source.connect(highPass)
		highPass.connect(lowPass)
		lowPass.connect(gain)
		gain.connect(ctx.destination)

		source.start(time)
		source.stop(time + 0.25)
	}

	// Play a cinematic navigation sound
	const playNavigation = () => {
		if (!audioContextRef.current) return

		const ctx = audioContextRef.current
		const time = ctx.currentTime

		// Deep bass foundation
		const bass = ctx.createOscillator()
		const bassGain = ctx.createGain()

		bass.frequency.setValueAtTime(80, time)
		bass.frequency.exponentialRampToValueAtTime(120, time + 0.3)
		bass.type = 'sine'
		bass.connect(bassGain)

		// Cinematic chord - three tones
		const osc1 = ctx.createOscillator()
		const osc2 = ctx.createOscillator()
		const osc3 = ctx.createOscillator()
		const chordGain = ctx.createGain()

		osc1.frequency.setValueAtTime(523.25, time) // C5
		osc2.frequency.setValueAtTime(659.25, time) // E5
		osc3.frequency.setValueAtTime(783.99, time) // G5

		osc1.connect(chordGain)
		osc2.connect(chordGain)
		osc3.connect(chordGain)

		const masterGain = ctx.createGain()
		bassGain.connect(masterGain)
		chordGain.connect(masterGain)
		masterGain.connect(ctx.destination)

		// Envelopes
		bassGain.gain.setValueAtTime(0.3, time)
		bassGain.gain.exponentialRampToValueAtTime(0.05, time + 0.3)

		chordGain.gain.setValueAtTime(0.25, time)
		chordGain.gain.exponentialRampToValueAtTime(0.01, time + 0.3)

		bass.start(time)
		osc1.start(time)
		osc2.start(time)
		osc3.start(time)

		bass.stop(time + 0.3)
		osc1.stop(time + 0.3)
		osc2.stop(time + 0.3)
		osc3.stop(time + 0.3)
	}

	// Play a futuristic hover sound
	const playHover = () => {
		if (!audioContextRef.current) return

		const ctx = audioContextRef.current
		const time = ctx.currentTime

		// Laser-like sweep up
		const osc = ctx.createOscillator()
		const gain = ctx.createGain()

		osc.frequency.setValueAtTime(400, time)
		osc.frequency.exponentialRampToValueAtTime(1200, time + 0.12)
		osc.type = 'triangle'
		osc.connect(gain)

		gain.gain.setValueAtTime(0.15, time)
		gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12)
		gain.connect(ctx.destination)

		osc.start(time)
		osc.stop(time + 0.12)
	}

	return {
		playClick,
		playScroll,
		playNavigation,
		playHover,
	}
}
