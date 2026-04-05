'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, ArrowDown } from 'lucide-react'
import Link from 'next/link'

// Distinctive color palettes for the node number badges to simulate the "Platform" look
const badgeColors = [
	'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
	'bg-blue-500/10 text-blue-500 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
	'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
	'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
	'bg-purple-500/10 text-purple-500 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
	'bg-pink-500/10 text-pink-500 border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
]

export default function ProcessSection() {
	const [steps, setSteps] = useState([])

	useEffect(() => {
		const fetchSteps = async () => {
			const { data } = await supabase
				.from('process_steps')
				.select('*')
				.order('order_index')
			// Sort by step_number so 01 always comes before 02, etc.
			setSteps(
				(data || []).sort(
					(a, b) => Number(a.step_number) - Number(b.step_number),
				),
			)
		}
		fetchSteps()
	}, [])

	if (steps.length === 0) return null

	return (
		<section className='w-full min-h-[60vh] bg-[#050308] relative overflow-hidden flex flex-col justify-center py-12 lg:py-20'>
			{/* Brand Glow Auras */}
			<div className='absolute top-0 right-0 w-[50%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e1b4b]/60 via-[#050308]/50 to-transparent blur-[120px] pointer-events-none z-0' />
			<div className='absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#050308]/50 to-transparent blur-[100px] pointer-events-none z-0' />

			{/* Section Title */}
			<div className='text-center w-full relative z-20 mb-8 md:mb-12 mt-10'>
				<h2
					className='text-3xl sm:text-4xl md:text-5xl font-black text-white'
					style={{ fontFamily: 'var(--font-space)' }}
				>
					My <span className='text-[var(--color-brand-light)]'>Process</span>
				</h2>
			</div>

			{/* =========================================
			    DESKTOP: SVG RADIAL TREE MIND-MAP
			    ========================================= */}
			<div className='hidden md:block relative w-full max-w-5xl mx-auto h-[450px] lg:h-[550px] z-10'>
				{/* 1. Underlying SVG Connector Grid mapped securely inside a CSS Grid container limits */}
				<svg
					viewBox='0 0 1000 1000'
					preserveAspectRatio='none'
					className='absolute inset-0 w-full h-full pointer-events-none z-0'
				>
					<defs>
						<linearGradient id='pathGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
							<stop offset='0%' stopColor='rgba(168, 85, 247, 0.4)' />{' '}
							{/* Purple */}
							<stop offset='50%' stopColor='rgba(56, 189, 248, 0.6)' />{' '}
							{/* Sky */}
							<stop offset='100%' stopColor='rgba(52, 211, 153, 1)' />{' '}
							{/* Emerald Base */}
						</linearGradient>
					</defs>

					{steps.map((_, i) => {
						const L = steps.length || 1
						// Constrain vertical heights between 10% and 90%
						const offsetPercentage = L > 1 ? (i / (L - 1)) * 80 + 10 : 50

						// The path coords map intimately to the DOM absolute left/right percentage caps
						const y1 = offsetPercentage * 10
						const x1 = 300 // Leaves exactly at Right Edge of 25% w-box starting at 5% left

						const y2 = 500 // Center outcome target height
						const x2 = 700 // Strikes exactly at Left Edge of 25% w-box ending at 5% right

						// Cubic Bezier curve control points
						const cx1 = x1 + 250
						const cx2 = x2 - 250 // Creating a sweeping S-Curve radial drop

						return (
							<g key={`svg-path-${i}`}>
								<motion.path
									initial={{ pathLength: 0, opacity: 0 }}
									whileInView={{ pathLength: 1, opacity: 1 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{
										duration: 1.5,
										delay: i * 0.15,
										ease: 'easeInOut',
									}}
									d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`}
									fill='none'
									stroke='url(#pathGradient)'
									strokeWidth='2.5'
									vectorEffect='non-scaling-stroke'
								/>
								<motion.circle
									initial={{ scale: 0, opacity: 0 }}
									whileInView={{ scale: 1, opacity: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
									cx={x1}
									cy={y1}
									r='4.5'
									fill='#a855f7'
									filter='drop-shadow(0 0 6px #a855f7)'
									vectorEffect='non-scaling-stroke'
								/>
							</g>
						)
					})}
					{/* Convergence Origin Dot */}
					<motion.circle
						initial={{ scale: 0, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 2, duration: 0.5 }}
						cx={700}
						cy={500}
						r='7'
						fill='#34d399'
						filter='drop-shadow(0 0 10px #34d399)'
						vectorEffect='non-scaling-stroke'
					/>
				</svg>

				{/* 2. Left Source Nodes */}
				{steps.map((prc, i) => {
					const L = steps.length || 1
					const offsetPercentage = L > 1 ? (i / (L - 1)) * 80 + 10 : 50
					const colorClass = badgeColors[i % badgeColors.length]

					return (
						<motion.div
							key={`step-${i}-desktop`}
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.6 }}
							className='absolute w-[25%] left-[5%] -translate-y-1/2 flex justify-end z-10'
							style={{ top: `${offsetPercentage}%` }}
						>
							<div className='flex items-center gap-3 bg-[#0a0614] border border-white/5 rounded-full pl-2 pr-6 py-2 shadow-[0_0_20px_rgba(168,85,247,0.05)] hover:bg-[#0f091a] hover:border-purple-500/20 transition-colors w-auto max-w-full'>
								<div
									className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs ${colorClass}`}
								>
									{i + 1}
								</div>

								<span className='text-gray-200 font-semibold tracking-wide text-xs lg:text-sm whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-md'>
									{prc.title}
								</span>
							</div>
						</motion.div>
					)
				})}

				{/* 3. Right Convergence Target (Outcome) */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 1, duration: 0.8 }}
					className='absolute w-[25%] right-[5%] top-[50%] -translate-y-1/2 flex items-center z-10'
				>
					<div className='flex flex-col items-start min-w-[200px]'>
						<div className='flex items-center gap-4 lg:gap-6 group'>
							<div className='text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-tighter uppercase relative drop-shadow-xl select-none'>
								Efficiency
								<div className='absolute -bottom-1 lg:-bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-500' />
							</div>

							<Link
								href='/contact'
								className='cursor-pointer shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all shadow-[0_0_15px_rgba(52,211,153,0.1)]'
							>
								<ArrowRight className='w-5 h-5 lg:w-6 lg:h-6' strokeWidth={3} />
							</Link>
						</div>
					</div>
				</motion.div>
			</div>

			{/* =========================================
			    MOBILE: VERTICAL CASCADING OUTCOME TIMELINE
			    ========================================= */}
			<div className='flex md:hidden flex-col items-center w-full relative z-10 px-6 py-10'>
				{/* Top Nodes cascade down into lines */}
				{steps.map((prc, i) => {
					const colorClass = badgeColors[i % badgeColors.length]
					return (
						<motion.div
							key={`step-${i}-mobile`}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.5 }}
							className='w-full flex flex-col items-center'
						>
							<div className='bg-[#0a0614] border border-white/5 shadow-md shadow-purple-500/5 rounded-full px-5 py-3 w-full max-w-[280px] flex items-center gap-4'>
								<div
									className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs ${colorClass}`}
								>
									{i + 1}
								</div>
								<span className='text-gray-200 font-bold text-sm leading-tight text-balance'>
									{prc.title}
								</span>
							</div>

							{/* Drop connector for all components hitting outcome */}
							<div className='h-10 w-[2px] bg-gradient-to-b from-purple-500/50 to-sky-400/50 my-2 shadow-[0_0_10px_rgba(168,85,247,0.3)]' />
						</motion.div>
					)
				})}

				{/* Convergence Target Mobile */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.5, duration: 0.6 }}
					className='mt-4 flex flex-col items-center bg-[#0a0614] border border-emerald-500/20 px-8 py-6 rounded-[2rem] shadow-[0_0_30px_rgba(52,211,153,0.1)] relative overflow-hidden'
				>
					<div className='absolute inset-0 bg-emerald-500/5' />
					<Link
						href='/contact'
						className='hover:scale-125 transition-transform duration-300'
					>
						<ArrowDown
							className='text-emerald-400 mb-4 animate-bounce relative z-10'
							strokeWidth={3}
						/>
					</Link>
					<div className='text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 uppercase tracking-widest relative z-10'>
						Efficiency
					</div>
				</motion.div>
			</div>
		</section>
	)
}
