'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Key, Bell, Palette, Clock, Youtube, Mic, Image, Save, CheckCircle } from 'lucide-react';

type Section = 'api' | 'notifications' | 'appearance' | 'automation';

const sections: { id: Section; icon: typeof Key; label: string; desc: string }[] = [
  { id: 'api', icon: Key, label: 'API Keys', desc: 'Connect AI services' },
  { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Alert preferences' },
  { id: 'appearance', icon: Palette, label: 'Appearance', desc: 'Theme & display' },
  { id: 'automation', icon: Clock, label: 'Automation', desc: 'Scheduled tasks' },
];

const apis = [
  { id: 'openai', label: 'OpenAI API Key', icon: '🧠', placeholder: 'sk-...', desc: 'Powers script generation and idea creation' },
  { id: 'elevenlabs', label: 'ElevenLabs API Key', icon: '🎙️', placeholder: 'el-...', desc: 'AI voice synthesis for your videos' },
  { id: 'pexels', label: 'Pexels API Key', icon: '📷', placeholder: 'px-...', desc: 'Stock footage and images' },
  { id: 'youtube', label: 'YouTube API Key', icon: '▶️', placeholder: 'yt-...', desc: 'Upload automation (coming soon)' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('api');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ videoComplete: true, thumbnailReady: true, ideas: true, daily: false });
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [autoTime, setAutoTime] = useState('09:00');
  const [autoCount, setAutoCount] = useState('3');

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Configure your Nexa Content Studio</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Section nav */}
        <div className="glass-static" style={{ borderRadius: 14, padding: '10px', height: 'fit-content' }}>
          {sections.map(s => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10,
                border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textAlign: 'left',
                background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: active ? 'var(--accent-1)' : 'var(--text-secondary)',
                marginBottom: 2, transition: 'all 0.15s',
              }}>
                <Icon size={16} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="glass-static" style={{ borderRadius: 14, padding: '28px' }}>
          {/* API Keys */}
          {activeSection === 'api' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>API Integrations</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Connect your AI services to power video generation.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {apis.map(api => (
                  <div key={api.id} style={{ borderRadius: 12, border: '1px solid var(--border)', padding: '16px', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>{api.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{api.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{api.desc}</div>
                      </div>
                      {apiKeys[api.id] && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent-success)', fontWeight: 500 }}>
                          <CheckCircle size={12} /> Connected
                        </div>
                      )}
                    </div>
                    <input
                      className="nexa-input"
                      type="password"
                      placeholder={api.placeholder}
                      value={apiKeys[api.id] || ''}
                      onChange={e => setApiKeys(k => ({ ...k, [api.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Notification Preferences</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Choose which alerts you want to receive.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { key: 'videoComplete', label: 'Video generation completed', desc: 'Get notified when your video is ready' },
                  { key: 'thumbnailReady', label: 'Thumbnail ready', desc: 'Alert when thumbnail generation finishes' },
                  { key: 'ideas', label: 'New ideas generated', desc: 'When AI generates content ideas for you' },
                  { key: 'daily', label: 'Daily summary', desc: 'Receive a daily report of your content activity' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      className="toggle-switch"
                      style={{ background: notifs[key as keyof typeof notifs] ? 'var(--accent-1)' : 'var(--border)', flexShrink: 0 }}
                    >
                      <div className="toggle-thumb" style={{ left: notifs[key as keyof typeof notifs] ? 21 : 3 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Appearance</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Customize your studio experience.</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>COLOR ACCENT</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { color: '#6366f1', label: 'Indigo' },
                    { color: '#a855f7', label: 'Purple' },
                    { color: '#06b6d4', label: 'Cyan' },
                    { color: '#10b981', label: 'Emerald' },
                    { color: '#f59e0b', label: 'Amber' },
                    { color: '#f43f5e', label: 'Rose' },
                  ].map(({ color, label }) => (
                    <button key={color} title={label} style={{
                      width: 32, height: 32, borderRadius: '50%', background: color, border: '3px solid transparent',
                      cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>SIDEBAR LAYOUT</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Expanded', 'Compact'].map(v => (
                    <button key={v} style={{
                      padding: '8px 18px', borderRadius: 9, border: '1px solid var(--border)',
                      background: v === 'Expanded' ? 'var(--accent-1)' : 'transparent',
                      color: v === 'Expanded' ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    }}>{v}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Automation */}
          {activeSection === 'automation' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Content Automation</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Schedule automatic daily content generation.</p>

              <div style={{ padding: '18px', borderRadius: 12, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.06)', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Auto Daily Generator</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Automatically generate shorts at a set time every day</div>
                  </div>
                  <button onClick={() => setAutoEnabled(!autoEnabled)} className="toggle-switch" style={{ background: autoEnabled ? 'var(--accent-1)' : 'var(--border)', flexShrink: 0 }}>
                    <div className="toggle-thumb" style={{ left: autoEnabled ? 21 : 3 }} />
                  </button>
                </div>
                {autoEnabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>TIME</label>
                      <input type="time" className="nexa-input" value={autoTime} onChange={e => setAutoTime(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>VIDEOS PER DAY</label>
                      <select className="nexa-select" style={{ width: '100%' }} value={autoCount} onChange={e => setAutoCount(e.target.value)}>
                        {['1', '3', '5', '10'].map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Placeholder features */}
              {['Trending Topic Finder', 'YouTube Auto-Upload'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)', marginBottom: 10, opacity: 0.6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{feat}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Coming soon</div>
                  </div>
                  <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>Soon</span>
                </div>
              ))}
            </div>
          )}

          {/* Save button */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={handleSave} className="btn-gradient" style={{ padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Save size={14} /> Save Changes
            </button>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--accent-success)', animation: 'fadeIn 0.3s ease-out' }}>
                <CheckCircle size={14} /> Saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
