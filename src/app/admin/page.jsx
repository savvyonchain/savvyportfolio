'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
	Trash2,
	Edit,
	LayoutDashboard,
	MessageSquare,
	LogOut,
	X,
	PlusCircle,
	FolderKanban,
	Save,
	Loader2,
	Settings,
	Upload,
	Code,
	Zap,
	RotateCcw,
	Briefcase,
	Star,
} from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

const GRADIENT_PAIRS = [
	{ start: '#F53844', end: '#42378F' },
	{ start: '#43CBFF', end: '#9708CC' },
	{ start: '#F97794', end: '#623AA2' },
	{ start: '#81FFEF', end: '#F067B4' },
	{ start: '#F6CEEC', end: '#D939CD' },
	{ start: '#5EE7DF', end: '#B490CA' },
	{ start: '#FF61D2', end: '#FE9090' },
	{ start: '#3B2667', end: '#BC78EC' },
	{ start: '#00C9FF', end: '#92FE9D' },
	{ start: '#F093FB', end: '#F5576C' },
	{ start: '#12c2e9', end: '#f64f59' },
	{ start: '#b92b27', end: '#1565C0' },
	{ start: '#11998e', end: '#38ef7d' },
	{ start: '#FC466B', end: '#3F5EFB' },
	{ start: '#f857a6', end: '#ff5858' },
]

const getRandomGradientPair = () => GRADIENT_PAIRS[Math.floor(Math.random() * GRADIENT_PAIRS.length)];

export default function AdminPanel() {
	const [activeTab, setActiveTab] = useState('projects')
	const [session, setSession] = useState(null)
	const [loading, setLoading] = useState(true)

	// Projects state
	const [projects, setProjects] = useState([])
	const [editingProject, setEditingProject] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [saving, setSaving] = useState(false)
	const [selectedFiles, setSelectedFiles] = useState({
		screenshot: null,
		video: null,
	})
	const [randomGradient, setRandomGradient] = useState({ start: '#6c3b89', end: '#bf55ec' })

	const [screenshotInputs, setScreenshotInputs] = useState([]);

	// Messages state
	const [messages, setMessages] = useState([])

	// Skills state
	const [skills, setSkills] = useState([])
	const [editingSkill, setEditingSkill] = useState(null)
	const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)

	// Tools state
	const [tools, setTools] = useState([])
	const [editingTool, setEditingTool] = useState(null)
	const [isToolModalOpen, setIsToolModalOpen] = useState(false)

	// Services state
	const [services, setServices] = useState([])
	const [editingService, setEditingService] = useState(null)
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)

	// Process state
	const [processSteps, setProcessSteps] = useState([])
	const [editingProcess, setEditingProcess] = useState(null)
	const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)

	// Experience state
	const [experience, setExperience] = useState([])
	const [editingExperience, setEditingExperience] = useState(null)
	const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false)

	// Testimonials state
	const [testimonials, setTestimonials] = useState([])
	const [editingTestimonial, setEditingTestimonial] = useState(null)
	const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)

	// Letter state
	const [letter, setLetter] = useState(null)
	const [savingLetter, setSavingLetter] = useState(false)

	useEffect(() => {
		checkSession()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Lock scroll when any modal is open
	useEffect(() => {
		const isAnyModalOpen =
			isModalOpen ||
			isSkillModalOpen ||
			isToolModalOpen ||
			isServiceModalOpen ||
			isProcessModalOpen ||
			isExperienceModalOpen ||
			isTestimonialModalOpen
		if (isAnyModalOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [
		isModalOpen,
		isSkillModalOpen,
		isToolModalOpen,
		isServiceModalOpen,
		isProcessModalOpen,
		isExperienceModalOpen,
		isTestimonialModalOpen,
	])

	useEffect(() => {
		if (isModalOpen) {
			if (editingProject?.screenshot_url) {
				const urls = editingProject.screenshot_url.split(',').map(s => s.trim()).filter(Boolean);
				setScreenshotInputs(urls.map(url => ({ type: 'link', url })));
			} else {
				setScreenshotInputs([]);
			}
		}
	}, [isModalOpen, editingProject]);

	const checkSession = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession()
		setSession(session)
		setLoading(false)
		if (session) {
			loadData()
		}
	}

	const loadData = async () => {
		const { data: proj } = await supabase
			.from('projects')
			.select('*')
			.order('order_index')
		const { data: msg } = await supabase
			.from('contact_messages')
			.select('*')
			.order('created_at', { ascending: false })
		const { data: sk } = await supabase
			.from('skills')
			.select('*')
			.order('order_index')
		const { data: tl } = await supabase
			.from('tools')
			.select('*')
			.order('order_index')
		const { data: sv } = await supabase
			.from('services')
			.select('*')
			.order('order_index')
		const { data: pr } = await supabase
			.from('process_steps')
			.select('*')
			.order('order_index')
		const { data: ex } = await supabase
			.from('experience')
			.select('*')
			.order('order_index')
		const { data: ts } = await supabase
			.from('testimonials')
			.select('*')
			.order('order_index')

		const { data: lt, error: ltError } = await supabase
			.from('cover_letter')
			.select('*')
			.eq('is_active', true)
			.order('updated_at', { ascending: false })
			.limit(1)
			.maybeSingle()

		setProjects(proj || [])
		setMessages(msg || [])
		setSkills(sk || [])
		setTools(tl || [])
		setServices(sv || [])
		setProcessSteps(pr || [])
		setExperience(ex || [])
		setTestimonials(ts || [])
		setLetter(
			lt || { title: '', content: '', closing_text: '', signature_name: '' },
		)
	}

	const handleFileUpload = async (file, path) => {
		try {
			const fileName = `${Date.now()}_${file.name}`
			const { data, error } = await supabase.storage
				.from('portfolio-media')
				.upload(`${path}/${fileName}`, file)

			if (error) throw error

			const {
				data: { publicUrl },
			} = supabase.storage.from('portfolio-media').getPublicUrl(data.path)

			return publicUrl
		} catch (err) {
			toast.error('Upload failed: ' + err.message)
			return null
		}
	}

	const deleteStorageFile = async (url) => {
		try {
			if (!url || typeof url !== 'string') return;
			const parts = new URL(url).pathname.split('/');
			const idx = parts.indexOf('portfolio-media');
			if (idx !== -1) {
				const path = decodeURIComponent(parts.slice(idx + 1).join('/'));
				await supabase.storage.from('portfolio-media').remove([path]);
			}
		} catch (e) {
			console.error('Failed to parse URL for storage cleanup');
		}
	}

	const handleDeleteProject = async (id) => {
		if (!confirm('Are you sure?')) return
		
		const projectToDelete = projects.find(p => p.id === id);
		const { error } = await supabase.from('projects').delete().eq('id', id)
		
		if (!error) {
			if (projectToDelete) {
				if (projectToDelete.screenshot_url) {
					const urls = projectToDelete.screenshot_url.split(',').map(u => u.trim()).filter(Boolean);
					for (const url of urls) await deleteStorageFile(url);
				}
				if (projectToDelete.video_url) await deleteStorageFile(projectToDelete.video_url);
			}
			toast.success('Project removed')
			loadData()
		}
	}

	const handleAction = async (
		table,
		formData,
		editingItem,
		setModalOpen,
		setEditingItem,
	) => {
		setSaving(true)
		try {
			const isUpdate = !!editingItem
			const { error } = isUpdate
				? await supabase.from(table).update(formData).eq('id', editingItem.id)
				: await supabase.from(table).insert([formData])

			if (error) throw error
			toast.success(`${table.slice(0, -1)} ${isUpdate ? 'updated' : 'added'}`)
			loadData()
			setModalOpen(false)
			setEditingItem(null)
		} catch (err) {
			toast.error(err.message)
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async (table, id) => {
		if (!confirm('Are you sure?')) return
		
		// Find the target to grab images to cleanly delete before wiping the row
		let targetItem = null;
		if (table === 'tools') targetItem = tools.find(t => t.id === id);
		if (table === 'testimonials') targetItem = testimonials.find(t => t.id === id);

		const { error } = await supabase.from(table).delete().eq('id', id)
		if (!error) {
			if (targetItem?.image_url) await deleteStorageFile(targetItem.image_url);
			if (targetItem?.avatar_url) await deleteStorageFile(targetItem.avatar_url);

			toast.success('Item removed')
			loadData()
		}
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		const email = e.target.email.value
		const password = e.target.password.value
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			toast.error(error.message)
		} else {
			checkSession()
		}
	}

	const handleLogout = async () => {
		await supabase.auth.signOut()
		setSession(null)
	}

	if (loading)
		return (
			<div className='min-h-screen flex items-center justify-center bg-[#0A0612] text-white'>
				Loading...
			</div>
		)

	if (!session) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-[#0A0612] p-8'>
				<Toaster />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='w-full max-w-md p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl'
				>
					<div className='w-16 h-16 rounded-2xl bg-[var(--color-brand)]/20 flex items-center justify-center text-[var(--color-brand)] mb-8 mx-auto'>
						<Settings size={32} />
					</div>
					<h1
						className='mb-2 text-3xl font-extrabold text-center text-white'
						style={{ fontFamily: 'var(--font-space)' }}
					>
						Admin Portal
					</h1>
					<p className='mb-8 text-sm tracking-widest text-center text-gray-400 uppercase'>
						Authorized Access Only
					</p>

					<form className='space-y-6' onSubmit={handleLogin}>
						<input
							name='email'
							type='email'
							placeholder='Email'
							className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)] text-white'
						/>
						<input
							name='password'
							type='password'
							placeholder='Password'
							className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)] text-white'
						/>
						<button className='w-full py-5 bg-[var(--color-brand)] text-white font-bold rounded-2xl hover:bg-[var(--color-brand-light)] transition-all uppercase tracking-widest'>
							Unlock Panel
						</button>
					</form>

					<p className='text-gray-500 text-[10px] text-center mt-10 tracking-widest uppercase opacity-50'>
						SavvyOnChain Portfolio Systems v1.0
					</p>
				</motion.div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-[#0A0612] flex flex-col md:flex-row text-white'>
			<Toaster />

			{/* Sidebar */}
			<aside className='w-full md:w-72 border-r border-white/5 p-8 flex flex-col gap-10 bg-[#05030A]'>
				<div className='flex items-center gap-4'>
					<div className='w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-brand)] to-[#d484ff]' />
					<div>
						<h3 className='text-lg font-bold'>Savvy</h3>
						<p className='text-[10px] text-[var(--color-brand-light)] uppercase font-black'>
							Architect
						</p>
					</div>
				</div>

				<nav className='flex flex-col flex-1 gap-2'>
					<button
						onClick={() => setActiveTab('projects')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'projects' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<FolderKanban size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Projects
						</span>
					</button>
					<button
						onClick={() => setActiveTab('messages')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'messages' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<MessageSquare size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Messages
						</span>
					</button>
					<button
						onClick={() => setActiveTab('skills')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'skills' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<Code size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Skills
						</span>
					</button>
					<button
						onClick={() => setActiveTab('tools')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'tools' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<Zap size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Tools
						</span>
					</button>
					<button
						onClick={() => setActiveTab('services')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'services' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<LayoutDashboard size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Services
						</span>
					</button>
					<button
						onClick={() => setActiveTab('process')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'process' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<RotateCcw size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Process
						</span>
					</button>
					<button
						onClick={() => setActiveTab('experience')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'experience' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<Briefcase size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Exp
						</span>
					</button>
					<button
						onClick={() => setActiveTab('testimonials')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'testimonials' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<Star size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Reviews
						</span>
					</button>
					<button
						onClick={() => setActiveTab('letter')}
						className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'letter' ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
					>
						<Briefcase size={20} />{' '}
						<span className='text-sm font-bold tracking-widest uppercase'>
							Letter
						</span>
					</button>
				</nav>

				<button
					onClick={handleLogout}
					className='flex items-center gap-4 px-6 py-4 text-red-400 transition-all border border-transparent rounded-2xl hover:bg-red-400/10 hover:border-red-400/20'
				>
					<LogOut size={20} />{' '}
					<span className='text-sm font-bold tracking-widest uppercase'>
						Logout
					</span>
				</button>
			</aside>

			{/* Main Content */}
			<main className='flex-1 p-8 overflow-y-auto md:p-16'>
				{activeTab === 'projects' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									Managing Portfolio
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									Customizing the 3D Case Study Modules
								</p>
							</div>
							<button
								onClick={() => {
									setEditingProject(null)
									setSelectedFiles({ screenshot: null, video: null })
									setRandomGradient(getRandomGradientPair())
									setIsModalOpen(true)
								}}
								className='px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all'
							>
								<PlusCircle size={20} /> Add Project
							</button>
						</div>

						<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
							{projects.map((proj) => (
								<div
									key={proj.id}
									className='p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group'
								>
									<div className='flex items-center gap-6'>
										<div
											className='flex items-center justify-center w-16 h-16 rounded-2xl'
											style={{
												background: `linear-gradient(135deg, ${proj.gradient_start}, ${proj.gradient_end})`,
											}}
										>
											<LayoutDashboard size={24} />
										</div>
										<div>
											<h3 className='text-xl font-extrabold text-white'>
												{proj.title}
											</h3>
											<p className='text-xs font-bold tracking-widest text-gray-500 uppercase'>
												{proj.angle}
											</p>
										</div>
									</div>
									<div className='flex gap-3 transition-all opacity-0 group-hover:opacity-100'>
										<button
											onClick={() => {
												setEditingProject(proj)
												setSelectedFiles({ screenshot: null, video: null })
												setIsModalOpen(true)
											}}
											className='flex items-center justify-center w-10 h-10 transition-all border rounded-xl bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 border-white/10'
										>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handleDeleteProject(proj.id)}
											className='flex items-center justify-center w-10 h-10 transition-all border rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 border-white/10'
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'messages' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<h1
							className='mb-12 text-4xl font-extrabold'
							style={{ fontFamily: 'var(--font-space)' }}
						>
							Inbound Inquiries
						</h1>
						<div className='space-y-6'>
							{messages.length === 0 && (
								<p className='text-gray-500'>No messages yet.</p>
							)}
							{messages.map((msg) => (
								<div
									key={msg.id}
									className='p-8 rounded-[2rem] bg-white/5 border border-white/10'
								>
									<div className='flex items-start justify-between mb-6'>
										<div>
											<h3 className='text-2xl font-bold text-white'>
												{msg.name}
											</h3>
											<p className='text-[#5c9fbb] font-medium'>{msg.email}</p>
										</div>
										<span className='text-[10px] text-gray-500 font-bold uppercase py-1 px-3 bg-white/5 rounded-full border border-white/10'>
											{new Date(msg.created_at).toLocaleDateString()}
										</span>
									</div>
									<p className='p-6 italic font-light leading-relaxed text-gray-300 bg-black/20 rounded-2xl'>
										&quot;{msg.message}&quot;
									</p>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'skills' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									My Skills
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									Manage your expertise
								</p>
							</div>
							<button
								onClick={() => {
									setEditingSkill(null)
									setIsSkillModalOpen(true)
								}}
								className='px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all'
							>
								<PlusCircle size={20} /> Add Skill
							</button>
						</div>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
							{skills.map((sk) => (
								<div
									key={sk.id}
									className='flex items-center justify-between p-6 border rounded-3xl bg-white/5 border-white/10 group'
								>
									<div className='flex items-center gap-4'>
										<div
											className='flex items-center justify-center w-10 h-10 font-bold rounded-xl'
											style={{
												backgroundColor: sk.accent_color + '20',
												color: sk.accent_color,
											}}
										>
											{sk.name.slice(0, 1)}
										</div>
										<span className='font-bold'>{sk.name}</span>
									</div>
									<div className='flex gap-2 transition-all opacity-0 group-hover:opacity-100'>
										<button
											onClick={() => {
												setEditingSkill(sk)
												setIsSkillModalOpen(true)
											}}
											className='p-2 hover:text-blue-400'
										>
											<Edit size={16} />
										</button>
										<button
											onClick={() => handleDelete('skills', sk.id)}
											className='p-2 hover:text-red-400'
										>
											<Trash2 size={16} />
										</button>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'tools' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									My Tools
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									Stack & Software
								</p>
							</div>
							<button
								onClick={() => {
									setEditingTool(null)
									setIsToolModalOpen(true)
								}}
								className='px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all'
							>
								<PlusCircle size={20} /> Add Tool
							</button>
						</div>
						<div className='grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6'>
							{tools.map((tl) => (
								<div
									key={tl.id}
									className='relative flex flex-col items-center p-6 border rounded-3xl bg-white/5 border-white/10 group'
								>
									{tl.image_url ? (
										<img
											src={tl.image_url}
											alt={tl.name}
											className='object-contain w-12 h-12 mb-4'
										/>
									) : (
										<div className='flex items-center justify-center w-12 h-12 mb-4 bg-white/10 rounded-xl'>
											<Zap size={24} />
										</div>
									)}
									<span className='text-xs font-bold tracking-wider text-center uppercase'>
										{tl.name}
									</span>
									<div className='absolute flex gap-1 transition-all opacity-0 top-2 right-2 group-hover:opacity-100'>
										<button
											onClick={() => {
												setEditingTool(tl)
												setIsToolModalOpen(true)
											}}
											className='p-1 hover:text-blue-400'
										>
											<Edit size={12} />
										</button>
										<button
											onClick={() => handleDelete('tools', tl.id)}
											className='p-1 hover:text-red-400'
										>
											<Trash2 size={12} />
										</button>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'services' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									Services
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									Manage what you offer
								</p>
							</div>
							<button
								onClick={() => {
									setEditingService(null)
									setIsServiceModalOpen(true)
								}}
								className='px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all'
							>
								<PlusCircle size={20} /> Add Service
							</button>
						</div>
						<div className='space-y-4'>
							{services.map((sv) => (
								<div
									key={sv.id}
									className='p-8 rounded-[2rem] bg-white/5 border border-white/10 flex justify-between items-center group'
								>
									<div>
										<h3 className='mb-2 text-xl font-bold'>{sv.title}</h3>
										<p className='text-sm text-gray-400'>
											{sv.description.slice(0, 100)}...
										</p>
									</div>
									<div className='flex gap-3 transition-all opacity-0 group-hover:opacity-100'>
										<button
											onClick={() => {
												setEditingService(sv)
												setIsServiceModalOpen(true)
											}}
											className='flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-500/10'
										>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handleDelete('services', sv.id)}
											className='flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10'
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'process' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									Service Design Process
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									Mapping the architecture
								</p>
							</div>
							<button
								onClick={() => {
									setEditingProcess(null)
									setIsProcessModalOpen(true)
								}}
								className='px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all'
							>
								<PlusCircle size={20} /> Add Step
							</button>
						</div>
						<div className='space-y-4'>
							{processSteps.map((pr) => (
								<div
									key={pr.id}
									className='p-8 rounded-[2rem] bg-white/5 border border-white/10 flex justify-between items-center group'
								>
									<div className='flex items-center gap-8'>
										<span className='text-4xl font-black text-white/10'>
											{pr.step_number}
										</span>
										<div>
											<h3 className='mb-1 text-xl font-bold'>{pr.title}</h3>
											<p className='text-sm text-gray-500'>{pr.description}</p>
										</div>
									</div>
									<div className='flex gap-3 transition-all opacity-0 group-hover:opacity-100'>
										<button
											onClick={() => {
												setEditingProcess(pr)
												setIsProcessModalOpen(true)
											}}
											className='flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-500/10'
										>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handleDelete('process_steps', pr.id)}
											className='flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10'
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'experience' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									Professional History
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									Your career timeline
								</p>
							</div>
							<button
								onClick={() => {
									setEditingExperience(null)
									setIsExperienceModalOpen(true)
								}}
								className='px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all'
							>
								<PlusCircle size={20} /> Add Exp
							</button>
						</div>
						<div className='space-y-4'>
							{experience.map((ex) => (
								<div
									key={ex.id}
									className='p-8 rounded-[2rem] bg-white/5 border border-white/10 flex justify-between items-center group'
								>
									<div>
										<h3 className='mb-1 text-xl font-bold'>{ex.company}</h3>
										<p className='text-[var(--color-brand-light)] font-bold mb-2'>
											{ex.role} • {ex.period}
										</p>
										<p className='text-sm text-gray-500'>
											{ex.description.slice(0, 100)}...
										</p>
									</div>
									<div className='flex gap-3 transition-all opacity-0 group-hover:opacity-100'>
										<button
											onClick={() => {
												setEditingExperience(ex)
												setIsExperienceModalOpen(true)
											}}
											className='flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-500/10'
										>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handleDelete('experience', ex.id)}
											className='flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10'
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'testimonials' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									Client Reviews
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									What clients are saying
								</p>
							</div>
							<button
								onClick={() => {
									setEditingTestimonial(null)
									setIsTestimonialModalOpen(true)
								}}
								className='px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all'
							>
								<PlusCircle size={20} /> Add Review
							</button>
						</div>
						<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
							{testimonials.map((ts) => (
								<div
									key={ts.id}
									className='p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex justify-between items-start group relative'
								>
									<div className='flex-1'>
										<p className='mb-6 italic text-gray-300'>
											&quot;{ts.quote}&quot;
										</p>
										<div>
											<h4 className='font-bold text-white'>{ts.name}</h4>
											<p className='text-xs text-gray-500'>{ts.role}</p>
										</div>
									</div>
									<div className='flex gap-2 ml-4 transition-all opacity-0 group-hover:opacity-100'>
										<button
											onClick={() => {
												setEditingTestimonial(ts)
												setIsTestimonialModalOpen(true)
											}}
											className='p-2 hover:text-blue-400'
										>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handleDelete('testimonials', ts.id)}
											className='p-2 hover:text-red-400'
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{activeTab === 'letter' && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<div className='flex items-center justify-between mb-12'>
							<div>
								<h1
									className='mb-2 text-4xl font-extrabold'
									style={{ fontFamily: 'var(--font-space)' }}
								>
									Cover Blueprint
								</h1>
								<p className='text-sm font-light tracking-widest text-gray-500 uppercase'>
									Customize your professional cover letter
								</p>
							</div>
							<button
								onClick={async () => {
									setSavingLetter(true)
									try {
										const payload = {
											...letter,
											is_active: true,
											updated_at: new Date(),
										}
										let error
										if (letter.id) {
											const { error: updateError } = await supabase
												.from('cover_letter')
												.update(payload)
												.eq('id', letter.id)
											error = updateError
										} else {
											const { error: insertError } = await supabase
												.from('cover_letter')
												.insert([payload])
											error = insertError
										}

										if (error) throw error
										toast.success('Letter successfully updated!')
										loadData()
									} catch (err) {
										toast.error('Save failed: ' + err.message)
									} finally {
										setSavingLetter(false)
									}
								}}
								disabled={savingLetter || !letter}
								className='px-10 py-4 bg-[var(--color-brand)] text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl disabled:opacity-50'
							>
								{savingLetter ? (
									<Loader2 className='animate-spin' size={20} />
								) : (
									<Save size={20} />
								)}
								Publish Letter
							</button>
						</div>

						{letter ? (
							<div className='max-w-4xl p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-10'>
								<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
									<div className='space-y-3'>
										<label className='text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase ml-2'>
											Greeting / Title
										</label>
										<input
											type='text'
											value={letter.title || ''}
											onChange={(e) =>
												setLetter({ ...letter, title: e.target.value })
											}
											className='w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--color-brand)] transition-all'
											placeholder='To My Next Team,'
										/>
									</div>
									<div className='space-y-3'>
										<label className='text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase ml-2'>
											Closing Remark
										</label>
										<input
											type='text'
											value={letter.closing_text || ''}
											onChange={(e) =>
												setLetter({ ...letter, closing_text: e.target.value })
											}
											className='w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--color-brand)] transition-all'
											placeholder='Warmly,'
										/>
									</div>
								</div>

								<div className='space-y-3'>
									<label className='text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase ml-2'>
										Letter Body
									</label>
									<textarea
										rows='15'
										value={letter.content || ''}
										onChange={(e) =>
											setLetter({ ...letter, content: e.target.value })
										}
										className='w-full px-8 py-8 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:border-[var(--color-brand)] transition-all leading-relaxed custom-scrollbar'
										placeholder='Write your heart out...'
									/>
								</div>

								<div className='max-w-sm space-y-3'>
									<label className='text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase ml-2'>
										Signature Name
									</label>
									<input
										type='text'
										value={letter.signature_name || ''}
										onChange={(e) =>
											setLetter({ ...letter, signature_name: e.target.value })
										}
										className='w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--color-brand)] transition-all'
										placeholder='Savvy'
									/>
								</div>
							</div>
						) : (
							<div className='flex justify-center p-20'>
								<Loader2
									className='animate-spin text-[var(--color-brand)]'
									size={48}
								/>
							</div>
						)}
					</motion.div>
				)}
			</main>

			{/* Project Modal (Existing) */}
			<AnimatePresence>
				{isModalOpen && (
					<div className='fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md overflow-y-auto'>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='w-full max-w-4xl bg-[#0A0612] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl my-auto'
						>
							<div className='flex items-center justify-between mb-10'>
								<h2 className='text-3xl font-bold tracking-tight'>
									{editingProject ? 'Modify Project' : 'New Project'}
								</h2>
								<button
									onClick={() => setIsModalOpen(false)}
									className='text-gray-500 transition-colors hover:text-white'
								>
									<X size={32} />
								</button>
							</div>
							<form
								className='grid grid-cols-1 gap-8 md:grid-cols-2'
								onSubmit={async (e) => {
									e.preventDefault()
									setSaving(true)
									try {
										const fd = new FormData(e.currentTarget)
										const outcomesString = fd.get('outcomes')
										const outcomes = outcomesString
											? outcomesString.split('\n').filter(Boolean)
											: []
										const payload = Object.fromEntries(fd.entries())
										payload.outcomes = outcomes

										// Handle multiple dynamic screenshots
										const urlItems = fd.getAll('screenshot_urls_array')
										const fileItems = fd.getAll('screenshot_files_array')
										const videoFile = fd.get('video_file')

										let urls = []
										
										// Parse manually added links (split by comma just in case they pasted a list)
										for (const urlStr of urlItems) {
											if (urlStr && typeof urlStr === 'string') {
												const splitUrls = urlStr.split(',').map(s => s.trim()).filter(Boolean)
												urls.push(...splitUrls)
											}
										}
										
										// Upload natively selected files
										for (let file of fileItems) {
											if (file instanceof File && file.size > 0) {
												const uploadedUrl = await handleFileUpload(file, 'images')
												if (uploadedUrl) urls.push(uploadedUrl.trim())
											}
										}
										
										if (urls.length > 0) {
											payload.screenshot_url = urls.join(',')
										} else {
											payload.screenshot_url = ''
										}

										if (
											videoFile &&
											videoFile instanceof File &&
											videoFile.size > 0
										) {
											const url = await handleFileUpload(videoFile, 'videos')
											if (url) payload.video_url = url
										}

										delete payload.screenshot_urls_array
										delete payload.screenshot_files_array
										delete payload.video_file

										await handleAction(
											'projects',
											payload,
											editingProject,
											setIsModalOpen,
											setEditingProject,
										)
									} catch (err) {
										toast.error('Deployment failed: ' + err.message)
									} finally {
										setSaving(false)
									}
								}}
							>
								<div className='space-y-6'>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Title
										</label>
										<input
											name='title'
											defaultValue={editingProject?.title}
											required
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
											placeholder='E.g. E-Com Automation'
										/>
									</div>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Angle
										</label>
										<input
											name='angle'
											defaultValue={editingProject?.angle}
											required
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
											placeholder='E.g. E-Commerce'
										/>
									</div>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Category
										</label>
										<input
											name='category'
											defaultValue={editingProject?.category}
											required
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
											placeholder='E.g. Shopify / Make.com'
										/>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
												Color Start
											</label>
											<input
												name='gradient_start'
												defaultValue={
													editingProject?.gradient_start || randomGradient.start
												}
												className='w-full px-4 py-3 border bg-white/5 rounded-2xl border-white/10'
											/>
										</div>
										<div>
											<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
												Color End
											</label>
											<input
												name='gradient_end'
												defaultValue={editingProject?.gradient_end || randomGradient.end}
												className='w-full px-4 py-3 border bg-white/5 rounded-2xl border-white/10'
											/>
										</div>
									</div>
									<div className='p-6 border bg-white/5 rounded-2xl border-white/10 md:col-span-2'>
										<div className='flex justify-between items-center mb-4'>
											<label className='block text-xs font-black tracking-widest text-gray-500 uppercase'>
												Portfolio Screenshots
											</label>
											<div className='flex gap-2 relative'>
												<button type='button' onClick={() => setScreenshotInputs([...screenshotInputs, { type: 'link', url: '' }])} className='text-xs px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors'>+ Add Link</button>
												<button type='button' onClick={() => setScreenshotInputs([...screenshotInputs, { type: 'file' }])} className='text-xs px-3 py-1 bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] rounded hover:bg-[var(--color-brand)]/40 transition-colors'>+ Upload File</button>
											</div>
										</div>

										<div className='space-y-3'>
											{screenshotInputs.length === 0 && <p className='text-xs text-gray-500 italic'>No screenshots added. Click above to add some.</p>}
											{screenshotInputs.map((input, idx) => (
												<div key={idx} className='flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl'>
													{input.type === 'link' ? (
														<input
															name='screenshot_urls_array'
															defaultValue={input.url}
															className='flex-1 w-full px-4 py-2 border bg-white/5 border-white/10 rounded-lg outline-none focus:border-[var(--color-brand)]'
															placeholder='https://your-image-link.com/img.png'
														/>
													) : (
														<div className='flex items-center gap-2 flex-1 w-full'>
															<Upload size={16} className='text-gray-500' />
															<input
																type='file'
																name='screenshot_files_array'
																accept='image/*'
																multiple
																className='flex-1 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-[var(--color-brand)] file:text-white hover:file:bg-[var(--color-brand-light)]'
															/>
														</div>
													)}
													<button type='button' onClick={() => setScreenshotInputs(screenshotInputs.filter((_, i) => i !== idx))} className='p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors'>
														<X size={16} />
													</button>
												</div>
											))}
										</div>
									</div>
									<div className='p-6 border bg-white/5 rounded-2xl border-white/10'>
										<label className='block mb-3 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Video (Link or Upload)
										</label>
										<div className='space-y-4'>
											<input
												name='video_url'
												defaultValue={editingProject?.video_url}
												className='flex-1 w-full px-4 py-3 mb-2 border bg-white/5 border-white/10 rounded-xl'
												placeholder='HTTPS Link...'
											/>
											<div className='flex items-center gap-4 p-4 border bg-white/5 rounded-xl border-white/5'>
												<Upload size={16} className='text-gray-500' />
												<input
													type='file'
													name='video_file'
													accept='video/*'
													className='text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-[var(--color-brand)] file:text-white hover:file:bg-[var(--color-brand-light)]'
												/>
											</div>
										</div>
									</div>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Order
										</label>
										<input
											name='order_index'
											type='number'
											defaultValue={editingProject?.order_index || 0}
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
										/>
									</div>
								</div>
								<div className='space-y-6'>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Description
										</label>
										<textarea
											name='description'
											defaultValue={editingProject?.description}
											required
											rows='3'
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
										></textarea>
									</div>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											The Problem
										</label>
										<textarea
											name='problem'
											defaultValue={editingProject?.problem}
											required
											rows='3'
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
										></textarea>
									</div>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Your Solution
										</label>
										<textarea
											name='solution'
											defaultValue={editingProject?.solution}
											required
											rows='3'
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
										></textarea>
									</div>
									<div>
										<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
											Outcomes (lines)
										</label>
										<textarea
											name='outcomes'
											defaultValue={editingProject?.outcomes?.join('\n')}
											required
											rows='3'
											className='w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-[var(--color-brand)]'
										></textarea>
									</div>
								</div>
								<div className='flex justify-end gap-5 pt-8 mt-4 border-t md:col-span-2 border-white/10'>
									<button
										type='button'
										onClick={() => setIsModalOpen(false)}
										className='px-8 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-white'
									>
										Cancel
									</button>
									<button
										type='submit'
										disabled={saving}
										className='flex items-center gap-2 px-12 py-4 text-xs font-black tracking-widest text-gray-900 uppercase transition-all bg-white rounded-2xl hover:shadow-2xl'
									>
										{saving ? (
											<Loader2 className='animate-spin' size={20} />
										) : (
											<>
												<Save size={20} /> Deploy
											</>
										)}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Skill Modal */}
			<AnimatePresence>
				{isSkillModalOpen && (
					<div className='fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md'>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='w-full max-w-md bg-[#0A0612] border border-white/10 rounded-[2.5rem] p-10'
						>
							<h2 className='mb-8 text-2xl font-bold'>
								{editingSkill ? 'Edit Skill' : 'New Skill'}
							</h2>
							<form
								className='space-y-6'
								onSubmit={(e) => {
									e.preventDefault()
									const fd = new FormData(e.currentTarget)
									handleAction(
										'skills',
										Object.fromEntries(fd.entries()),
										editingSkill,
										setIsSkillModalOpen,
										setEditingSkill,
									)
								}}
							>
								<input
									name='name'
									defaultValue={editingSkill?.name}
									placeholder='Skill Name (e.g. Frontend)'
									required
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<input
									name='description'
									defaultValue={editingSkill?.description}
									placeholder='Description'
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<div className='grid grid-cols-2 gap-4'>
									<input
										name='accent_color'
										defaultValue={editingSkill?.accent_color || '#9f66c2'}
										placeholder='Accent Color (Hex)'
										className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
									/>
									<input
										name='hex_code'
										defaultValue={editingSkill?.hex_code}
										placeholder='#HEX Display'
										className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
									/>
								</div>
								<input
									name='order_index'
									type='number'
									defaultValue={editingSkill?.order_index || 0}
									placeholder='Order'
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<div className='flex justify-end gap-3'>
									<button
										type='button'
										onClick={() => setIsSkillModalOpen(false)}
									>
										Cancel
									</button>
									<button
										disabled={saving}
										className='px-8 py-4 font-bold text-black bg-white rounded-xl'
									>
										{saving ? '...' : 'Save'}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Tool Modal */}
			<AnimatePresence>
				{isToolModalOpen && (
					<div className='fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md'>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='w-full max-w-md bg-[#0A0612] border border-white/10 rounded-[2.5rem] p-10'
						>
							<h2 className='mb-8 text-2xl font-bold'>
								{editingTool ? 'Edit Tool' : 'New Tool'}
							</h2>
							<form
								className='space-y-6'
								onSubmit={async (e) => {
									e.preventDefault()
									setSaving(true)
									try {
										const fd = new FormData(e.currentTarget)
										const payload = Object.fromEntries(fd.entries())
										const file = fd.get('image_file')

										if (file && file instanceof File && file.size > 0) {
											const url = await handleFileUpload(file, 'tools')
											if (url) payload.image_url = url
										}
										delete payload.image_file

										await handleAction(
											'tools',
											payload,
											editingTool,
											setIsToolModalOpen,
											setEditingTool,
										)
									} catch (err) {
										toast.error('Failed to save tool: ' + err.message)
									} finally {
										setSaving(false)
									}
								}}
							>
								<div className='p-6 border bg-white/5 rounded-2xl border-white/10'>
									<label className='block mb-2 text-xs font-black tracking-widest text-gray-500 uppercase'>
										Tool Name
									</label>
									<input
										name='name'
										defaultValue={editingTool?.name}
										placeholder='Tool Name'
										required
										className='w-full px-4 py-3 border bg-white/5 border-white/10 rounded-xl'
									/>
								</div>

								<div className='p-6 border bg-white/5 rounded-2xl border-white/10'>
									<label className='block mb-3 text-xs font-black tracking-widest text-gray-500 uppercase'>
										Tool Icon (Link or Upload)
									</label>
									<div className='space-y-4'>
										<input
											name='image_url'
											defaultValue={editingTool?.image_url}
											className='flex-1 w-full px-4 py-3 border bg-white/5 border-white/10 rounded-xl'
											placeholder='HTTPS Link...'
										/>
										<div className='flex items-center gap-4 p-4 border bg-white/5 rounded-xl border-white/5'>
											<Upload size={16} className='text-gray-500' />
											<input
												type='file'
												name='image_file'
												accept='image/*'
												className='text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-[var(--color-brand)] file:text-white hover:file:bg-[var(--color-brand-light)]'
											/>
										</div>
									</div>
								</div>

								<input
									name='order_index'
									type='number'
									defaultValue={editingTool?.order_index || 0}
									placeholder='Order'
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<div className='flex justify-end gap-3'>
									<button
										type='button'
										onClick={() => setIsToolModalOpen(false)}
										className='px-6 py-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-white'
									>
										Cancel
									</button>
									<button
										disabled={saving}
										className='px-10 py-3 text-xs font-bold tracking-widest text-black uppercase transition-all bg-white rounded-xl hover:shadow-2xl'
									>
										{saving ? (
											<Loader2 className='animate-spin' size={18} />
										) : (
											'Save Tool'
										)}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Service Modal */}
			<AnimatePresence>
				{isServiceModalOpen && (
					<div className='fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md'>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='w-full max-w-lg bg-[#0A0612] border border-white/10 rounded-[2.5rem] p-10'
						>
							<h2 className='mb-8 text-2xl font-bold'>
								{editingService ? 'Edit Service' : 'New Service'}
							</h2>
							<form
								className='space-y-6'
								onSubmit={(e) => {
									e.preventDefault()
									const fd = new FormData(e.currentTarget)
									const tags = fd
										.get('tags')
										?.split(',')
										.map((t) => t.trim())
										.filter(Boolean)
									const payload = Object.fromEntries(fd.entries())
									payload.tags = tags
									handleAction(
										'services',
										payload,
										editingService,
										setIsServiceModalOpen,
										setEditingService,
									)
								}}
							>
								<input
									name='title'
									defaultValue={editingService?.title}
									placeholder='Service Title'
									required
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<textarea
									name='description'
									defaultValue={editingService?.description}
									placeholder='Description'
									required
									rows='4'
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								></textarea>
								<div>
									<label className='block mb-2 text-[10px] font-black tracking-widest text-gray-500 uppercase'>
										Tags (e.g. AI Modeling, Automation, API Integration)
									</label>
									<input
										name='tags'
										defaultValue={editingService?.tags?.join(', ')}
										placeholder='Type tags separated by commas...'
										className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
									/>
								</div>
								<input
									name='order_index'
									type='number'
									defaultValue={editingService?.order_index || 0}
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<div className='flex justify-end gap-3'>
									<button
										type='button'
										onClick={() => setIsServiceModalOpen(false)}
									>
										Cancel
									</button>
									<button
										disabled={saving}
										className='px-8 py-4 font-bold text-black bg-white rounded-xl'
									>
										{saving ? '...' : 'Save'}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Process Modal */}
			<AnimatePresence>
				{isProcessModalOpen && (
					<div className='fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md'>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='w-full max-w-lg bg-[#0A0612] border border-white/10 rounded-[2.5rem] p-10'
						>
							<h2 className='mb-8 text-2xl font-bold'>
								{editingProcess ? 'Edit Step' : 'New Step'}
							</h2>
							<form
								className='space-y-6'
								onSubmit={(e) => {
									e.preventDefault()
									const fd = new FormData(e.currentTarget)
									handleAction(
										'process_steps',
										Object.fromEntries(fd.entries()),
										editingProcess,
										setIsProcessModalOpen,
										setEditingProcess,
									)
								}}
							>
								<div className='grid grid-cols-4 gap-4'>
									<div className='col-span-1'>
										<label className='text-[10px] uppercase font-bold text-gray-500 mb-2 block'>
											№
										</label>
										<input
											name='step_number'
											defaultValue={editingProcess?.step_number}
											placeholder='01'
											required
											className='w-full px-4 py-4 border bg-white/5 rounded-2xl border-white/10'
										/>
									</div>
									<div className='col-span-3'>
										<label className='text-[10px] uppercase font-bold text-gray-500 mb-2 block'>
											Title
										</label>
										<input
											name='title'
											defaultValue={editingProcess?.title}
											placeholder='Discovery'
											required
											className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
										/>
									</div>
								</div>
								<div>
									<label className='text-[10px] uppercase font-bold text-gray-500 mb-2 block'>
										Description
									</label>
									<textarea
										name='description'
										defaultValue={editingProcess?.description}
										placeholder='Mapping bottlenecks...'
										required
										rows='3'
										className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
									></textarea>
								</div>
								<input
									name='order_index'
									type='number'
									defaultValue={editingProcess?.order_index || 0}
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<div className='flex justify-end gap-3'>
									<button
										type='button'
										onClick={() => setIsProcessModalOpen(false)}
									>
										Cancel
									</button>
									<button
										disabled={saving}
										className='px-8 py-4 font-bold text-black bg-white rounded-xl'
									>
										{saving ? '...' : 'Save'}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Experience Modal */}
			<AnimatePresence>
				{isExperienceModalOpen && (
					<div className='fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md'>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='w-full max-w-lg bg-[#0A0612] border border-white/10 rounded-[2.5rem] p-10'
						>
							<h2 className='mb-8 text-2xl font-bold'>
								{editingExperience ? 'Edit Exp' : 'New Exp'}
							</h2>
							<form
								className='space-y-6'
								onSubmit={(e) => {
									e.preventDefault()
									const fd = new FormData(e.currentTarget)
									handleAction(
										'experience',
										Object.fromEntries(fd.entries()),
										editingExperience,
										setIsExperienceModalOpen,
										setEditingExperience,
									)
								}}
							>
								<input
									name='company'
									defaultValue={editingExperience?.company}
									placeholder='Company'
									required
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<input
									name='role'
									defaultValue={editingExperience?.role}
									placeholder='Role'
									required
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<input
									name='period'
									defaultValue={editingExperience?.period}
									placeholder='Period (e.g. 2021 - Present)'
									required
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<textarea
									name='description'
									defaultValue={editingExperience?.description}
									placeholder='Achievements...'
									required
									rows='4'
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								></textarea>
								<input
									name='order_index'
									type='number'
									defaultValue={editingExperience?.order_index || 0}
									className='w-full px-6 py-4 border bg-white/5 rounded-2xl border-white/10'
								/>
								<div className='flex justify-end gap-3'>
									<button
										type='button'
										onClick={() => setIsExperienceModalOpen(false)}
									>
										Cancel
									</button>
									<button
										disabled={saving}
										className='px-8 py-4 font-bold text-black bg-white rounded-xl'
									>
										{saving ? '...' : 'Save'}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Testimonial Modal */}
			<AnimatePresence>
				{isTestimonialModalOpen && (
					<div className='fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md overflow-y-auto'>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className='w-full max-w-lg bg-[#0A0612] border border-white/10 rounded-[2.5rem] p-10'
						>
							<h2 className='mb-8 text-2xl font-bold'>
								{editingTestimonial ? 'Edit Review' : 'New Review'}
							</h2>
							<form
								className='space-y-4'
								onSubmit={async (e) => {
									e.preventDefault()
									setSaving(true)
									try {
										const fd = new FormData(e.currentTarget)
										const file = fd.get('image_file')
										const payload = Object.fromEntries(fd.entries())

										if (file && file instanceof File && file.size > 0) {
											const url = await handleFileUpload(file, 'testimonials')
											if (url) payload.image_url = url
										}
										delete payload.image_file

										await handleAction(
											'testimonials',
											payload,
											editingTestimonial,
											setIsTestimonialModalOpen,
											setEditingTestimonial,
										)
									} catch (err) {
										toast.error(
											'DB Error: Please make sure the Testimonials table has columns: image_url, rating, company',
										)
									} finally {
										setSaving(false)
									}
								}}
							>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<label className='block mb-2 text-[10px] font-black tracking-widest text-gray-500 uppercase'>
											Name
										</label>
										<input
											name='name'
											defaultValue={editingTestimonial?.name}
											placeholder='Client Name'
											required
											className='w-full px-4 py-3 border bg-white/5 rounded-2xl border-white/10'
										/>
									</div>
									<div>
										<label className='block mb-2 text-[10px] font-black tracking-widest text-gray-500 uppercase'>
											Role
										</label>
										<input
											name='role'
											defaultValue={editingTestimonial?.role}
											placeholder='Role'
											required
											className='w-full px-4 py-3 border bg-white/5 rounded-2xl border-white/10'
										/>
									</div>
								</div>

								{/* NEW: Image & Rating Section */}
								<div className='grid grid-cols-2 gap-4 p-4 border bg-white/5 rounded-2xl border-white/5'>
									<div>
										<label className='block mb-2 text-[10px] font-black tracking-widest text-gray-500 uppercase'>
											Photo (Local)
										</label>
										<div className='flex items-center gap-3'>
											<Upload size={14} className='text-gray-500' />
											<input
												type='file'
												name='image_file'
												accept='image/*'
												className='text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:bg-[var(--color-brand)] file:text-white'
											/>
										</div>
									</div>
									<div>
										<label className='block mb-2 text-[10px] font-black tracking-widest text-gray-500 uppercase'>
											Rating (Stars)
										</label>
										<select
											name='rating'
											defaultValue={editingTestimonial?.rating || 5}
											className='w-full px-4 py-2 text-xs text-white bg-black border appearance-none border-white/10 rounded-xl'
										>
											{[5, 4, 3, 2, 1].map((n) => (
												<option key={n} value={n}>
													{n} Stars
												</option>
											))}
										</select>
									</div>
								</div>

								<div>
									<label className='block mb-2 text-[10px] font-black tracking-widest text-gray-500 uppercase'>
										Review Headline (Optional)
									</label>
									<input
										name='company'
										defaultValue={editingTestimonial?.company}
										placeholder='Short catchy title'
										className='w-full px-4 py-3 border bg-white/5 rounded-2xl border-white/10'
									/>
								</div>

								<div>
									<label className='block mb-2 text-[10px] font-black tracking-widest text-gray-500 uppercase'>
										Review / Testimonial
									</label>
									<textarea
										name='quote'
										defaultValue={editingTestimonial?.quote}
										placeholder='Their review...'
										required
										rows='3'
										className='w-full px-4 py-3 border bg-white/5 rounded-2xl border-white/10'
									></textarea>
								</div>

								<div className='flex justify-end gap-3 pt-4 border-t border-white/5'>
									<button
										type='button'
										onClick={() => setIsTestimonialModalOpen(false)}
										className='px-6 py-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase'
									>
										Cancel
									</button>
									<button
										disabled={saving}
										className='px-10 py-3 text-xs font-bold tracking-widest text-black uppercase bg-white rounded-xl'
									>
										{saving ? (
											<Loader2 className='animate-spin' size={18} />
										) : (
											'Publish Review'
										)}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	)
}
