'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProcessSection() {
	const [steps, setSteps] = useState([])

	useEffect(() => {
		const fetchSteps = async () => {
			const { data } = await supabase.from('process_steps').select('*').order('order_index')
			setSteps(data || [])
		}
		fetchSteps()
	}, [])

	if (steps.length === 0) return null

	return (
		<section className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20 relative'>
			{/* Ambient Section Glow */}
			<div className='absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-brand)]/10 blur-[120px] rounded-full -z-10 animate-pulse' />

			<div className='rounded-[2rem] sm:rounded-[3.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative group min-w-0'>
				{/* Top/Left Side: Integrated Visual */}
				<div className='lg:w-1/3 relative min-h-[400px] lg:min-h-full overflow-hidden bg-[#050308] border-r border-white/5'>
					<img 
						src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2070&auto=format&fit=crop" 
						alt="Automation Process" 
						className='absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000'
					/>
					<div className='absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#050308]/60 to-[#0A0612]' />
					
					<div className='absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 text-center'>
						<div className='w-16 h-1 rounded-full bg-[var(--color-brand)] mb-8 shadow-[0_0_20px_var(--color-brand)]' />
						<h2 className='text-3xl sm:text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase mb-2 break-words max-w-full px-2' style={{ fontFamily: 'var(--font-space)' }}>
							My <br /><span className='text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand)] to-[#d484ff] font-black'>Process</span>
						</h2>
						<p className='text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-4'>Automation Architect</p>
					</div>
				</div>

				{/* Right Side: Steps */}
				<div className='lg:w-2/3 p-6 sm:p-10 lg:p-20 relative bg-gradient-to-br from-white/[0.02] to-transparent min-w-0'>
					<div className='space-y-4'>
						{steps.map((prc, i) => (
							<motion.div
								key={prc.id}
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1, duration: 0.6 }}
								whileHover={{ x: 10 }}
								className={`group relative py-8 px-6 rounded-[2rem] hover:bg-white/[0.03] transition-all duration-500 ${i !== steps.length - 1 ? 'border-b border-white/5' : ''}`}
							>
								<div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 lg:gap-10'>
									<div className='relative flex items-center justify-center sm:justify-start shrink-0'>
										<span className='text-4xl sm:text-5xl font-black text-white/5 group-hover:text-[var(--color-brand)]/30 transition-colors duration-500 select-none' style={{ fontFamily: 'var(--font-space)' }}>
											{prc.step_number}
										</span>
									</div>
									<div className='grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-8 w-full min-w-0 items-start md:items-center'>
										<h3 className='col-span-2 text-xl sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-[var(--color-brand-light)] transition-colors duration-500 break-words'>
											{prc.title}
										</h3>
										<p className='col-span-3 text-gray-400 font-light text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-500'>
											{prc.description}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					<div className='mt-16 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-12 gap-10'>
						<div className='flex items-center gap-4'>
							<div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
							<p className='text-gray-500 text-xs font-bold uppercase tracking-widest'>
								Transform your <br /><span className='text-gray-400'>operations today.</span>
							</p>
						</div>
						<button 
							onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
							className='group relative w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-[var(--color-brand)] text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(108,59,137,0.4)] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] text-center'
						>
							<span className='relative z-10'>Start Collaboration</span>
							<div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
