'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Loader2, Workflow } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LetterPage() {
	const [letter, setLetter] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchLetter = async () => {
			try {
				// Query for the most recently updated active letter
				const { data, error } = await supabase
					.from('cover_letter')
					.select('*')
					.eq('is_active', true)
					.order('updated_at', { ascending: false })
					.limit(1)
					.maybeSingle()

				if (error) throw error
				setLetter(data)
			} catch (err) {
				console.error('Error fetching letter:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchLetter()
	}, [])

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-[#0A0612]'>
				<Loader2 className='animate-spin text-[var(--color-brand-light)]' size={48} />
			</div>
		)
	}

	// Fallback content if no data is in Supabase
	const displayLetter = letter || {
		title: 'To My Next Team,',
		content: `I believe that great design isn’t just about how things look, but how they feel and function in the hands of a user. My journey as a designer has been driven by a singular obsession: bridging the gap between technical complexity and human intuition.\n\nIn my work at Elewachi, I've focused on creating "Curated Canvases"—spaces where whitespace is intentional and typography carries the weight of the brand's voice. I don't just build interfaces; I craft digital experiences that respect the user's focus and elevate the product's purpose.\n\nI am looking to join a team that values intentionality as much as I do. A team that isn't afraid to challenge the status quo of "standard" grids and is willing to embrace the beauty of sophisticated minimalism. I bring with me a deep understanding of Material Design principles, a passion for editorial aesthetics, and a commitment to high-performance frontend execution.\n\nThank you for considering my work. I look forward to the possibility of building something extraordinary together.`,
		closing_text: 'Warmly,',
		signature_name: 'Savvy',
	}

	const contentParagraphs = displayLetter.content.split('\n\n')

	return (
		<main className='relative w-full min-h-screen pt-20 pb-32 overflow-hidden bg-[#0A0612]'>
			{/* Global Animated Mesh Background (Consistent with Home) */}
			<div className="fixed inset-0 -z-10 overflow-hidden bg-[#0A0612] pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--color-brand)] rounded-full mix-blend-screen blur-[120px] opacity-[0.2] animate-pulse" />
				<div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[var(--color-secondary)] rounded-full mix-blend-screen blur-[150px] opacity-[0.15] animate-pulse" style={{ animationDelay: '2s' }} />
			</div>

			<div className='relative z-10 max-w-4xl px-8 mx-auto'>
				{/* Top Navigation */}
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					className='mb-16'
				>
					<Link
						href='/'
						className='inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase hover:text-white transition-all group'
					>
						<ChevronLeft size={16} className='group-hover:-translate-x-1 transition-transform' /> BACK TO ARCHITECT
					</Link>
				</motion.div>

				{/* Letter Canvas */}
				<motion.article
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className='relative p-12 md:p-20 bg-white/[0.02] backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col'
				>
					{/* Decorative Workflow Icon in bg */}
					<div className='absolute top-10 right-10 opacity-5 pointer-events-none'>
						<Workflow size={120} />
					</div>

					{/* Title Section */}
					<header className='mb-16'>
						<h1
							className='text-5xl md:text-7xl font-black italic tracking-tighter text-[var(--color-brand-light)] leading-none filter drop-shadow-[0_0_15px_rgba(159,102,194,0.3)]'
							style={{ fontFamily: 'var(--font-space)' }}
						>
							{displayLetter.title}
						</h1>
					</header>

					{/* Letter Body */}
					<section className='mb-20 space-y-12'>
						{contentParagraphs.map((paragraph, index) => (
							<motion.p
								key={index}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 + index * 0.1 }}
								className='text-lg md:text-xl font-light leading-[1.8] text-gray-300 md:text-gray-200'
								style={{ fontFamily: 'var(--font-inter)' }}
							>
								{paragraph}
							</motion.p>
						))}
					</section>

					{/* Signature Area */}
					<footer className='border-t border-white/10 pt-16 mt-auto'>
						<div className='flex flex-col gap-3'>
							<p className='text-[10px] font-black tracking-[0.5em] text-gray-500 uppercase'>
								{displayLetter.closing_text}
							</p>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 1 }}
								className='text-6xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-light)] to-[var(--color-secondary)]'
								style={{ fontFamily: 'var(--font-space)' }}
							>
								{displayLetter.signature_name}
							</motion.p>
						</div>
					</footer>
				</motion.article>

				{/* Footer Meta */}
				<div className='mt-16 text-center'>
					<p className='text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase'>
						SavvyOnChain — Cover Blueprint v1.0
					</p>
				</div>
			</div>
		</main>
	)
}
