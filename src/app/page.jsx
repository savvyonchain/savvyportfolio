'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import homepagePhoto from '@/assets/homepagephoto.jpg'
import { Zap, Bot, CheckCircle } from 'lucide-react'
import Projects from './projects/page'
import ServicesSection from '@/components/ServicesSection'
import ToolsCarousel from '@/components/ToolsCarousel'
import SkillsGrid from '@/components/SkillsGrid'
import ProcessSection from '@/components/ProcessSection'
import ExperienceSection from '@/components/ExperienceSection'
import TestimonialsSection from '@/components/TestimonialsSection'

export default function Home() {
	return (
		<div className='w-full min-w-0 overflow-x-hidden'>
			{/* 01. Hero Section */}
			<section className='min-h-[90vh] flex items-center justify-center overflow-x-hidden w-full relative pt-10 pb-20'>
				<div className='grid items-center grid-cols-1 gap-10 sm:gap-16 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl md:grid-cols-2'>
					{/* Left Content */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className='relative z-10 p-5 sm:p-8 md:p-14 rounded-[1.75rem] sm:rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-0'
					>
						<div className='absolute inset-0 rounded-[1.75rem] sm:rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none' />

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.6 }}
						>
							<span className='inline-block py-1 px-4 rounded-full bg-brand/30 border border-brand/50 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_var(--color-brand)]'>
								AVAILABLE FOR WORK
							</span>

							<h1
								className='text-[2.25rem] sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1] break-words'
								style={{ fontFamily: 'var(--font-space)' }}
							>
								Automation <br />
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand)] via-[#d484ff] to-[var(--color-secondary)] filter drop-shadow-[0_0_20px_rgba(108,59,137,0.8)]'>
									Architect.
								</span>
							</h1>

							<p
								className='max-w-md mb-10 text-lg font-light leading-relaxed text-gray-300'
								style={{ fontFamily: 'var(--font-inter)' }}
							>
								Hi I&apos;m Savvy. I build automation systems that save you
								time, reduce costs, and help your business grow effortlessly.
							</p>

							<div className='flex flex-wrap items-center gap-3 sm:gap-5'>
								<Link
									href='/contact'
									className='group relative px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-widest font-bold rounded-full bg-white text-gray-900 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_0_40px_rgba(108,59,137,0.6)] transition-all duration-300'
								>
									Book an Audit
								</Link>
								<Link
									href='/projects'
									className='px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-widest text-white uppercase transition-all border rounded-full bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 backdrop-blur-md hover:scale-105'
								>
									Portfolio
								</Link>
							</div>
						</motion.div>
					</motion.div>

					{/* Right Image area with 3D float */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
						className='relative flex items-center justify-center p-2 sm:p-4 min-w-0 max-w-full'
					>
						<motion.div
							animate={{ y: [-15, 15, -15] }}
							transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
							className='relative w-full max-w-[260px] sm:max-w-[320px] mx-auto md:ml-auto aspect-square'
						>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
								className='absolute inset-[-10%] rounded-full border border-[var(--color-brand)] shadow-[0_0_60px_rgba(108,59,137,0.5)] pointer-events-none opacity-40'
								style={{
									borderTopColor: 'transparent',
									borderBottomColor: 'transparent',
								}}
							/>
							<div className='relative w-full h-full p-2 rounded-full overflow-hidden bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'>
								<div className='relative w-full h-full overflow-hidden rounded-full'>
									<Image
										src={homepagePhoto}
										alt='Savvy'
										className='object-cover object-top w-full h-full hover:scale-[1.02] transition-transform duration-[1.5s] ease-out mix-blend-luminosity hover:mix-blend-normal'
										priority
									/>
								</div>
							</div>

							<motion.div
								animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: 1,
								}}
								className='absolute top-[10%] left-0 sm:-left-[6%] md:-left-[10%] p-2.5 sm:p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center text-white'
							>
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 10,
										repeat: Infinity,
										ease: 'linear',
									}}
								>
									<Zap
										className='w-6 h-6 sm:w-8 sm:h-8 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'
									/>
								</motion.div>
							</motion.div>
							<motion.div
								animate={{ y: [5, -5, 5], rotate: [5, -5, 5] }}
								transition={{
									duration: 5,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: 2,
								}}
								className='absolute bottom-[10%] right-0 sm:-right-[4%] md:-right-[5%] p-2.5 sm:p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center text-white'
							>
								<Bot
									className='w-6 h-6 sm:w-8 sm:h-8 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'
								/>
							</motion.div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* 02. Professional Summary (Introduction) */}
			<section className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32 relative'>
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-[var(--color-brand)]/5 blur-[120px] -z-10 rounded-full animate-pulse' />

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='max-w-5xl mx-auto'
				>
					<div className='relative w-full bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 p-6 sm:p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden group min-w-0'>
						<div className='absolute top-0 right-0 p-12 opacity-5'>
							<Zap size={140} className='text-white' />
						</div>

						<div className='flex items-center gap-4 mb-10'>
							<div className='w-12 h-1.5 rounded-full bg-[var(--color-brand)]' />
							<h2
								className='text-2xl md:text-3xl font-bold text-white tracking-tight'
								style={{ fontFamily: 'var(--font-inter)' }}
							>
								Professional Summary
							</h2>
						</div>

						<div className='space-y-8 relative z-10'>
							<p className='text-gray-300 text-lg md:text-2xl font-light leading-relaxed text-left'>
								AI Automation Specialist with{' '}
								<span className='text-white font-bold'>
									4+ years of experience
								</span>{' '}
								building intelligent workflows and automation systems that drive
								operational efficiency.
							</p>
							<p className='text-gray-400 text-base md:text-lg font-light leading-relaxed text-left'>
								Expertise in designing and deploying AI-powered solutions using
								no/low code tools to automate complex business processes. Proven
								track record of reducing manual workload by{' '}
								<span className='text-[var(--color-brand-light)] font-bold'>
									15-20 hours weekly
								</span>{' '}
								while eliminating operational costs through smart automation and
								self-hosted solutions.
							</p>
						</div>

						<div className='mt-12 pt-10 border-t border-white/5 flex gap-10 text-left'>
							<div>
								<p className='text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2'>
									Current Availability
								</p>
								<p className='text-white text-sm font-bold flex items-center gap-2'>
									<span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
									Remote / Worldwide
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</section>

			{/* 03. Featured Solutions (The Evidence) */}
			<div className='w-full bg-black/40 relative overflow-hidden py-16 sm:py-24 md:py-32'>
				{/* Background ambient light */}
				<div className='absolute top-0 right-0 w-[40vw] h-[40vw] bg-[var(--color-brand)]/5 blur-[150px] rounded-full -z-10' />
				<div className='absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-[var(--color-secondary)]/5 blur-[120px] rounded-full -z-10' />
				<Projects />
			</div>

			{/* 04. Services (The Offer) */}
			<section className='py-16 sm:py-24 md:py-32 bg-white/[0.01]'>
				<ServicesSection />
			</section>

			{/* 05. The Arsenal (The Capabilities) */}
			<section className='py-16 sm:py-24 md:py-32 space-y-16 sm:space-y-24 md:space-y-32'>
				<ToolsCarousel />
				<SkillsGrid />
			</section>

			{/* 06. Experience (The Authority) */}
			<section className='py-16 sm:py-24 md:py-32'>
				<ExperienceSection />
			</section>

			{/* 07. My Process (The Methodology) */}
			<section className='py-16 sm:py-24 md:py-32 bg-white/[0.01]'>
				<ProcessSection />
			</section>

			{/* 08. Testimonials (The Social Proof) */}
			<section className='py-16 sm:py-24 md:py-32'>
				<TestimonialsSection />
			</section>

			{/* 09. Final CTA (The Conversion) */}
			<section className='max-w-5xl px-4 sm:px-6 md:px-8 py-24 sm:py-32 mx-auto text-center'>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					className='bg-gradient-to-br from-white/10 to-transparent p-8 sm:p-12 md:p-24 rounded-[2rem] sm:rounded-[3rem] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden min-w-0'
				>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#9f66c2]/20 blur-[100px] -z-10' />
					<h2
						className='mb-6 text-2xl sm:text-4xl font-extrabold text-white md:text-6xl break-words px-1'
						style={{ fontFamily: 'var(--font-space)' }}
					>
						Let&apos;s Build Your Brain.
					</h2>
					<p className='max-w-2xl mx-auto mb-12 text-base sm:text-lg font-light text-gray-300 md:text-xl leading-relaxed px-1'>
						Start your journey toward zero-touch operations. Book your free
						blueprint audit today.
					</p>
					<Link
						href='/contact'
						className='inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-6 max-w-full bg-white text-gray-900 font-extrabold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all uppercase tracking-widest text-xs sm:text-sm'
					>
						Book an Audit <CheckCircle size={20} />
					</Link>
				</motion.div>
			</section>
		</div>
	)
}
