'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
	{ name: 'Home', href: '/' },
	{ name: 'Portfolio', href: '/projects' },
	{ name: 'About', href: '/about' },
	{ name: 'Letter', href: '/letter' },
	{ name: 'Contact', href: '/contact' },
]

export default function Navbar() {
	const pathname = usePathname()
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<nav className='sticky top-0 py-6 relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center'>
				<Link
					href='/'
					className='text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity text-white shrink-0'
					style={{ fontFamily: 'var(--font-space)' }}
				>
					Savvy<span className='text-[var(--color-brand)]'>.</span>
				</Link>

				<div className='hidden md:flex gap-8 items-center'>
					{navLinks.map((link) => {
						// Because home is "/", strict equality is best to avoid matching "/" everywhere.
						const isActive = pathname === link.href

						return (
							<Link
								key={link.name}
								href={link.href}
								className={`text-sm uppercase tracking-widest transition-all border-b-2 border-transparent ${
									isActive
										? 'text-white font-extrabold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] text-[var(--color-brand-light)] border-[var(--color-brand-light)] pb-1'
										: 'text-gray-400 font-medium hover:text-white pb-1 hover:border-white/30'
								}`}
							>
								{link.name}
							</Link>
						)
					})}
				</div>

				<button
					type='button'
					aria-expanded={mobileOpen}
					aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
					onClick={() => setMobileOpen((o) => !o)}
					className='w-10 h-10 rounded-full bg-white/10 text-white flex md:hidden items-center justify-center cursor-pointer hover:bg-[var(--color-brand)] transition-colors border border-white/20 shrink-0'
				>
					<span className='text-xs'>{mobileOpen ? '✕' : '☰'}</span>
				</button>
			</div>

			{mobileOpen && (
				<div className='md:hidden absolute left-0 right-0 top-full border-b border-white/10 bg-[#0a0612]/95 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1'>
						{navLinks.map((link) => {
							const isActive = pathname === link.href
							return (
								<Link
									key={link.name}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className={`py-3 px-3 rounded-xl text-sm uppercase tracking-widest transition-colors ${
										isActive
											? 'text-[var(--color-brand-light)] font-extrabold bg-white/5'
											: 'text-gray-400 font-medium hover:text-white hover:bg-white/5'
									}`}
								>
									{link.name}
								</Link>
							)
						})}
					</div>
				</div>
			)}
		</nav>
	)
}
