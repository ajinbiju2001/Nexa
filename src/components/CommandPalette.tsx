'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Library, Image, LayoutDashboard, Film, Search } from 'lucide-react';

const commands = [
  { icon: Video, label: 'Generate Video', desc: 'Create a new AI video', path: '/create' },
  { icon: Film, label: 'Generate Cartoon', desc: 'Create cartoon story video', path: '/create?mode=cartoon' },
  { icon: Image, label: 'Create Thumbnail', desc: 'AI thumbnail generator', path: '/thumbnails' },
  { icon: Library, label: 'Open Library', desc: 'View all videos', path: '/library' },
  { icon: LayoutDashboard, label: 'Go to Dashboard', desc: 'Main overview', path: '/dashboard' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, filtered.length - 1));
      if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0));
      if (e.key === 'Enter' && filtered[selected]) handleSelect(filtered[selected].path);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, selected, filtered]);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div
        className="glass-static"
        style={{ width: '100%', maxWidth: 540, borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', margin: '0 16px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            autoFocus
            className="nexa-input"
            placeholder="Search commands..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0, flex: 1, fontSize: 15 }}
          />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px' }}>ESC</span>
        </div>

        {/* Commands */}
        <div style={{ padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No commands found
            </div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.label}
                  onClick={() => handleSelect(cmd.path)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: i === selected ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
                    transition: 'background 0.15s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: i === selected ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))' : 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={15} color={i === selected ? 'var(--accent-1)' : 'var(--text-muted)'} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{cmd.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cmd.desc}</div>
                  </div>
                  {i === selected && (
                    <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px' }}>
                      ENTER
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16 }}>
          {['↑↓ Navigate', '↵ Select', 'ESC Close'].map(h => (
            <span key={h} style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
