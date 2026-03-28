'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Send, MessageCircle, X, Calendar, ChevronRight } from 'lucide-react'

export default function Footer() {
	const currentYear = new Date().getFullYear()

	const contactPoints = [
		{
			name: 'Telegram',
			icon: <Send size={18} />,
			href: 'https://t.me/savvyonchain',
			color: 'hover:text-[#26A5E4]',
		},
		{
			name: 'WhatsApp',
			icon: <MessageCircle size={18} />,
			href: 'https://wa.me/+2348144813123',
			color: 'hover:text-[#25D366]',
		},
		{
			name: 'X (Twitter)',
			icon: <X size={18} />,
			href: 'https://x.com/savvyonchain',
			color: 'hover:text-white',
		},
		{
			name: 'Email',
			icon: <Mail size={18} />,
			href: 'mailto:savvyonchain@gmail.com',
			color: 'hover:text-[var(--color-brand-light)]',
		},
	]

	return (
		<footer className='relative z-10 w-full pt-20 pb-12 overflow-hidden border-t border-white/5 bg-black/20 backdrop-blur-xl'>
			{/* Ambient background glow */}
			<div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vw] bg-[var(--color-brand)]/5 blur-[100px] rounded-full pointer-events-none' />

			<div className='max-w-7xl mx-auto px-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
					{/* Brand Column */}
					<div className='flex flex-col gap-6'>
						<Link href='/' className='text-2xl font-black text-white' style={{ fontFamily: 'var(--font-space)' }}>
							Savvy<span className='text-[var(--color-brand)]'>.</span>
						</Link>
						<p className='text-sm text-gray-500 leading-relaxed max-w-[200px]'>
							Architecting zero-touch business operations through code and smart automation.
						</p>
					</div>

					{/* Contact Means */}
					<div className='flex flex-col gap-6'>
						<h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-light)]'>
							Quick Connect
						</h4>
						<div className='flex flex-wrap gap-4'>
							{contactPoints.map((point) => (
								<a
									key={point.name}
									href={point.href}
									target='_blank'
									rel='noopener noreferrer'
									className={`p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all ${point.color} hover:border-white/20 hover:scale-110`}
									title={point.name}
								>
									{point.icon}
								</a>
							))}
						</div>
					</div>

					{/* Navigation Links */}
					<div className='flex flex-col gap-6'>
						<h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-light)]'>
							Navigation
						</h4>
						<div className='flex flex-col gap-3'>
							<Link href='/about' className='text-xs text-gray-500 hover:text-white transition-colors'>About Experience</Link>
							<Link href='/projects' className='text-xs text-gray-500 hover:text-white transition-colors'>Case Studies</Link>
							<Link href='/contact' className='text-xs text-gray-500 hover:text-white transition-colors'>Book Audit</Link>
						</div>
					</div>

					{/* Direct Action */}
					<div className='flex flex-col gap-6'>
						<h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-light)]'>
							Current Status
						</h4>
						<div className='p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='relative flex w-2 h-2'>
									<span className='absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400'></span>
									<span className='relative inline-flex w-2 h-2 rounded-full bg-emerald-500'></span>
								</div>
								<p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Accepting Clients</p>
							</div>
							<Link href='/contact' className='text-[10px] font-black text-emerald-400 hover:underline'>CONTACT</Link>
						</div>
					</div>
				</div>

				<div className='pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4'>
					<p className='text-[10px] text-gray-600 font-bold uppercase tracking-widest'>
						© {currentYear} SavvyOnChain. All Rights Reserved.
					</p>
					<div className='flex items-center gap-6'>
						<p className='text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2'>
							Designed for <span className='text-white'>Performance</span>
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}
