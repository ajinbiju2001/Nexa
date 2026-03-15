'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import {
  Video, Download, Tv2, TrendingUp, Plus,
  Play, MoreHorizontal, Sparkles, ArrowUpRight, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const chartData = [
  { day: 'Mon', videos: 2, downloads: 5 },
  { day: 'Tue', videos: 4, downloads: 9 },
  { day: 'Wed', videos: 3, downloads: 7 },
  { day: 'Thu', videos: 6, downloads: 14 },
  { day: 'Fri', videos: 5, downloads: 11 },
  { day: 'Sat', videos: 8, downloads: 18 },
  { day: 'Sun', videos: 7, downloads: 16 },
];

const videos = [
  { id: 1, title: '5 AI Tools That Feel Illegal To Use', category: 'AI Tools', date: 'Jun 14', color: '#6366f1', emoji: '🤖' },
  { id: 2, title: 'The Lazy Lion Who Learned to Work', category: 'Cartoon Story', date: 'Jun 13', color: '#a855f7', emoji: '🦁' },
  { id: 3, title: 'Tech Facts You Never Knew', category: 'Tech Facts', date: 'Jun 12', color: '#06b6d4', emoji: '💡' },
  { id: 4, title: '3 Python Tips for Beginners', category: 'Custom Ideas', date: 'Jun 11', color: '#f59e0b', emoji: '🐍' },
  { id: 5, title: 'ChatGPT vs Claude - Full Comparison', category: 'AI Tools', date: 'Jun 10', color: '#6366f1', emoji: '⚡' },
  { id: 6, title: 'The Magic Forest Adventure', category: 'Cartoon Story', date: 'Jun 9', color: '#a855f7', emoji: '🌲' },
];

const categories = ['All', 'AI Tools', 'Tech Facts', 'Cartoon Stories', 'Custom Ideas'];
const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom'];

const stats = [
  { label: 'Total Videos', value: '148', change: '+12%', icon: Video, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { label: 'This Week', value: '34', change: '+8%', icon: TrendingUp, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { label: 'Channels', value: '3', change: 'Active', icon: Tv2, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  { label: 'Downloads', value: '2.4k', change: '+24%', icon: Download, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
];

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [dateRange, setDateRange] = useState('Last 7 days');
  const router = useRouter();

  const filtered = activeCategory === 'All' ? videos : videos.filter(v =>
    v.category.toLowerCase().includes(activeCategory.toLowerCase().replace(' stories', '').replace(' ideas', ''))
  );

  return (
    <DashboardLayout>
      {/* Welcome banner */}
      <div className="glass gradient-border" style={{ borderRadius: 16, padding: '24px 28px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb" style={{ width: 300, height: 300, background: '#6366f1', top: -100, right: -50, opacity: 0.1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sparkles size={16} color="var(--accent-1)" />
              <span style={{ fontSize: 12, color: 'var(--accent-1)', fontWeight: 600, letterSpacing: '0.08em' }}>WELCOME BACK</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
              Good morning, Alex 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Generate viral content, ideas, and videos using AI.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/create')} className="btn-gradient" style={{ padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, sans-serif' }}>
              <Zap size={14} /> Generate Video
            </button>
            <button style={{ padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> Explore Ideas
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass card-lift" style={{ borderRadius: 14, padding: '20px', borderTop: `2px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={s.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: `${s.color}18`, padding: '3px 8px', borderRadius: 999 }}>
                  {s.change}
                </span>
              </div>
              <div className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Chart + Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 28 }}>
        <div className="glass-static" style={{ borderRadius: 14, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Weekly Performance</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {dateRanges.slice(0, 3).map(r => (
                <button key={r} onClick={() => setDateRange(r)} style={{
                  padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 500,
                  border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  background: dateRange === r ? 'var(--accent-1)' : 'transparent',
                  color: dateRange === r ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}>
                  {r.replace('Last ', '')}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="videos" stroke="#6366f1" strokeWidth={2} fill="url(#gv)" />
              <Area type="monotone" dataKey="downloads" stroke="#a855f7" strokeWidth={2} fill="url(#gd)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            {[{ color: '#6366f1', label: 'Videos Generated' }, { color: '#a855f7', label: 'Downloads' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 10, height: 3, background: l.color, borderRadius: 999 }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass-static" style={{ borderRadius: 14, padding: '20px' }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'AI Idea Generator', icon: '💡', path: '/create?mode=ai' },
              { label: 'Cartoon Story', icon: '🎭', path: '/create?mode=cartoon' },
              { label: 'Bulk Shorts', icon: '⚡', path: '/create?mode=bulk' },
              { label: 'Make Thumbnail', icon: '🖼️', path: '/thumbnails' },
            ].map(a => (
              <button key={a.label} onClick={() => router.push(a.path)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)',
                fontSize: 13, fontWeight: 500, transition: 'all 0.15s', textAlign: 'left',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
              >
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ flex: 1 }}>{a.label}</span>
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Videos section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>Generated Videos</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                background: activeCategory === cat ? 'var(--accent-1)' : 'transparent',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {/* Create new card */}
          <button onClick={() => router.push('/create')} className="glass card-lift" style={{
            borderRadius: 14, padding: '0', border: '2px dashed var(--border)', background: 'transparent',
            cursor: 'pointer', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} color="var(--accent-1)" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Create New Video</span>
          </button>

          {filtered.map(video => (
            <div key={video.id} className="glass card-lift" style={{ borderRadius: 14, overflow: 'hidden' }}>
              {/* Thumbnail */}
              <div className="thumb-placeholder" style={{ height: 130, background: `linear-gradient(135deg, ${video.color}33, ${video.color}11)`, position: 'relative' }}>
                <span style={{ fontSize: 36 }}>{video.emoji}</span>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s', background: 'rgba(0,0,0,0.4)',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
                >
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={16} color="#000" fill="#000" />
                  </div>
                </div>
                <span className="badge" style={{ position: 'absolute', top: 8, left: 8, background: `${video.color}33`, color: video.color, backdropFilter: 'blur(8px)' }}>
                  {video.category}
                </span>
              </div>
              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.4, color: 'var(--text-primary)' }}>{video.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{video.date}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>
                      <Download size={11} /> Download
                    </button>
                    <button style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
