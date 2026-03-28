'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestimonialsSection() {
	const [testimonials, setTestimonials] = useState([])

	useEffect(() => {
		const fetchTestimonials = async () => {
			const { data } = await supabase.from('testimonials').select('*').order('order_index')
			setTestimonials(data || [])
		}
		fetchTestimonials()
	}, [])

	if (testimonials.length === 0) return null

	return (
		<section className='w-full py-20 bg-white/[0.02] border-t border-white/5 relative overflow-hidden'>
			{/* Subtle grid background similar to sample */}
			<div className='absolute inset-0 opacity-[0.03] pointer-events-none' 
				style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
			/>

			<div className='max-w-7xl mx-auto px-8 relative z-10'>
				<div className='text-center mb-20'>
					<div className='inline-flex items-center gap-4 mb-6'>
						<div className='w-8 h-1 rounded-full bg-yellow-400' />
						<h2
							className='text-3xl md:text-6xl font-black text-white'
							style={{ fontFamily: 'var(--font-space)' }}
						>
							What our Clients are <span className='text-yellow-400'>Saying</span>
						</h2>
					</div>
					<p className='text-gray-400 font-light max-w-2xl mx-auto text-lg leading-relaxed'>
						Discover real stories from clients who&apos;ve unlocked growth, efficiency, and success with our solutions.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
					{testimonials.map((ts, i) => (
						<motion.div
							key={ts.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1 }}
							className='p-10 rounded-[2.5rem] bg-[#15111a]/60 backdrop-blur-2xl border border-white/10 flex flex-col items-center text-center group hover:bg-[#1a1521]/80 transition-all'
						>
							{/* Circular Profile Image */}
							<div className='w-24 h-24 rounded-full overflow-hidden border-4 border-white/5 mb-8 shadow-2xl group-hover:scale-105 transition-transform duration-500'>
								{ts.image_url ? (
									<img src={ts.image_url} alt={ts.name} className='w-full h-full object-cover' />
								) : (
									<div className='w-full h-full bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-2xl'>
										{ts.name.charAt(0)}
									</div>
								)}
							</div>

							<h4 className='text-white font-black text-xl mb-1 tracking-tight group-hover:text-yellow-400 transition-colors'>{ts.name}</h4>
							<p className='text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-8'>{ts.role}</p>

							<p className='text-gray-400 font-light leading-relaxed mb-10 text-sm'>
								{ts.quote}
							</p>

							{/* Dynamic Star Rating */}
							<div className='flex gap-1 mt-auto'>
								{[...Array(5)].map((_, index) => (
									<span 
										key={index} 
										className={`text-lg ${index < (ts.rating || 5) ? 'text-yellow-400' : 'text-gray-700'}`}
									>
										★
									</span>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
