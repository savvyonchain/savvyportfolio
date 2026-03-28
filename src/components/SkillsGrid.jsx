'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SkillsGrid() {
	const [skills, setSkills] = useState([])

	useEffect(() => {
		const fetchSkills = async () => {
			const { data } = await supabase.from('skills').select('*').order('order_index')
			setSkills(data || [])
		}
		fetchSkills()
	}, [])

	if (skills.length === 0) return null

	return (
		<section className='w-full pt-10 pb-20 bg-black/40'>
			<div className='max-w-7xl mx-auto px-8'>
				<div className='text-center mb-16'>
					<h2 className='text-4xl md:text-5xl font-extrabold text-white mb-4' style={{ fontFamily: 'var(--font-space)' }}>
						My <span className='text-[var(--color-secondary)]'>Skills</span>
					</h2>
					<p className='text-gray-400 font-light max-w-2xl mx-auto italic'>
						&quot;The master has failed more times than the beginner has even tried.&quot;
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{skills.map((skill, i) => (
						<motion.div
							key={skill.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1 }}
							whileHover={{ scale: 1.02 }}
							className='p-8 rounded-[2rem] bg-[#111111]/80 backdrop-blur-xl border border-white/5 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
						>
							{/* Accent bar on left as seen in myskills.png */}
							<div 
								className='absolute left-0 top-0 bottom-0 w-2 h-full'
								style={{ backgroundColor: skill.accent_color || '#9f66c2' }}
							/>

							<div className='flex items-start justify-between mb-8'>
								<h3 className='text-3xl font-extrabold text-white tracking-tight leading-none'>
									{skill.name}
								</h3>
								<span className='text-xs font-bold text-gray-500 uppercase tracking-widest'>
									{skill.hex_code}
								</span>
							</div>

							<p className='text-gray-400 font-light leading-relaxed mb-6'>
								{skill.description || "Mastery in specialized process automation."}
							</p>

							{/* Glow effect on hover */}
							<div 
								className='absolute -bottom-10 -right-10 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity'
								style={{ backgroundColor: skill.accent_color || '#9f66c2' }}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
