'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ServicesSection() {
	const [services, setServices] = useState([])

	useEffect(() => {
		const fetchServices = async () => {
			const { data } = await supabase.from('services').select('*').order('order_index')
			setServices(data || [])
		}
		fetchServices()
	}, [])

	if (services.length === 0) return null

	return (
		<section className='w-full py-20 bg-black/40 relative overflow-hidden'>
			{/* Ambient Glows for Section Depth */}
			<div className='absolute top-0 right-0 w-[40vw] h-[40vw] bg-[var(--color-brand)]/5 blur-[150px] rounded-full -z-10' />
			<div className='absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-[var(--color-secondary)]/5 blur-[120px] rounded-full -z-10' />

			<div className='max-w-7xl mx-auto px-8'>
				<div className='flex items-center gap-4 mb-20'>
					<div className='w-12 h-1.5 rounded-full bg-[var(--color-brand)]' />
					<h2
						className='text-3xl md:text-5xl font-black text-white'
						style={{ fontFamily: 'var(--font-space)' }}
					>
						My <span className='text-[var(--color-brand-light)]'>Services</span>
					</h2>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{services.map((service, i) => (
						<motion.div
							key={service.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.6 }}
							whileHover={{ y: -10 }}
							className='p-12 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 flex flex-col items-start shadow-2xl relative group overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-[var(--color-brand)]/50'
						>
							{/* Soft internal card glow on hover */}
							<div className='absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-brand)]/10 blur-[60px] rounded-full group-hover:opacity-100 opacity-0 transition-opacity' />

							<div className='relative z-10 w-full flex-1'>
								<h3 className='text-3xl font-black text-white mb-6 leading-[1.1] tracking-tight group-hover:text-gradient transition-all duration-500'>
									{service.title}
								</h3>
								<p className='text-gray-400 font-light text-lg leading-relaxed mb-10'>
									{service.description}
								</p>
							</div>

							<div className='relative z-10 w-full flex flex-wrap gap-2'>
								{(service.tags || []).map((tag, j) => (
									<div 
										key={j} 
										className='py-2 px-5 text-[10px] font-black uppercase tracking-widest bg-white/[0.05] text-gray-400 border border-white/10 rounded-full group-hover:border-[var(--color-brand)]/30 group-hover:text-white transition-all'
									>
										{tag}
									</div>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
