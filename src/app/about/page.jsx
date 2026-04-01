'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import homepagePhoto from '@/assets/homepagephoto.jpg'
import { Zap, CheckCircle } from 'lucide-react'
import SkillsGrid from '@/components/SkillsGrid'
import ToolsCarousel from '@/components/ToolsCarousel'
import ServicesSection from '@/components/ServicesSection'
import ProcessSection from '@/components/ProcessSection'
import ExperienceSection from '@/components/ExperienceSection'
import TestimonialsSection from '@/components/TestimonialsSection'

export default function About() {
	return (
		<div className='relative w-full pb-20 overflow-x-hidden sm:pb-32'>
			{/* ✦ Professional Intro Grid */}
			<section className='relative px-4 pt-4 pb-10 mx-auto max-w-7xl sm:px-6 md:px-8 lg:pt-8'>
				{/* Background Glows for Depth */}
				<div className='absolute top-0 left-1/4 w-[30vw] h-[30vw] bg-[var(--color-brand)]/10 blur-[150px] -z-10 rounded-full' />
				<div className='absolute bottom-0 right-1/4 w-[20vw] h-[20vw] bg-[var(--color-secondary)]/10 blur-[120px] -z-10 rounded-full' />

				<div className='grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-12 lg:gap-16 items-start'>
					{/* Left: Identity Section */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className='flex flex-col items-center pt-6 text-center lg:items-start lg:text-left'
					>
						<div className='relative mb-10'>
							{/* Simplified but premium photo frame */}
							<div className='relative w-64 h-80 md:w-80 md:h-[30rem] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl p-1 bg-white/5 backdrop-blur-3xl'>
								<div className='w-full h-full rounded-[2.8rem] overflow-hidden relative'>
									<Image
										src={homepagePhoto}
										alt='Savvy'
										className='object-cover object-[center_20%] w-full h-full grayscale hover:grayscale-0 transition-all duration-700'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-[#0A0612] via-transparent to-transparent opacity-60' />
								</div>
							</div>

							{/* Floating badge to match site style */}
							<div className='absolute -bottom-6 -right-6 px-6 py-3 rounded-2xl bg-[var(--color-brand)] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl border border-white/20'>
								Founder
							</div>
						</div>

						<h1
							className='text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]'
							style={{ fontFamily: 'var(--font-space)' }}
						>
							<span className='block mb-2 text-white'>Automation</span>
							<span className='text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand)] via-[#d484ff] to-[var(--color-secondary)]'>
								Architect.
							</span>
						</h1>
					</motion.div>

					{/* Right: Summary Card (Redesigned for Site UX) */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className='lg:pt-12'
					>
						<div className='relative w-full bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 p-6 sm:p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden group min-w-0'>
							<div className='absolute top-0 right-0 p-12 opacity-5'>
								<Zap size={140} className='text-white' />
							</div>

							<div className='flex items-center gap-4 mb-10'>
								<div className='w-12 h-1.5 rounded-full bg-[var(--color-brand)]' />
								<h2
									className='text-2xl font-bold tracking-tight text-white md:text-3xl'
									style={{ fontFamily: 'var(--font-inter)' }}
								>
									Professional Summary
								</h2>
							</div>

							<div className='relative z-10 space-y-8'>
								<p className='text-lg font-light leading-relaxed text-left text-gray-300 md:text-2xl'>
									AI Automation Architect{' '}
									<span className='font-bold text-white'>
										4+ years of experience
									</span>{' '}
									saving businesses time and increansing efficiency through
									intelligent automation.
								</p>
								<p className='text-base font-light leading-relaxed text-left text-gray-400 md:text-lg'>
									Skilled in leveraging no-code and low-code platforms to design
									scalable, maintainable solutions that integrate seamlessly
									with existing workflows.{' '}
									<span className='text-[var(--color-brand-light)] font-bold'>
										15-20 hours weekly
									</span>{' '}
									while eliminating operational costs through smart automation
									and self-hosted solutions.
								</p>
							</div>

							<div className='flex gap-10 pt-10 mt-12 text-left border-t border-white/5'>
								<div>
									<p className='text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2'>
										Current Availability
									</p>
									<p className='flex items-center gap-2 text-sm font-bold text-white'>
										<span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
										Remote / Worldwide
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* ⬡ Dynamic Arsenal & Aptitudes */}
			<ToolsCarousel />
			<SkillsGrid />

			{/* ◈ Dynamic Services */}
			<ServicesSection />

			{/* ↻ My Process (Dynamic) */}
			<ProcessSection />

			{/* 💼 Experience (Dynamic - only if data exists) */}
			<ExperienceSection />

			{/* ❝ Testimonials (Dynamic - only if data exists) */}
			<TestimonialsSection />

			{/* → Contact CTA */}
			<section className='max-w-4xl px-4 py-12 mx-auto text-center sm:px-6 md:px-8 sm:py-20'>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					className='bg-gradient-to-br from-white/10 to-transparent p-8 sm:p-12 md:p-20 rounded-[2rem] sm:rounded-[3rem] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden min-w-0'
				>
					{/* Inner glow */}
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#9f66c2]/20 blur-[100px] -z-10' />
					<h2
						className='mb-6 text-4xl font-extrabold text-white md:text-6xl'
						style={{ fontFamily: 'var(--font-space)' }}
					>
						Ready to Automate?
					</h2>
					<p className='max-w-2xl mx-auto mb-12 text-lg font-light leading-relaxed text-gray-300 md:text-xl'>
						Stop wasting time on redundant tasks. Let&apos;s build an autonomous
						workflow that liberates your business operations.
					</p>
					<Link
						href='/contact'
						className='inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 font-extrabold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all uppercase tracking-widest text-sm text-[var(--font-inter)]'
					>
						<CheckCircle size={20} /> Let&apos;s Build Together
					</Link>
				</motion.div>
			</section>
		</div>
	)
}
