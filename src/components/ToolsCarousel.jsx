'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Zap, ChevronLeft, ChevronRight, Grid3x3, RotateCcw } from 'lucide-react'

const SPEED = 0.38 // cards per second (continuous)

// Smoothly interpolate cover-flow position from a float offset
function getProps(offset) {
  const abs = Math.abs(offset)
  if (abs > 2.55) return null
  const sign = offset < 0 ? -1 : 1
  let x, ry, scale, opacity
  if (abs <= 1) {
    x       = sign * 215 * abs
    ry      = sign * 43  * abs
    scale   = 1    - 0.17 * abs
    opacity = 1    - 0.28 * abs
  } else {
    const t = abs - 1
    x       = sign * (215 + 155 * t)
    ry      = sign * (43  + 14  * t)
    scale   = 0.83 - 0.17 * t
    opacity = 0.72 - 0.27 * t
  }
  return { x, ry, scale, opacity, zIndex: Math.max(1, Math.round(20 - abs * 5)) }
}

export default function ToolsCarousel() {
  const [tools, setTools]       = useState([])
  const [progress, setProgress] = useState(0)
  const [view, setView]         = useState('carousel')

  const progressRef  = useRef(0)
  const pausedRef    = useRef(false)
  const lenRef       = useRef(0)
  const lastTimeRef  = useRef(null)
  const rafRef       = useRef(null)
  const viewRef      = useRef('carousel')



  useEffect(() => { viewRef.current = view }, [view])
  useEffect(() => { lenRef.current = tools.length }, [tools.length])

  useEffect(() => {
    supabase.from('tools').select('*').order('order_index').then(({ data }) => {
      setTools(data || [])
    })
  }, [])

  // RAF-driven continuous rotation
  useEffect(() => {
    if (tools.length === 0) return

    const loop = (ts) => {
      rafRef.current = requestAnimationFrame(loop)
      if (viewRef.current !== 'carousel') { lastTimeRef.current = null; return }
      if (lastTimeRef.current !== null && !pausedRef.current) {
        const dt = Math.min((ts - lastTimeRef.current) / 1000, 0.1)
        const n  = lenRef.current
        progressRef.current = (progressRef.current + SPEED * dt + n) % n
        setProgress(progressRef.current)
      }
      lastTimeRef.current = ts
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tools.length])

  // Snap to an index, pause briefly then resume
  const jumpTo = useCallback((i) => {
    pausedRef.current = true
    progressRef.current = i
    setProgress(i)
    setTimeout(() => { pausedRef.current = false }, 2800)
  }, [])

  const prev = useCallback(() => {
    const n = lenRef.current; if (!n) return
    jumpTo(((Math.round(progressRef.current) - 1) + n) % n)
  }, [jumpTo])

  const next = useCallback(() => {
    const n = lenRef.current; if (!n) return
    jumpTo((Math.round(progressRef.current) + 1) % n)
  }, [jumpTo])

  if (tools.length === 0) return null

  const activeIdx = Math.round(progress) % tools.length

  return (
    <section className='w-full py-10 bg-black/40 relative' style={{ overflowX: 'clip' }}>

      {/* Ambient glow */}
      <div className='absolute inset-0 pointer-events-none flex items-center justify-center'>
        <div
          className='w-[700px] h-[500px] rounded-full blur-[140px] opacity-25'
          style={{ background: 'radial-gradient(ellipse, var(--color-brand) 0%, var(--color-secondary) 60%, transparent 100%)' }}
        />
      </div>

      {/* Header + toggle */}
      <div className='relative z-10 flex flex-col items-center gap-3 mb-6 px-4'>
        <div className='text-center'>
          <h2
            className='text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter'
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Tools
          </h2>
          <p className='text-gray-500 font-light text-sm sm:text-base tracking-widest uppercase mt-1'>
            The engines behind the automation
          </p>
        </div>

        <div className='flex gap-2'>
          {[
            { key: 'carousel', label: 'Carousel', Icon: RotateCcw },
            { key: 'grid',     label: 'View All', Icon: Grid3x3  },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                view === key
                  ? 'bg-[var(--color-brand)] text-white shadow-[0_0_18px_rgba(108,59,137,0.6)]'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode='wait'>

        {/* ── CONTINUOUS ROTATING CAROUSEL ── */}
        {view === 'carousel' && (
          <motion.div
            key='carousel'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stage */}
            <div
              className='relative flex items-center justify-center select-none'
              style={{ height: '300px', perspective: '1100px' }}
              onMouseEnter={() => { pausedRef.current = true }}
              onMouseLeave={() => { pausedRef.current = false }}
            >
              {tools.map((tool, i) => {
                let offset = i - progress
                const n = tools.length
                // Shortest-path wrap-around
                while (offset >  n / 2) offset -= n
                while (offset < -n / 2) offset += n

                const p = getProps(offset)
                if (!p) return null

                const isActive = i === activeIdx

                return (
                  <div
                    key={tool.id}
                    onClick={() => { if (!isActive) jumpTo(i) }}
                    className={`absolute ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
                    style={{
                      zIndex: p.zIndex,
                      opacity: p.opacity,
                      transform: `translateX(${p.x}px) rotateY(${p.ry}deg) scale(${p.scale})`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[22px] ${
                        isActive
                          ? 'shadow-[0_0_50px_rgba(108,59,137,0.65),0_16px_50px_rgba(0,0,0,0.8)] border border-[var(--color-brand)]/50'
                          : 'shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10'
                      }`}
                      style={{ width: '160px', height: '210px' }}
                    >
                      {/* Logo / image area */}
                      <div className='w-full h-[68%] bg-[#0c0c0c] flex items-center justify-center p-5'>
                        {tool.image_url ? (
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            className={`w-full h-full object-contain transition-none ${
                              isActive
                                ? 'filter drop-shadow-[0_0_18px_rgba(255,255,255,0.45)]'
                                : 'filter grayscale opacity-55'
                            }`}
                          />
                        ) : (
                          <Zap
                            size={52}
                            className={isActive ? 'text-[var(--color-brand-light)]' : 'text-gray-600'}
                          />
                        )}
                      </div>

                      {/* Name bar */}
                      <div className={`absolute bottom-0 left-0 right-0 px-3 py-2.5 backdrop-blur-md ${isActive ? 'bg-black/70' : 'bg-black/50'}`}>
                        <p
                          className={`font-black uppercase tracking-wide truncate leading-tight ${isActive ? 'text-white text-sm' : 'text-gray-400 text-xs'}`}
                          style={{ fontFamily: 'var(--font-space)' }}
                        >
                          {tool.name}
                        </p>
                        {isActive && tool.category && (
                          <p className='text-[var(--color-brand-light)] text-[10px] font-light uppercase tracking-widest truncate mt-0.5'>
                            {tool.category}
                          </p>
                        )}
                      </div>

                      {/* Active gradient overlay */}
                      {isActive && (
                        <div className='absolute inset-0 bg-gradient-to-t from-[var(--color-brand)]/15 via-transparent to-white/5 pointer-events-none rounded-[22px]' />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Nav: arrows + dots */}
            <div className='relative z-10 flex items-center justify-center gap-4 mt-5'>
              <button
                onClick={prev}
                className='p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 border border-white/10'
              >
                <ChevronLeft size={18} />
              </button>

              <div className='flex items-center gap-1.5'>
                {tools.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => jumpTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIdx
                        ? 'w-5 h-2 bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]'
                        : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className='p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 border border-white/10'
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── GRID / VIEW ALL ── */}
        {view === 'grid' && (
          <motion.div
            key='grid'
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.3 }}
            className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-4'
          >
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'>
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className='rounded-xl sm:rounded-2xl bg-[#111111]/90 border border-white/10 p-4 sm:p-5 flex flex-col items-center justify-center gap-3 group hover:border-[var(--color-brand)]/50 transition-colors hover:shadow-[0_0_25px_rgba(108,59,137,0.35)] relative overflow-hidden'
                >
                  {/* Floating bob on the icon */}
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 2.4 + (i % 5) * 0.35,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: (i % 7) * 0.3,
                    }}
                    className='w-14 h-14 sm:w-16 sm:h-16 p-2 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-all'
                  >
                    {tool.image_url ? (
                      <img src={tool.image_url} alt={tool.name} className='w-full h-full object-contain' />
                    ) : (
                      <Zap size={36} className='text-[var(--color-brand-light)] w-full h-full' />
                    )}
                  </motion.div>
                  <p
                    className='text-xs font-black text-white tracking-wider uppercase text-center break-words line-clamp-2'
                    style={{ fontFamily: 'var(--font-space)' }}
                  >
                    {tool.name}
                  </p>
                  <div className='absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl sm:rounded-2xl pointer-events-none' />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}
