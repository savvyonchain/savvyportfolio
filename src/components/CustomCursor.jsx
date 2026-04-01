'use client'

import { useEffect, useState, useRef } from 'react'

export function CustomCursor() {
	const [isPointing, setIsPointing] = useState(false)
	const cursorRef = useRef(null)
	const mouseXRef = useRef(0)
	const mouseYRef = useRef(0)
	const animationFrameRef = useRef(null)

	useEffect(() => {
		const handleMouseMove = (e) => {
			mouseXRef.current = e.clientX
			mouseYRef.current = e.clientY

			// Cancel previous frame
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}

			// Update cursor position via direct DOM manipulation for better performance
			animationFrameRef.current = requestAnimationFrame(() => {
				if (cursorRef.current) {
					cursorRef.current.style.left = `${mouseXRef.current}px`
					cursorRef.current.style.top = `${mouseYRef.current}px`
				}
			})
		}

		const handleMouseDown = () => {
			setIsPointing(true)
		}

		const handleMouseUp = () => {
			setIsPointing(false)
		}

		window.addEventListener('mousemove', handleMouseMove, { passive: true })
		window.addEventListener('mousedown', handleMouseDown)
		window.addEventListener('mouseup', handleMouseUp)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('mouseup', handleMouseUp)
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [])

	return (
		<>
			{/* Main Cursor */}
			<div
				ref={cursorRef}
				className={`pointer-events-none fixed z-[9999] ${
					isPointing ? 'scale-75' : 'scale-100'
				}`}
				style={{
					left: '0px',
					top: '0px',
					transform: `translate(-50%, -50%) ${isPointing ? 'scale(0.75)' : 'scale(1)'}`,
					transition: isPointing ? 'transform 0.15s ease-out' : 'none',
					willChange: 'transform',
				}}
			>
				{/* Outer Ring */}
				<div
					className='absolute w-8 h-8 rounded-full border-2 border-[var(--color-brand)]/80'
					style={{
						left: '-16px',
						top: '-16px',
						boxShadow: '0 0 15px rgba(108, 59, 137, 0.6)',
						animation: 'pulse 2s infinite',
						willChange: 'auto',
					}}
				/>

				{/* Middle Ring */}
				<div
					className='absolute w-6 h-6 rounded-full border border-[var(--color-brand-light)]/60'
					style={{
						left: '-12px',
						top: '-12px',
					}}
				/>

				{/* Inner Dot */}
				<div
					className='absolute w-2 h-2 rounded-full bg-[var(--color-brand-light)]'
					style={{
						left: '-4px',
						top: '-4px',
						boxShadow: '0 0 8px var(--color-brand-light)',
					}}
				/>

				{/* Crosshair */}
				<div
					className='absolute w-0.5 h-4 bg-[var(--color-brand)]/50'
					style={{
						left: '-1px',
						top: '-8px',
					}}
				/>
				<div
					className='absolute w-4 h-0.5 bg-[var(--color-brand)]/50'
					style={{
						left: '-8px',
						top: '-1px',
					}}
				/>
			</div>

			{/* Styles */}
			<style jsx global>{`
				@keyframes pulse {
					0%,
					100% {
						box-shadow: 0 0 15px rgba(108, 59, 137, 0.6),
							inset 0 0 15px rgba(108, 59, 137, 0.2);
					}
					50% {
						box-shadow: 0 0 25px rgba(108, 59, 137, 0.8),
							inset 0 0 25px rgba(108, 59, 137, 0.3);
					}
				}

				/* Hide default cursor */
				html {
					cursor: none;
				}

				body {
					cursor: none;
				}

				a,
				button,
				[role='button'] {
					cursor: none;
				}

				input,
				textarea,
				select {
					cursor: text;
				}
			`}</style>
		</>
	)
}
