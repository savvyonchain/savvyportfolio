'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Zap } from 'lucide-react'

export default function ToolsCarousel() {
	const [tools, setTools] = useState([])
	const [rotation, setRotation] = useState(0)

	useEffect(() => {
		const fetchTools = async () => {
			const { data } = await supabase.from('tools').select('*').order('order_index')
			setTools(data || [])
		}
		fetchTools()
	}, [])

	useAnimationFrame((t) => {
		setRotation(t * 0.02) // Control speed
	})

	if (tools.length === 0) return null

	return (
		<section className='w-full pt-20 pb-0 overflow-hidden bg-black/40 relative'>
			{/* Background ambient light */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-brand)]/5 blur-[120px] rounded-full -z-10' />

			<div className='max-w-7xl mx-auto px-8 mb-24 text-center'>
				<h2 className='text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter' style={{ fontFamily: 'var(--font-space)' }}>
					Tools
				</h2>
				<p className='text-gray-500 font-light text-lg tracking-widest uppercase'>The engines behind the automation</p>
			</div>

			<div className='relative h-[500px] w-full flex items-center justify-center perspective-[2000px] preserve-3d'>
				<div 
					className='relative w-64 h-80 preserve-3d'
					style={{ 
						transform: `rotateY(${rotation}deg)`,
						transition: 'transform 0.1s linear'
					}}
				>
					{tools.map((tool, i) => {
						const angle = (i / tools.length) * 360
						const radius = 400 // Distance from center
						
						return (
							<motion.div
								key={tool.id}
								className='absolute inset-0 w-64 h-80 rounded-[2.5rem] bg-[#111111]/90 backdrop-blur-2xl border border-white/10 p-8 flex flex-col items-center justify-center gap-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] backface-hidden group hover:border-[var(--color-brand)]/50 transition-colors'
								style={{
									transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
								}}
							>
								{/* Reflection effect at bottom */}
								<div className='absolute -bottom-40 left-0 right-0 h-40 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-20 pointer-events-none transform -scale-y-100 blur-sm' />

								<div className='w-28 h-28 relative z-10 p-4 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-all'>
									{tool.image_url ? (
										<img 
											src={tool.image_url} 
											alt={tool.name} 
											className='w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
										/>
									) : (
										<Zap size={64} className='text-[var(--color-brand-light)] w-full h-full' />
									)}
								</div>
								
								<div className='text-center relative z-10'>
									<h3 className='text-xl font-black text-white tracking-widest uppercase mb-1'>
										{tool.name}
									</h3>
									<div className='w-10 h-1 bg-[var(--color-brand)] mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-all' />
								</div>

								{/* Inner Glow */}
								<div className='absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]' />
							</motion.div>
						)
					})}
				</div>
			</div>

			<style jsx>{`
				.preserve-3d {
					transform-style: preserve-3d;
				}
				.perspective-2000 {
					perspective: 2000px;
				}
				.backface-hidden {
					backface-visibility: hidden;
				}
			`}</style>
		</section>
	)
}
