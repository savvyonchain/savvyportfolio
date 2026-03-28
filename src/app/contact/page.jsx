'use client'

import { useState } from 'react'
import Script from 'next/script'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import {
	Send,
	CheckCircle,
	Loader2,
	Calendar,
	Mail,
	MessageCircle,
	X,
} from 'lucide-react'

// CALENDLY CONFIGURATION
const CALENDLY_URL = 'https://calendly.com/savvyonchain' // Replace with your actual Calendly link

const contactSchema = z.object({
	name: z.string().min(2, 'Name is too short'),
	email: z.string().email('Invalid email address'),
	message: z.string().min(10, 'Message must be at least 10 characters'),
})

export default function Contact() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(contactSchema),
	})

	const onSubmit = async (data) => {
		try {
			setIsSubmitting(true)
			const { error } = await supabase
				.from('contact_messages')
				.insert([{ ...data, created_at: new Date() }])

			if (error) throw error
			
			// Trigger Email Notification
			try {
				await fetch('/api/contact', {
					method: 'POST',
					body: JSON.stringify(data),
					headers: { 'Content-Type': 'application/json' }
				})
			} catch (notifErr) {
				console.warn('Email notification error:', notifErr)
			}

			setIsSuccess(true)
			toast.success('Message sent! I will get back to you soon.')
			reset()
			setTimeout(() => setIsSuccess(false), 5000)
		} catch (err) {
			console.error('Contact form error:', err)
			toast.error('Failed to send message. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className='max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20 min-h-[70vh]'>
			<Toaster position='bottom-right' />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className='mb-16 text-center'>
					<h1
						className='mb-6 text-3xl sm:text-4xl font-extrabold text-white md:text-5xl lg:text-7xl px-1 break-words'
						style={{ fontFamily: 'var(--font-space)' }}
					>
						Let&apos;s{' '}
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand)] via-[#d484ff] to-[#5c9fbb]'>
							Architect.
						</span>
					</h1>
					<p className='max-w-2xl mx-auto text-lg font-light text-gray-400'>
						Ready to delete manual work from your business? Reach out below or
						book a strategy session.
					</p>
				</div>

				<div className='grid gap-12 md:grid-cols-2 lg:gap-20'>
					{/* Contact Form */}
					<div className='p-5 sm:p-8 md:p-10 rounded-[1.75rem] sm:rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden min-w-0'>
						<div className='absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand)]/10 blur-[50px] rounded-full pointer-events-none' />

						<h2 className='flex items-center gap-3 mb-8 text-2xl font-bold text-white'>
							Send a Message{' '}
							<Send size={20} className='text-[var(--color-brand-light)]' />
						</h2>

						<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
							<div>
								<label className='block mb-2 text-sm font-semibold tracking-widest text-gray-400 uppercase'>
									Full Name
								</label>
								<input
									{...register('name')}
									type='text'
									className={`w-full px-6 py-4 bg-white/5 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand-soft)] outline-none transition-all placeholder-gray-600 text-white`}
									placeholder='Eg. Elon Musk'
								/>
								{errors.name && (
									<p className='mt-1 text-xs text-red-500'>
										{errors.name.message}
									</p>
								)}
							</div>

							<div>
								<label className='block mb-2 text-sm font-semibold tracking-widest text-gray-400 uppercase'>
									Email Address
								</label>
								<input
									{...register('email')}
									type='email'
									className={`w-full px-6 py-4 bg-white/5 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-white/10'} focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand-soft)] outline-none transition-all placeholder-gray-600 text-white`}
									placeholder='elon@x.com'
								/>
								{errors.email && (
									<p className='mt-1 text-xs text-red-500'>
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label className='block mb-2 text-sm font-semibold tracking-widest text-gray-400 uppercase'>
									Automation Goal
								</label>
								<textarea
									{...register('message')}
									rows='4'
									className={`w-full px-6 py-4 bg-white/5 rounded-2xl border ${errors.message ? 'border-red-500' : 'border-white/10'} focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand-soft)] outline-none transition-all placeholder-gray-600 text-white`}
									placeholder='Describe the manual task you want to eliminate...'
								></textarea>
								{errors.message && (
									<p className='mt-1 text-xs text-red-500'>
										{errors.message.message}
									</p>
								)}
							</div>

							<button
								disabled={isSubmitting}
								type='submit'
								className='w-full py-5 text-sm uppercase tracking-widest bg-white text-gray-900 font-extrabold rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2'
							>
								{isSubmitting ? (
									<Loader2 className='animate-spin' size={20} />
								) : isSuccess ? (
									<CheckCircle className='text-emerald-500' />
								) : (
									'Send Message'
								)}
							</button>
						</form>
					</div>

					{/* Booking & Socials Side */}
					<div className='flex flex-col gap-8'>
						<div className='p-5 sm:p-8 md:p-10 rounded-[1.75rem] sm:rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-center text-center relative overflow-hidden flex-1 min-w-0'>
							<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand opacity-20 blur-[80px] rounded-full pointer-events-none'></div>

							<Calendar
								size={48}
								className='mx-auto text-[var(--color-brand-light)] mb-6 animate-pulse'
							/>
							<h2 className='relative z-10 mb-4 text-3xl font-bold text-white'>
								Book a Direct Audit
							</h2>
							<p className='relative z-10 mb-10 font-light leading-relaxed text-gray-400'>
								Grab 30 minutes to review your operational bottlenecks.
								I&apos;ll build you a blueprint live on the call.
							</p>

							<button
								onClick={() => {
									if (window.Calendly) {
										window.Calendly.initPopupWidget({ url: CALENDLY_URL })
									} else {
										window.open(CALENDLY_URL, '_blank')
									}
								}}
								className='inline-block px-10 py-5 bg-[var(--color-brand)] text-white font-extrabold text-sm uppercase tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(108,59,137,0.6)] transition-all hover:scale-105 active:scale-95 text-center cursor-pointer'
							>
								Open Calendly <span className='ml-2'>→</span>
							</button>
						</div>

						{/* Quick Connect & Email Section */}
						<div className='flex flex-col gap-4'>
							{/* Social Links */}
							<div className='grid grid-cols-3 gap-4'>
								{[
									{
										name: 'Telegram',
										icon: <Send size={20} />,
										color: 'hover:bg-[#1a8ecd]/20 hover:border-[#1a8ecd]/40',
										textColor: 'hover:text-[#1a8ecd]',
										href: 'https://t.me/savvyonchain',
									},
									{
										name: 'X (Twitter)',
										icon: <X size={20} />,
										color: 'hover:bg-white/10 hover:border-white/30',
										textColor: 'hover:text-white',
										href: 'https://x.com/savvyonchain',
									},
									{
										name: 'WhatsApp',
										icon: <MessageCircle size={20} />,
										color:
											'hover:bg-emerald-500/20 hover:border-emerald-500/40',
										textColor: 'hover:text-emerald-400',
										href: 'https://wa.me/+2348144813123',
									},
								].map((social) => (
									<a
										key={social.name}
										href={social.href}
										target='_blank'
										rel='noopener noreferrer'
										className={`p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 transition-all ${social.color} ${social.textColor} group`}
										title={social.name}
									>
										{social.icon}
										<span className='text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity'>
											{social.name}
										</span>
									</a>
								))}
							</div>

							{/* Email Box */}
							<div className='p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-secondary/10 border border-secondary/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 group hover:border-[var(--color-brand)]/50 transition-all min-w-0'>
								<div className='flex items-center gap-4'>
									<div className='w-12 h-12 rounded-2xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 flex items-center justify-center text-[var(--color-brand-light)]'>
										<Mail size={22} />
									</div>
									<div className='flex flex-col text-left'>
										<p className='text-[10px] text-gray-500 uppercase tracking-widest font-bold'>
											Direct Contact
										</p>
										<p className='text-sm font-medium text-white'>
											savvyonchain@gmail.com
										</p>
									</div>
								</div>
								<button
									onClick={() => {
										navigator.clipboard.writeText('savvyonchain@gmail.com')
										toast.success('Email copied to clipboard!')
									}}
									className='p-2 text-gray-400 transition-all opacity-0 rounded-xl bg-white/5 group-hover:opacity-100 hover:bg-white/10 hover:text-white'
									title='Copy Email'
								>
									<svg
										width='16'
										height='16'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<rect
											x='9'
											y='9'
											width='13'
											height='13'
											rx='2'
											ry='2'
										></rect>
										<path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
									</svg>
								</button>
							</div>
						</div>

						<div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-8 border rounded-2xl sm:rounded-3xl bg-secondary/10 border-secondary/20'>
							<div className='flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400'>
								<span className='relative flex w-3 h-3'>
									<span className='absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400'></span>
									<span className='relative inline-flex w-3 h-3 rounded-full bg-emerald-500'></span>
								</span>
							</div>
							<div>
								<h4 className='font-bold text-white'>
									Currently Accepting Clients
								</h4>
								<p className='mt-1 text-xs tracking-widest text-gray-400 uppercase'>
									Typical Reply: &lt; 2 Hours
								</p>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
			<Script
				src='https://assets.calendly.com/assets/external/widget.js'
				strategy='lazyOnload'
			/>
			<link
				href='https://assets.calendly.com/assets/external/widget.css'
				rel='stylesheet'
			/>
		</section>
	)
}
