'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	Grid,
} from 'lucide-react'

export default function ServicesSection() {
	const [services, setServices] = useState([])
	const [viewAll, setViewAll] = useState(false)
	const [activeIndex, setActiveIndex] = useState(0)
	const [expandedServiceId, setExpandedServiceId] = useState(null)

	useEffect(() => {
		const fetchServices = async () => {
			const { data } = await supabase
				.from('services')
				.select('*')
				.order('order_index')
			setServices(data || [])
		}
		fetchServices()
	}, [])

	if (services.length === 0) return null

	const itemsPerPage = 4
	const totalPages = Math.ceil(services.length / itemsPerPage)

	const handleNext = () => {
		if (activeIndex < totalPages - 1) setActiveIndex((prev) => prev + 1)
	}

	const handlePrev = () => {
		if (activeIndex > 0) setActiveIndex((prev) => prev - 1)
	}

	const displayServices = services.slice(
		activeIndex * itemsPerPage,
		(activeIndex + 1) * itemsPerPage,
	)

	return (
		<section
			className='w-full min-h-[85vh] sm:min-h-[100vh] bg-[#050308] relative flex flex-col justify-center overflow-hidden'
			style={{ overflowX: 'clip' }}
		>
			{viewAll ? (
				// ----------- GRID VIEW (VIEW ALL) -----------
				<div className='w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 relative z-20'>
					<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 sm:mb-16 gap-6'>
						<div className='flex items-center gap-4'>
							<div className='w-12 h-1.5 rounded-full bg-[var(--color-brand)]' />
							<h2
								className='text-3xl sm:text-5xl font-black text-white break-words uppercase tracking-tight'
								style={{ fontFamily: 'var(--font-space)' }}
							>
								All{' '}
								<span className='text-[var(--color-brand-light)]'>
									Services
								</span>
							</h2>
						</div>
						<button
							onClick={() => setViewAll(false)}
							className='px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-2'
						>
							Return to 3D View
						</button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
						{services.map((service, i) => (
							<motion.div
								key={service.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.05, duration: 0.5 }}
								whileHover={{ y: -10 }}
								className='p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 flex flex-col items-start shadow-2xl relative group overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-[var(--color-brand)]/50 min-w-0'
							>
								<div className='absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-brand)]/10 blur-[60px] rounded-full group-hover:opacity-100 opacity-0 transition-opacity' />
								<div className='relative z-10 w-full flex-1'>
									<h3 className='text-3xl font-black text-white mb-6 leading-[1.1] tracking-tight group-hover:text-gradient transition-all duration-500 break-words'>
										{service.title}
									</h3>
									<p className='text-gray-400 font-light text-[1rem] leading-relaxed mb-10'>
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
			) : (
				// ----------- 3D INTERACTIVE VIEW (DEFAULT) -----------
				<div className='relative w-full h-full flex-1 flex flex-col items-center justify-center pt-8 sm:pt-20 pb-24 lg:flex-row'>
					{/* Massive Background Typography */}
					<div className='absolute top-[8%] sm:top-[2%] left-0 w-full text-center flex flex-col items-center justify-start pointer-events-none z-0'>
						<h2
							className='text-5xl sm:text-7xl md:text-[8rem] italic text-white/90 drop-shadow-2xl'
							style={{
								fontFamily: 'Georgia, serif',
								filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))',
							}}
						>
							My
						</h2>
						<h1 className='text-[3.5rem] sm:text-[6rem] md:text-[10rem] lg:text-[12rem] font-black leading-none uppercase text-transparent bg-clip-text bg-gradient-to-b from-gray-100 via-gray-400 to-black/40 tracking-tighter mix-blend-overlay -mt-2 sm:-mt-6 lg:-mt-12 drop-shadow-2xl'>
							SERVICES
						</h1>
					</div>

					{/* The Generative Neon Hand Background */}
					<div className='absolute left-[-15%] sm:left-[-10%] md:left-[0%] bottom-0 w-[120%] sm:w-[80%] md:w-[60%] lg:w-[50%] h-[50%] sm:h-[60%] md:h-[70%] pointer-events-none z-10 mix-blend-screen opacity-80 lg:opacity-90 flex items-end'>
						<img
							src='/bg-hand.png'
							alt='Neon Hand'
							className='w-full h-full object-contain object-left-bottom'
							style={{ filter: 'drop-shadow(0 0 50px rgba(168,85,247,0.3))' }}
						/>
					</div>

					{/* 3D Floating Glass Cards */}
					<div className='relative z-20 w-full h-[60vh] sm:h-[70vh] flex items-center justify-center lg:justify-end lg:pr-[10%] mt-[5vh] sm:mt-[10vh] max-w-7xl mx-auto'>
						<div
							className='flex flex-col items-end gap-4 sm:gap-5 w-[85%] sm:w-[400px] md:w-[450px]'
							style={{
								transformStyle: 'preserve-3d',
								transform:
									'perspective(1400px) rotateX(25deg) rotateY(-5deg) rotateZ(15deg) scale(0.8)',
							}}
						>
							<AnimatePresence mode='popLayout'>
								{displayServices.map((service, i) => (
									<motion.div
										key={service.id}
										layout
										initial={{ opacity: 0, y: -50, scale: 0.9, z: -100 }}
										animate={{
											opacity: 1,
											y: 0,
											scale: 1,
											z: expandedServiceId === service.id ? 20 : 0,
										}}
										exit={{ opacity: 0, y: 50, scale: 0.9, z: 100 }}
										transition={{
											duration: 0.6,
											type: 'spring',
											bounce: 0.4,
											delay: i * 0.1,
										}}
										whileHover={{
											z: expandedServiceId === service.id ? 20 : 40,
											scale: 1.05,
											rotateX: -5,
										}}
										onClick={() =>
											setExpandedServiceId(
												expandedServiceId === service.id ? null : service.id,
											)
										}
										className='w-full min-h-[90px] sm:min-h-[120px] rounded-[1.5rem] sm:rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 cursor-pointer border border-[#c084fc]/60 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_2px_20px_rgba(255,255,255,0.3)] group overflow-hidden'
										style={{
											background:
												'linear-gradient(135deg, rgba(126,34,206,0.5) 0%, rgba(59,7,100,0.8) 100%)',
											boxShadow:
												'0 25px 50px rgba(0,0,0,0.6), inset 0 2px 20px rgba(255,255,255,0.2), 0 0 30px rgba(168,85,247,0.3)',
										}}
									>
										<motion.h3
											layout='position'
											className='text-white font-black text-xl sm:text-3xl text-center leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)] transition-colors duration-300 tracking-wide'
										>
											{service.title}
										</motion.h3>

										<AnimatePresence>
											{expandedServiceId === service.id && (
												<motion.div
													initial={{ opacity: 0, height: 0, marginTop: 0 }}
													animate={{
														opacity: 1,
														height: 'auto',
														marginTop: 16,
													}}
													exit={{ opacity: 0, height: 0, marginTop: 0 }}
													className='text-center w-full'
												>
													<p className='text-white text-sm sm:text-base md:text-lg font-medium leading-relaxed drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] mb-6 text-balance'>
														{service.description}
													</p>
													<div className='flex flex-wrap justify-center gap-2'>
														{(service.tags || []).map((tag, j) => (
															<span
																key={j}
																className='text-[9px] sm:text-[11px] font-black tracking-widest uppercase px-3 py-1.5 bg-white/20 rounded-md border border-white/30 text-white shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
															>
																{tag}
															</span>
														))}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</div>

					{/* Navigation / Toggle Controls */}
					<div className='absolute bottom-6 sm:bottom-10 left-0 w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between px-6 sm:px-12 z-40 gap-6'>
						{/* Logo or Brand Element on the Left (optional, matching the "lets corn" in the ref) */}
						<div className='hidden sm:block opacity-50 font-bold tracking-widest uppercase text-[10px] text-white'>
							Savvy
							<br />
							OnChain
						</div>

						{/* Carousel Dots & Arrows */}
						{totalPages > 1 && (
							<div className='flex items-center gap-4 sm:gap-6 bg-black/40 backdrop-blur-md px-4 sm:px-6 py-3 rounded-full border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]'>
								<button
									onClick={handlePrev}
									disabled={activeIndex === 0}
									className='text-white/50 hover:text-white disabled:opacity-20 transition-colors p-1'
								>
									<ChevronLeft size={20} />
								</button>
								<div className='flex gap-2 sm:gap-3'>
									{Array.from({ length: totalPages }).map((_, idx) => (
										<div
											key={idx}
											onClick={() => setActiveIndex(idx)}
											className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === idx ? 'bg-[var(--color-brand)] shadow-[0_0_10px_var(--color-brand)] scale-125' : 'bg-white/20 hover:bg-white/40'}`}
										/>
									))}
								</div>
								<button
									onClick={handleNext}
									disabled={activeIndex === totalPages - 1}
									className='text-white/50 hover:text-white disabled:opacity-20 transition-colors p-1'
								>
									<ChevronRight size={20} />
								</button>
							</div>
						)}

						{/* View All Toggle Switch */}
						<button
							onClick={() => setViewAll(true)}
							className='flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-[var(--color-brand)] border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] group'
						>
							<Grid
								size={16}
								className='text-white/70 group-hover:text-white transition-colors'
							/>
							View All Services
						</button>
					</div>
				</div>
			)}
		</section>
	)
}
