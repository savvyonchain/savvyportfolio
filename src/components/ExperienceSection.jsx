'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ExperienceSection() {
	const [experience, setExperience] = useState([])

	useEffect(() => {
		const fetchExperience = async () => {
			const { data } = await supabase.from('experience').select('*').order('order_index')
			setExperience(data || [])
		}
		fetchExperience()
	}, [])

	if (experience.length === 0) return null

	return (
		<section className='max-w-4xl mx-auto px-8 py-20'>
			<div className='flex items-center gap-4 mb-16'>
				<div className='w-12 h-1.5 rounded-full bg-[var(--color-brand)]' />
				<h2 className='text-3xl md:text-4xl font-black text-white' style={{ fontFamily: 'var(--font-space)' }}>
					Experience
				</h2>
			</div>
			
			<div className='space-y-12'>
				{experience.map((ex, i) => (
					<motion.div
						key={ex.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: i * 0.1 }}
						className='relative pl-8 border-l border-white/10 group'
					>
						<div className='absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-[var(--color-brand)] group-hover:scale-150 transition-all shadow-[0_0_10px_var(--color-brand)]' />
						<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4'>
							<div>
								<h3 className='text-xl font-bold text-white'>{ex.company}</h3>
								<p className='text-[var(--color-brand-light)] font-medium'>{ex.role}</p>
							</div>
							<span className='text-sm text-gray-500 font-mono'>{ex.period}</span>
						</div>
						<p className='text-gray-400 font-light leading-relaxed max-w-2xl'>
							{ex.description}
						</p>
					</motion.div>
				))}
			</div>
		</section>
	)
}
