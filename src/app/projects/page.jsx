'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
	CheckCircle2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Projects() {
	const [activeIndex, setActiveIndex] = useState(0)
	const [selectedProject, setSelectedProject] = useState(null)
	const [projects, setProjects] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [carouselLayout, setCarouselLayout] = useState({
		spread: 220,
		rotate: 25,
	})
	const scrollYRef = useRef(0)
	const [portfolioShowAll, setPortfolioShowAll] = useState(false)
	const [portalReady, setPortalReady] = useState(false)
	const [videoLoadingId, setVideoLoadingId] = useState(null)
	const [videoPlayingId, setVideoPlayingId] = useState(null)
	const [videoError, setVideoError] = useState(null)
	const [expandedImage, setExpandedImage] = useState(null)

	useEffect(() => {
		setPortalReady(true)
	}, [])

	useEffect(() => {
		const updateLayout = () => {
			const w = typeof window !== 'undefined' ? window.innerWidth : 1024
			if (w < 480) setCarouselLayout({ spread: 68, rotate: 14 })
			else if (w < 640) setCarouselLayout({ spread: 95, rotate: 17 })
			else if (w < 768) setCarouselLayout({ spread: 130, rotate: 20 })
			else if (w < 1024) setCarouselLayout({ spread: 180, rotate: 22 })
			else setCarouselLayout({ spread: 220, rotate: 25 })
		}
		updateLayout()
		window.addEventListener('resize', updateLayout)
		return () => window.removeEventListener('resize', updateLayout)
	}, [])

	useEffect(() => {
		fetchProjects()
	}, [])

	// Lock page scroll when modal is open (incl. mobile / iOS)
	useEffect(() => {
		if (!selectedProject) {
			// Reset video state when modal closes
			setVideoPlayingId(null)
			setVideoLoadingId(null)
			setVideoError(null)
			return
		}
		scrollYRef.current = window.scrollY
		const html = document.documentElement
		const body = document.body
		body.style.position = 'fixed'
		body.style.top = `-${scrollYRef.current}px`
		body.style.left = '0'
		body.style.right = '0'
		body.style.width = '100%'
		body.style.overflow = 'hidden'
		html.style.overflow = 'hidden'
		return () => {
			body.style.position = ''
			body.style.top = ''
			body.style.left = ''
			body.style.right = ''
			body.style.width = ''
			body.style.overflow = ''
			html.style.overflow = ''
			window.scrollTo(0, scrollYRef.current)
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



	const getIcon = (iconName, iconSize = 100) => {
		const props = {
			size: iconSize,
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
			<section
				className='max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-center overflow-x-visible'
				style={{ overflowX: 'clip' }}
			>
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

				{/* Swipe / View all — mobile + desktop */}
				<div className='flex justify-center gap-2 mb-6 md:mb-8'>
					<button
						type='button'
						onClick={() => setPortfolioShowAll(false)}
						className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
							!portfolioShowAll
								? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white shadow-[0_0_20px_rgba(108,59,137,0.4)]'
								: 'bg-white/5 border-white/15 text-gray-400 hover:border-white/30 hover:text-white'
						}`}
					>
						Swipe
					</button>
					<button
						type='button'
						onClick={() => setPortfolioShowAll(true)}
						className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
							portfolioShowAll
								? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white shadow-[0_0_20px_rgba(108,59,137,0.4)]'
								: 'bg-white/5 border-white/15 text-gray-400 hover:border-white/30 hover:text-white'
						}`}
					>
						View all
					</button>
				</div>

				{!portfolioShowAll && (
					<div className='md:hidden w-full -mx-4 px-4'>
						<div className='flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 scroll-px-4 overscroll-x-contain touch-pan-x [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] items-center min-h-0'>
							{projects.map((project, i) => (
								<motion.div
									key={project.id ?? i}
									role='button'
									tabIndex={0}
									onClick={() => setSelectedProject(project)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											setSelectedProject(project)
										}
									}}
									className='snap-center shrink-0 w-[min(84vw,268px)] h-[clamp(248px,min(54svh,316px),316px)] rounded-[1.5rem] flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer relative border border-white/10 box-border'
									whileTap={{ scale: 0.98 }}
								>
									<div
										className='absolute inset-0 opacity-100 -z-20 transform scale-[1.1]'
										style={{
											background: `linear-gradient(135deg, ${project.gradient_start || '#6c3b89'}, ${project.gradient_end || '#bf55ec'})`,
										}}
									/>
									<div className='absolute inset-0 bg-black opacity-20 -z-10 mix-blend-overlay' />

									<div className='relative flex flex-col items-center justify-center flex-1 overflow-hidden min-h-0'>
										{getIcon(project.icon_name, 100)}
									</div>

									<div className='w-full bg-white/10 backdrop-blur-2xl border-t border-white/20 flex justify-between items-center relative z-10 shadow-inner h-[105px] px-6 py-5'>
										<div className='flex flex-col justify-center min-w-0 flex-1 pr-2'>
											<h3 className='text-white font-bold tracking-tight text-[1.1rem] leading-tight mb-1.5 filter drop-shadow-md truncate'>
												{project.title}
											</h3>
											<p className='text-gray-300 text-xs font-semibold tracking-wide flex items-center gap-1.5 uppercase'>
												<span className='w-1.5 h-1.5 rounded-full bg-[var(--color-brand-light)] shrink-0'></span>
												<span className='truncate'>{project.angle}</span>
											</p>
										</div>
										<div className='flex flex-col items-end justify-center shrink-0'>
											<p className='text-xs font-bold tracking-widest text-white uppercase'>
												{project.status || 'Live'}
											</p>
											<span className='text-[9px] text-white/50 tracking-widest mt-1'>
												STATUS
											</span>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}

				{portfolioShowAll && (
					<div className='w-full max-w-7xl mx-auto px-4 sm:px-8 mb-4 md:mb-0'>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6'>
							{projects.map((project, i) => (
								<motion.div
									key={project.id ?? i}
									role='button'
									tabIndex={0}
									onClick={() => setSelectedProject(project)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											setSelectedProject(project)
										}
									}}
									className='w-full h-[200px] md:h-[220px] rounded-[1.25rem] flex flex-col justify-between overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.55)] cursor-pointer relative border border-white/10'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div
										className='absolute inset-0 opacity-100 -z-20 transform scale-[1.1]'
										style={{
											background: `linear-gradient(135deg, ${project.gradient_start || '#6c3b89'}, ${project.gradient_end || '#bf55ec'})`,
										}}
									/>
									<div className='absolute inset-0 bg-black opacity-20 -z-10 mix-blend-overlay' />

									<div className='relative flex flex-col items-center justify-center flex-1 overflow-hidden min-h-0'>
										{getIcon(project.icon_name, 52)}
									</div>

									<div className='w-full bg-white/10 backdrop-blur-2xl border-t border-white/20 flex justify-between items-center relative z-10 shadow-inner h-[72px] px-3 py-2'>
										<div className='flex flex-col justify-center min-w-0 flex-1 pr-2'>
											<h3 className='text-white font-bold tracking-tight text-xs mb-0.5 leading-tight filter drop-shadow-md truncate'>
												{project.title}
											</h3>
											<p className='text-gray-300 text-[9px] font-semibold tracking-wide flex items-center gap-1 uppercase line-clamp-1'>
												<span className='w-1.5 h-1.5 rounded-full bg-[var(--color-brand-light)] shrink-0'></span>
												<span className='truncate'>{project.angle}</span>
											</p>
										</div>
										<div className='flex flex-col items-end justify-center shrink-0'>
											<p className='text-[9px] font-bold tracking-widest text-white uppercase'>
												{project.status || 'Live'}
											</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}

				{!portfolioShowAll && (
					<div className='relative h-[min(72vw,420px)] sm:h-[460px] md:h-[500px] w-full max-w-full hidden md:flex items-center justify-center -mt-4 sm:-mt-8 min-w-0'>
						{/* Navigation Arrows (desktop) */}
						<button
							onClick={handlePrev}
							disabled={activeIndex === 0}
							className='absolute left-4 md:left-[10%] z-40 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all text-white disabled:opacity-20 disabled:cursor-not-allowed'
						>
							<ChevronLeft size={24} />
						</button>

						<button
							onClick={handleNext}
							disabled={activeIndex === projects.length - 1}
							className='absolute right-4 md:right-[10%] z-40 p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all text-white disabled:opacity-20 disabled:cursor-not-allowed'
						>
							<ChevronRight size={24} />
						</button>

						<div
							className='relative w-full max-w-[min(88vw,280px)] sm:max-w-[300px] md:max-w-[340px] h-[min(68vw,400px)] sm:h-[420px] md:h-[450px] flex justify-center items-center mx-auto'
							style={{ perspective: 1200 }}
						>
							{projects.map((project, index) => {
								const offset = index - activeIndex
								const absoluteOffset = Math.abs(offset)

								const x = offset * carouselLayout.spread
								const scale = 1 - absoluteOffset * 0.15
								const zIndex = projects.length - absoluteOffset
								const opacity =
									absoluteOffset > 2 ? 0 : 1 - absoluteOffset * 0.4
								const rotateY = offset * -carouselLayout.rotate
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
										className={`absolute w-full h-[min(62vw,380px)] sm:h-[400px] md:h-[430px] rounded-[1.5rem] sm:rounded-[2rem] flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${isActive ? 'cursor-pointer hover:shadow-[0_20px_60px_rgba(108,59,137,0.4)]' : 'cursor-pointer'}`}
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
				)}

				<div className='relative z-10 mt-8 text-center'>
					<Link
						href='/contact'
						className='inline-block px-10 py-4 bg-transparent border border-[var(--color-brand)] text-white font-bold rounded-full hover:bg-[var(--color-brand)] backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all uppercase tracking-widest text-sm hover:scale-105'
					>
						Book an Audit
					</Link>
				</div>
			</section>

			{/* Project Details Modal — portal escapes main z-10 so overlay sits above nav (z-50) */}
			{portalReady &&
				createPortal(
					<AnimatePresence>
						{selectedProject && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className='fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md overflow-hidden overscroll-none'
								onClick={() => setSelectedProject(null)}
							>
								<motion.div
									initial={{ opacity: 0, scale: 0.95, y: 20 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95, y: 20 }}
									onClick={(e) => e.stopPropagation()}
									className='bg-[#050308] border border-white/10 w-[min(100vw-1rem,95vw)] max-h-[min(100dvh-2rem,90vh)] h-[min(90vh,100dvh-2rem)] rounded-2xl sm:rounded-[3rem] shadow-[0_0_150px_rgba(108,59,137,0.4)] overflow-hidden flex flex-col relative max-w-full min-h-0'
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
									<div className='z-30 p-4 sm:p-8 md:px-14 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-stretch sm:items-center bg-black/40 backdrop-blur-2xl border-b border-white/5 shrink-0'>
										<div className='flex items-center gap-3 sm:gap-6 min-w-0'>
											<div
												className='w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shrink-0 overflow-hidden'
												style={{
													background: `linear-gradient(135deg, ${selectedProject.gradient_start}, ${selectedProject.gradient_end})`,
												}}
											>
												{getIcon(selectedProject.icon_name, 44)}
											</div>
											<div className='min-w-0'>
												<h2 className='text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight break-words'>
													{selectedProject.title}
												</h2>
												<p className='text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-[var(--color-brand-light)] mt-2 opacity-80'>
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

									{/* Content — single scroll region */}
									<div className='flex-1 min-h-0 overflow-y-auto overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch] custom-scrollbar flex flex-col md:grid md:grid-cols-12'>
										{/* Left: Project Details */}
										<div className='md:col-span-5 p-5 sm:p-8 md:p-14 md:border-r border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent min-w-0'>
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
														<div className='flex flex-col gap-3'>
															<h4 className='text-[11px] font-black text-[#e7701e] uppercase tracking-widest flex items-center gap-2 px-1'>
																The Problem
															</h4>
															<div className='py-6 px-6 bg-[#18110c] border-l-[3px] border-[#e7701e] rounded-r-xl shadow-lg'>
																{(() => {
																	const txt = selectedProject.problem
																	if (!txt) return null
																	const lines = txt.split('\n').filter((line) => line.trim().length > 0)
																	return (
																		<ul className='space-y-4'>
																			{lines.map((line, idx) => (
																				<li key={idx} className='flex gap-4 items-start text-gray-300 font-medium leading-relaxed tracking-wide text-[15px]'>
																					<span className='w-1.5 h-1.5 rounded-full bg-[#e7701e] mt-2.5 shrink-0 opacity-90' />
																					<span className='opacity-90'>{line.trim()}</span>
																				</li>
																			))}
																		</ul>
																	)
																})()}
															</div>
														</div>

														<div className='flex flex-col gap-3'>
															<h4 className='text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 px-1'>
																The Solution
															</h4>
															<div className='py-6 px-6 bg-[#0a111a] border-l-[3px] border-blue-500 rounded-r-xl shadow-lg'>
																{(() => {
																	const txt = selectedProject.solution
																	if (!txt) return null
																	const lines = txt.split('\n').filter((line) => line.trim().length > 0)
																	return (
																		<ul className='space-y-4'>
																			{lines.map((line, idx) => (
																				<li key={idx} className='flex gap-4 items-start text-gray-300 font-medium leading-relaxed tracking-wide text-[15px]'>
																					<span className='w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0 opacity-90' />
																					<span className='opacity-90'>{line.trim()}</span>
																				</li>
																			))}
																		</ul>
																	)
																})()}
															</div>
														</div>
													</div>
												</section>

												<section>
													<label className='text-[10px] uppercase font-black tracking-widest text-[var(--color-brand-light)] mb-6 block opacity-60'>
														03 / Key Milestones
													</label>
													<div className='p-6 sm:p-8 bg-[#0a0a0b] border border-white/5 rounded-2xl shadow-xl'>
														<ul className='space-y-5'>
															{selectedProject.outcomes?.map((outcome, i) => (
																<li key={i} className='flex items-center gap-4 group'>
																	<CheckCircle2 strokeWidth={2.5} size={20} className='text-[#15b243] shrink-0 group-hover:scale-110 transition-transform' />
																	<span className='text-[15px] font-semibold text-white tracking-wide opacity-90 group-hover:opacity-100 transition-opacity'>
																		{outcome}
																	</span>
																</li>
															))}
														</ul>
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

										{/* Right: Media Showcase */}
										<div className='md:col-span-7 p-4 sm:p-6 md:p-14 bg-black/20 flex flex-col gap-8 sm:gap-12 min-w-0'>
											<div className='space-y-6'>
												<label className='text-[10px] uppercase font-black tracking-widest text-gray-500'>
													Visual Interface
												</label>
												{(() => {
													const screenshots = selectedProject.screenshot_url
														? selectedProject.screenshot_url.split(',').map(s => s.trim()).filter(Boolean)
														: []
													
													return screenshots.length > 0 ? (
														<div className='space-y-8'>
															{screenshots.map((url, i) => (
																<div
																	key={i}
																	className='w-full aspect-video rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] group relative cursor-pointer'
																	onClick={() => setExpandedImage(url)}
																>
																	<img
																		src={url}
																		alt={`Interface ${i + 1}`}
																		className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]'
																	/>
																</div>
															))}
														</div>
													) : (
														<div className='w-full aspect-video rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] flex items-center justify-center text-gray-700 italic'>
															Snapshot Unavailable
														</div>
													)
												})()}
											</div>

											<div className='space-y-6'>
												<label className='text-[10px] uppercase font-black tracking-widest text-gray-500'>
													Functional Walkthrough
												</label>
												<div className='w-full aspect-video rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] relative'>
													{selectedProject.video_url ? (
														selectedProject.video_url.includes('youtube.com') ||
														selectedProject.video_url.includes('youtu.be') ||
														selectedProject.video_url.includes('vimeo.com') ||
														selectedProject.video_url.includes('loom.com') ? (
															(() => {
																let embedUrl = selectedProject.video_url;
																try {
																	if (embedUrl.includes('youtube.com/watch')) {
																		const v = new URL(embedUrl).searchParams.get('v');
																		if (v) embedUrl = `https://www.youtube.com/embed/${v}?autoplay=1`;
																	} else if (embedUrl.includes('youtu.be/')) {
																		const v = embedUrl.split('youtu.be/')[1]?.split('?')[0];
																		if (v) embedUrl = `https://www.youtube.com/embed/${v}?autoplay=1`;
																	} else if (embedUrl.includes('loom.com/share/')) {
																		const v = embedUrl.split('share/')[1]?.split('?')[0];
																		if (v) embedUrl = `https://www.loom.com/embed/${v}?autoplay=1`;
																	} else if (embedUrl.includes('vimeo.com/')) {
																		const v = embedUrl.split('vimeo.com/')[1]?.split('?')[0];
																		if (v) embedUrl = `https://player.vimeo.com/video/${v}?autoplay=1`;
																	}
																} catch (e) {}

																return (
																	<div className="w-full h-full relative group flex items-center justify-center bg-black">
																		{videoPlayingId === selectedProject.id ? (
																			<iframe
																				src={embedUrl}
																				className="w-full h-full absolute inset-0 border-0"
																				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
																				allowFullScreen
																			/>
																		) : (
																			<div
																				className='w-full h-full flex items-center justify-center cursor-pointer relative'
																				onClick={() => setVideoPlayingId(selectedProject.id)}
																			>
																				<div className='absolute inset-0 bg-gradient-to-tr from-[var(--color-brand)]/20 to-black/60 z-10' />
																				
																				{selectedProject.screenshot_url && (
																					<img 
																						src={selectedProject.screenshot_url.split(',').map(s => s.trim()).filter(Boolean)[0]} 
																						className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 z-0"
																						alt="Video Thumbnail"
																					/>
																				)}

																				<div className='w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-[var(--color-brand)] group-hover:border-[var(--color-brand)] transition-all duration-300 scale-90 group-hover:scale-100 z-20 shadow-[0_0_40px_rgba(0,0,0,0.6)]'>
																					<div className='w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2' />
																				</div>
																				<p className='absolute bottom-8 text-xs font-bold text-white/70 tracking-widest uppercase z-20'>
																					Play Functional Walkthrough
																				</p>
																			</div>
																		)}
																	</div>
																)
															})()
														) : videoPlayingId === selectedProject.id ? (
															<>
																<video
																	key={selectedProject.id}
																	controls
																	autoPlay
																	playsInline
																	preload='auto'
																	className='w-full h-full object-contain'
																	poster={
																		selectedProject.screenshot_url
																			? selectedProject.screenshot_url.split(',').map(s => s.trim()).filter(Boolean)[0]
																			: undefined
																	}
																	onCanPlay={() => setVideoLoadingId(null)}
																	onLoadedData={() => setVideoLoadingId(null)}
																	onWaiting={() =>
																		setVideoLoadingId(selectedProject.id)
																	}
																	onPlaying={() => setVideoLoadingId(null)}
																	onError={() => {
																		setVideoLoadingId(null)
																		setVideoError(selectedProject.id)
																		setVideoPlayingId(null)
																	}}
																>
																	<source
																		src={selectedProject.video_url}
																		type='video/mp4'
																	/>
																	Your browser does not support the video tag.
																</video>
																{videoLoadingId === selectedProject.id && (
																	<div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none'>
																		<div className='flex flex-col items-center gap-4'>
																			<motion.div
																				animate={{ rotate: 360 }}
																				transition={{
																					duration: 1.5,
																					repeat: Infinity,
																					ease: 'linear',
																				}}
																				className='w-10 h-10 border-2 border-white/20 border-t-[var(--color-brand)] rounded-full'
																			/>
																			<p className='text-xs text-white/60 font-light tracking-widest'>
																				Buffering...
																			</p>
																		</div>
																	</div>
																)}
															</>
														) : (
															<div
																className='w-full h-full flex items-center justify-center group cursor-pointer relative'
																onClick={() => {
																	setVideoError(null)
																	setVideoLoadingId(selectedProject.id)
																	setVideoPlayingId(selectedProject.id)
																}}
															>
																{/* Poster / thumbnail background */}
																{selectedProject.screenshot_url && selectedProject.screenshot_url.split(',').map(s => s.trim()).filter(Boolean)[0] && (
																	<img
																		src={selectedProject.screenshot_url.split(',').map(s => s.trim()).filter(Boolean)[0]}
																		alt='Video thumbnail'
																		className='absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500'
																	/>
																)}
																<div className='absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent' />

																{videoError === selectedProject.id ? (
																	<div className='relative z-10 flex flex-col items-center gap-4'>
																		<div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/10 backdrop-blur-xl border border-red-500/20 flex items-center justify-center'>
																			<X size={28} className='text-red-400' />
																		</div>
																		<p className='text-sm font-bold text-white/70 tracking-wider'>
																			Failed to load video
																		</p>
																		<button
																			onClick={(e) => {
																				e.stopPropagation()
																				setVideoError(null)
																				setVideoLoadingId(selectedProject.id)
																				setVideoPlayingId(selectedProject.id)
																			}}
																			className='px-6 py-2.5 bg-[var(--color-brand)] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all flex items-center gap-2'
																		>
																			<RefreshCw size={14} /> Retry
																		</button>
																	</div>
																) : (
																	<div className='relative z-10 flex flex-col items-center gap-4'>
																		<div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-[var(--color-brand)] group-hover:border-[var(--color-brand)] transition-all duration-300 scale-90 group-hover:scale-100 shadow-[0_0_40px_rgba(0,0,0,0.5)]'>
																			<div className='w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2' />
																		</div>
																		<p className='text-xs font-bold text-white/40 tracking-widest uppercase'>
																			Play Walkthrough
																		</p>
																	</div>
																)}
															</div>
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

						{/* Fullscreen Image Lightbox Modal */}
						{expandedImage && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className='fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl'
								onClick={() => setExpandedImage(null)}
							>
								<button
									onClick={() => setExpandedImage(null)}
									className='absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 hover:bg-[var(--color-brand)] border border-white/20 flex items-center justify-center transition-all z-50 group shadow-[0_0_30px_rgba(0,0,0,0.5)]'
								>
									<X size={24} className='text-gray-300 group-hover:text-white group-hover:rotate-90 transition-all' />
								</button>
								<motion.img
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 0.9, opacity: 0 }}
									transition={{ type: 'spring', damping: 25, stiffness: 300 }}
									src={expandedImage}
									alt='Expanded View'
									className='max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(108,59,137,0.4)]'
									onClick={(e) => e.stopPropagation()}
								/>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</>
	)
}
