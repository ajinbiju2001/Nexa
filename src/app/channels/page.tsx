'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tv2, Plus, Edit2, Trash2, Hash, Video, CheckCircle } from 'lucide-react';

const initChannels = [
  {
    id: 1, name: 'AI Tools Shorts', style: 'Stock Clips', emoji: '🤖',
    color: '#6366f1', bg: 'rgba(99,102,241,0.1)',
    hashtags: ['#AITools', '#ArtificialIntelligence', '#TechShorts', '#AITips'],
    videos: 58, status: 'active',
  },
  {
    id: 2, name: 'Tech Facts', style: 'Stock Clips', emoji: '💡',
    color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',
    hashtags: ['#TechFacts', '#Technology', '#TechTips', '#DidYouKnow'],
    videos: 42, status: 'active',
  },
  {
    id: 3, name: 'Cartoon Stories', style: 'Cartoon Animation', emoji: '🎭',
    color: '#a855f7', bg: 'rgba(168,85,247,0.1)',
    hashtags: ['#CartoonStories', '#AnimatedShorts', '#KidsContent', '#Storytelling'],
    videos: 31, status: 'active',
  },
];

export default function ChannelsPage() {
  const [channels, setChannels] = useState(initChannels);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: '', style: 'Stock Clips', hashtags: '' });

  const deleteChannel = (id: number) => setChannels(c => c.filter(x => x.id !== id));

  const addChannel = () => {
    if (!newChannel.name) return;
    const emojis = ['📺', '🎬', '🎥', '🌟'];
    const colors = ['#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];
    const idx = channels.length % 4;
    setChannels(c => [...c, {
      id: Date.now(), name: newChannel.name, style: newChannel.style,
      emoji: emojis[idx], color: colors[idx], bg: `${colors[idx]}18`,
      hashtags: newChannel.hashtags.split(' ').filter(Boolean),
      videos: 0, status: 'active',
    }]);
    setNewChannel({ name: '', style: 'Stock Clips', hashtags: '' });
    setShowAdd(false);
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Channel Manager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{channels.length} channels connected</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-gradient"
          style={{ padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={15} /> Add Channel
        </button>
      </div>

      {/* Add Channel form */}
      {showAdd && (
        <div className="glass-static" style={{ borderRadius: 14, padding: '22px', marginBottom: 24, border: '1px solid rgba(99,102,241,0.3)' }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>New Channel</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>CHANNEL NAME</label>
              <input className="nexa-input" placeholder="e.g. AI Tech Daily" value={newChannel.name} onChange={e => setNewChannel(n => ({ ...n, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>DEFAULT STYLE</label>
              <select className="nexa-select" style={{ width: '100%' }} value={newChannel.style} onChange={e => setNewChannel(n => ({ ...n, style: e.target.value }))}>
                <option>Stock Clips</option>
                <option>Cartoon Animation</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>DEFAULT HASHTAGS</label>
            <input className="nexa-input" placeholder="#AITools #TechShorts #Viral" value={newChannel.hashtags} onChange={e => setNewChannel(n => ({ ...n, hashtags: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addChannel} className="btn-gradient" style={{ padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>Create Channel</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: '9px 20px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Channels grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
        {channels.map(ch => (
          <div key={ch.id} className="glass card-lift" style={{ borderRadius: 16, overflow: 'hidden', borderTop: `2px solid ${ch.color}` }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 16px', background: ch.bg }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${ch.color}22`, border: `1px solid ${ch.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {ch.emoji}
                  </div>
                  <div>
                    <div className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{ch.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                      <CheckCircle size={11} color="var(--accent-success)" />
                      <span style={{ fontSize: 11, color: 'var(--accent-success)', fontWeight: 500 }}>Active</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    onClick={() => setEditingId(editingId === ch.id ? null : ch.id)}
                    style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => deleteChannel(ch.id)}
                    style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-danger)' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              {[
                { label: 'Videos', value: ch.videos, icon: Video },
                { label: 'Style', value: ch.style.split(' ')[0], icon: Tv2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon size={10} /> {label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
                </div>
              ))}
              <div style={{ flex: 1, padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Tags</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{ch.hashtags.length}</div>
              </div>
            </div>

            {/* Hashtags */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Hash size={10} /> DEFAULT HASHTAGS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {ch.hashtags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: `${ch.color}15`, color: ch.color, fontWeight: 500, border: `1px solid ${ch.color}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit inline */}
            {editingId === ch.id && (
              <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', background: 'rgba(99,102,241,0.04)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-1)', marginBottom: 10 }}>Edit Channel</div>
                <input className="nexa-input" defaultValue={ch.name} style={{ marginBottom: 8 }} placeholder="Channel name" />
                <input className="nexa-input" defaultValue={ch.hashtags.join(' ')} style={{ marginBottom: 10 }} placeholder="Hashtags" />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditingId(null)} className="btn-gradient" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add placeholder */}
        <button onClick={() => setShowAdd(true)} style={{
          borderRadius: 16, border: '2px dashed var(--border)', background: 'transparent',
          cursor: 'pointer', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} color="var(--accent-1)" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Add New Channel</span>
        </button>
      </div>
    </DashboardLayout>
  );
}
