'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
	Database,
	Zap,
	Globe,
	Cpu,
	Bot,
	ChevronLeft,
	ChevronRight,
	X,
	Loader2,
	RefreshCw,
	Workflow,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Projects() {
	const [activeIndex, setActiveIndex] = useState(0)
	const [selectedProject, setSelectedProject] = useState(null)
	const [projects, setProjects] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		fetchProjects()
	}, [])

	// Lock body scroll when modal is open
	useEffect(() => {
		if (selectedProject) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [selectedProject])

	const fetchProjects = async () => {
		try {
			setLoading(true)
			const { data, error } = await supabase
				.from('projects')
				.select('*')
				.order('order_index', { ascending: true })

			if (error) throw error

			if (data && data.length > 0) {
				setProjects(data)
				// Center the middle one usually
				setActiveIndex(Math.floor(data.length / 2))
			} else {
				// Fallback or empty state
				setProjects([])
			}
		} catch (err) {
			console.error('Error fetching projects:', err)
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	const handleNext = () => {
		if (activeIndex < projects.length - 1) setActiveIndex(activeIndex + 1)
	}

	const handlePrev = () => {
		if (activeIndex > 0) setActiveIndex(activeIndex - 1)
	}

	const renderBulletList = (text) => {
		if (!text) return null
		const lines = text.split('\n').filter((line) => line.trim().length > 0)
		if (lines.length <= 1)
			return <p className='font-light leading-relaxed text-gray-300'>{text}</p>

		return (
			<ul className='space-y-4'>
				{lines.map((line, idx) => (
					<li
						key={idx}
						className='flex gap-4 text-gray-300 font-light leading-relaxed'
					>
						<span className='text-[var(--color-brand-light)] font-bold mt-1.5 flex-shrink-0'>
							✦
						</span>
						<span>{line.trim()}</span>
					</li>
				))}
			</ul>
		)
	}

	const getIcon = (iconName) => {
		const props = {
			size: 100,
			className: 'text-white opacity-90 drop-shadow-2xl',
			strokeWidth: 1.5,
		}
		switch (iconName?.toLowerCase()) {
			case 'zap':
				return <Zap {...props} />
			case 'database':
				return <Database {...props} />
			case 'globe':
				return <Globe {...props} />
			case 'cpu':
				return <Cpu {...props} />
			case 'bot':
				return <Bot {...props} />
			default:
				return <Workflow {...props} />
		}
	}

	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh]'>
				<Loader2 className='w-12 h-12 text-[var(--color-brand)] animate-spin mb-4' />
				<p className='text-gray-400 font-light tracking-widest uppercase text-sm'>
					Loading Portfolio...
				</p>
			</div>
		)
	}

	if (error || projects.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] px-8 text-center'>
				<div className='p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl'>
					<h2 className='text-2xl font-bold text-white mb-4'>
						No Projects Found
					</h2>
					<p className='text-gray-400 mb-8 max-w-md'>
						Connect your Supabase database and add projects to the
						&apos;projects&apos; table to see them here.
					</p>
					<button
						onClick={fetchProjects}
						className='px-8 py-3 bg-[var(--color-brand)] text-white font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 mx-auto'
					>
						<RefreshCw size={18} /> Retry Connection
					</button>
					<Link
						href='/admin'
						className='mt-4 inline-block text-[var(--color-brand-light)] hover:underline text-sm font-semibold tracking-wide'
					>
						Go to Admin Dashboard
					</Link>
				</div>
			</div>
		)
	}

	return (
		<>
			<section className='max-w-7xl mx-auto px-4 sm:px-8 py-20 min-h-[85vh] flex flex-col justify-center overflow-hidden'>
				<div className='relative z-10 w-full mb-16 text-center'>
					<h1
						className='mb-4 text-3xl font-extrabold tracking-wide text-white md:text-5xl'
						style={{ fontFamily: 'var(--font-space)' }}
					>
						Featured Solutions
					</h1>
					<p className='text-sm font-light tracking-widest text-gray-400 uppercase'>
						Architecting the Future of Business Efficiency
					</p>
				</div>

				<div className='relative h-[500px] w-full flex items-center justify-center -mt-8'>
					{/* Navigation Arrows */}
					<button
						onClick={handlePrev}
						disabled={activeIndex === 0}
						className='absolute left-4 md:left-[10%] z-40 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all text-white disabled:opacity-20 disabled:cursor-not-allowed hidden md:block'
					>
						<ChevronLeft size={24} />
					</button>

					<button
						onClick={handleNext}
						disabled={activeIndex === projects.length - 1}
						className='absolute right-4 md:right-[10%] z-40 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all text-white disabled:opacity-20 disabled:cursor-not-allowed hidden md:block'
					>
						<ChevronRight size={24} />
					</button>

					<div
						className='relative w-full max-w-[280px] md:max-w-[340px] h-[450px] flex justify-center items-center'
						style={{ perspective: 1200 }}
					>
						{projects.map((project, index) => {
							const offset = index - activeIndex
							const absoluteOffset = Math.abs(offset)

							const x = offset * 220
							const scale = 1 - absoluteOffset * 0.15
							const zIndex = projects.length - absoluteOffset
							const opacity = absoluteOffset > 2 ? 0 : 1 - absoluteOffset * 0.4
							const rotateY = offset * -25
							const isActive = activeIndex === index

							return (
								<motion.div
									key={project.id || index}
									onClick={() => {
										if (isActive) setSelectedProject(project)
										else setActiveIndex(index)
									}}
									animate={{
										x,
										scale,
										zIndex,
										opacity,
										rotateY,
									}}
									transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
									className={`absolute w-full h-[430px] rounded-[2rem] flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${isActive ? 'cursor-pointer hover:shadow-[0_20px_60px_rgba(108,59,137,0.4)]' : 'cursor-pointer'}`}
									style={{
										transformStyle: 'preserve-3d',
									}}
								>
									{/* Vibrant Background Gradient Overlay */}
									<div
										className='absolute inset-0 opacity-100 -z-20 transform scale-[1.1]'
										style={{
											background: `linear-gradient(135deg, ${project.gradient_start || '#6c3b89'}, ${project.gradient_end || '#bf55ec'})`,
										}}
									/>
									<div className='absolute inset-0 bg-black opacity-20 -z-10 mix-blend-overlay' />

									{/* Center 3D Simulated Icon Float */}
									<div className='relative flex flex-col items-center justify-center flex-1 overflow-hidden transition-transform group-hover:scale-105'>
										<motion.div
											animate={isActive ? { y: [-10, 10, -10] } : {}}
											transition={{
												duration: 5,
												repeat: Infinity,
												ease: 'easeInOut',
											}}
										>
											{getIcon(project.icon_name)}
										</motion.div>
									</div>

									{/* Bottom Frosty */}
									<div className='h-[105px] w-full bg-white/10 backdrop-blur-2xl border-t border-white/20 px-6 py-5 flex justify-between items-center relative z-10 shadow-inner group-hover:bg-white/15 transition-colors'>
										<div className='flex flex-col justify-center w-3/4'>
											<h3 className='text-white font-bold tracking-tight text-[1.1rem] leading-tight mb-1.5 filter drop-shadow-md truncate'>
												{project.title}
											</h3>
											<p className='text-gray-300 text-xs font-semibold tracking-wide flex items-center gap-1.5 uppercase'>
												<span className='w-1.5 h-1.5 rounded-full bg-[var(--color-brand-light)]'></span>
												{project.angle}
											</p>
										</div>

										<div className='flex flex-col items-end justify-center'>
											<p className='text-xs font-bold tracking-widest text-white uppercase'>
												{project.status || 'Live'}
											</p>
											<span className='text-[9px] text-white/50 tracking-widest mt-1'>
												STATUS
											</span>
										</div>
									</div>

									{/* Click Overlay Hint */}
									<AnimatePresence>
										{isActive && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className='absolute top-0 left-0 right-0 bottom-[105px] bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300'
											>
												<span className='px-6 py-3 bg-[var(--color-brand)] text-white font-bold rounded-full shadow-2xl text-sm uppercase tracking-widest'>
													View Case Study
												</span>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							)
						})}
					</div>
				</div>

				<div className='relative z-10 mt-8 text-center'>
					<Link
						href='/contact'
						className='inline-block px-10 py-4 bg-transparent border border-[var(--color-brand)] text-white font-bold rounded-full hover:bg-[var(--color-brand)] backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all uppercase tracking-widest text-sm hover:scale-105'
					>
						Book an Audit
					</Link>
				</div>
			</section>

			{/* Project Details Modal */}
			<AnimatePresence>
				{selectedProject && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md overflow-y-auto'
						onClick={() => setSelectedProject(null)}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							onClick={(e) => e.stopPropagation()}
							className='bg-[#050308] border border-white/10 w-[95vw] h-[90vh] rounded-[3rem] shadow-[0_0_150px_rgba(108,59,137,0.4)] overflow-hidden my-auto flex flex-col relative'
						>
							{/* Background Glow */}
							<div
								className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 pointer-events-none'
								style={{
									background: selectedProject.gradient_start || '#6c3b89',
								}}
							/>
							<div
								className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 pointer-events-none'
								style={{
									background: selectedProject.gradient_end || '#bf55ec',
								}}
							/>

							{/* Header - Glass Frost */}
							<div className='z-30 p-8 md:px-14 flex justify-between items-center bg-black/40 backdrop-blur-2xl border-b border-white/5'>
								<div className='flex items-center gap-6'>
									<div
										className='w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl'
										style={{
											background: `linear-gradient(135deg, ${selectedProject.gradient_start}, ${selectedProject.gradient_end})`,
										}}
									>
										{getIcon(selectedProject.icon_name)}
									</div>
									<div>
										<h2 className='text-2xl md:text-3xl font-black text-white tracking-tight leading-none'>
											{selectedProject.title}
										</h2>
										<p className='text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--color-brand-light)] mt-2 opacity-80'>
											{selectedProject.angle} • {selectedProject.category}
										</p>
									</div>
								</div>
								<button
									onClick={() => setSelectedProject(null)}
									className='w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group'
								>
									<X
										size={20}
										className='text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all'
									/>
								</button>
							</div>

							{/* Content - Main Grid */}
							<div className='flex-1 overflow-hidden flex flex-col md:grid md:grid-cols-12'>
								{/* Left: Project Details (Scrollable) */}
								<div className='md:col-span-5 h-full overflow-y-auto custom-scrollbar p-10 md:p-14 border-r border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent'>
									<div className='space-y-16'>
										<section>
											<label className='text-[10px] uppercase font-black tracking-widest text-[var(--color-brand-light)] mb-6 block opacity-60'>
												01 / Overview
											</label>
											<p className='text-lg font-light leading-relaxed text-gray-300'>
												{selectedProject.description}
											</p>
										</section>

										<section className='space-y-8'>
											<label className='text-[10px] uppercase font-black tracking-widest text-[var(--color-brand-light)] mb-6 block opacity-60'>
												02 / Strategic Brief
											</label>
											<div className='space-y-6'>
												<div className='p-8 rounded-3xl bg-white/5 border border-white/10 relative group overflow-hidden'>
													<div className='absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />
													<h4 className='text-sm font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-3'>
														<span className='w-2 h-2 rounded-full bg-red-400' />{' '}
														The Problem
													</h4>
													{renderBulletList(selectedProject.problem)}
												</div>

												<div className='p-8 rounded-3xl bg-white/5 border border-white/10 relative group overflow-hidden'>
													<div className='absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />
													<h4 className='text-sm font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-3'>
														<span className='w-2 h-2 rounded-full bg-blue-400' />{' '}
														The Solution
													</h4>
													{renderBulletList(selectedProject.solution)}
												</div>
											</div>
										</section>

										<section>
											<label className='text-[10px] uppercase font-black tracking-widest text-[var(--color-brand-light)] mb-6 block opacity-60'>
												03 / Key Milestones
											</label>
											<div className='grid grid-cols-1 gap-4'>
												{selectedProject.outcomes?.map((outcome, i) => (
													<div
														key={i}
														className='p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-5 hover:bg-white/[0.08] transition-all group'
													>
														<div className='w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand-light)] flex items-center justify-center font-bold text-sm'>
															{i + 1}
														</div>
														<p className='text-white/90 font-medium'>
															{outcome}
														</p>
													</div>
												))}
											</div>
										</section>

										<div className='pt-10'>
											<Link
												href='/contact'
												className='w-full py-6 bg-white text-black font-black rounded-[2rem] hover:scale-[1.02] transition-all uppercase tracking-widest text-xs shadow-2xl block text-center'
											>
												Build with Savvy
											</Link>
										</div>

										<div className='h-20 md:hidden' />
									</div>
								</div>

								{/* Right: Media Showcase (Center Viewport Focused) */}
								<div className='md:col-span-7 h-full overflow-y-auto custom-scrollbar p-6 md:p-14 bg-black/20 flex flex-col gap-12'>
									<div className='space-y-6'>
										<label className='text-[10px] uppercase font-black tracking-widest text-gray-500'>
											Visual Interface
										</label>
										<div className='w-full aspect-video rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] group relative'>
											{selectedProject.screenshot_url ? (
												<Image
													src={selectedProject.screenshot_url}
													alt='Interface'
													fill
													unoptimized
													className='object-cover group-hover:scale-110 transition-transform duration-[2s]'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center text-gray-700 italic'>
													Snapshot Unavailable
												</div>
											)}
										</div>
									</div>

									<div className='space-y-6'>
										<label className='text-[10px] uppercase font-black tracking-widest text-gray-500'>
											Functional Walkthrough
										</label>
										<div className='w-full aspect-video rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] relative'>
											{selectedProject.video_url ? (
												selectedProject.video_url.includes('youtube.com') ||
												selectedProject.video_url.includes('loom.com') ? (
													<div
														className='w-full h-full flex items-center justify-center group cursor-pointer relative'
														onClick={() =>
															window.open(selectedProject.video_url, '_blank')
														}
													>
														<div className='absolute inset-0 bg-gradient-to-tr from-[var(--color-brand)]/10 to-transparent' />
														<div className='w-24 h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-[var(--color-brand)] group-hover:border-[var(--color-brand)] transition-all duration-300 scale-90 group-hover:scale-100'>
															<div className='w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2' />
														</div>
														<p className='absolute bottom-8 text-xs font-bold text-white/40 tracking-widest uppercase'>
															Launch Full Walkthrough
														</p>
													</div>
												) : (
													<video
														src={selectedProject.video_url}
														controls
														className='w-full h-full object-contain'
														poster={selectedProject.screenshot_url}
													>
														<source
															src={selectedProject.video_url}
															type='video/mp4'
														/>
													</video>
												)
											) : (
												<div className='w-full h-full flex items-center justify-center text-gray-700 italic'>
													Broadcast Coming Soon
												</div>
											)}
										</div>
									</div>

									<div className='h-20' />
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
