'use client';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Video, Library, Image, Tv2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import BrandMark from '@/components/BrandMark';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Video, label: 'Create Video', path: '/create' },
  { icon: Library, label: 'Video Library', path: '/library' },
  { icon: Image, label: 'Thumbnails', path: '/thumbnails' },
  { icon: Tv2, label: 'Channels', path: '/channels' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sidebar glass-static" style={{
      width: collapsed ? 64 : 220,
      minHeight: '100vh',
      position: 'fixed',
      left: 0, top: 0,
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
      borderRight: '1px solid var(--border)',
      borderRadius: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', justifyContent: collapsed ? 'center' : 'flex-start', minHeight: 64 }}>
        <BrandMark size={32} iconSize={16} radius={8} />
        {!collapsed && (
          <div>
            <div className="font-display gradient-text" style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
              NEXA
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Studio
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = pathname === path || pathname.startsWith(path + '/');
          return (
            <button
              key={path}
              onClick={() => router.push(path)}
              className={active ? 'nav-active' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 0' : '10px 12px',
                borderRadius: 10, width: '100%',
                justifyContent: collapsed ? 'center' : 'flex-start',
                border: 'none', cursor: 'pointer',
                background: active ? undefined : 'transparent',
                color: active ? 'var(--accent-1)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.15s',
                borderLeft: active ? '2px solid var(--accent-1)' : '2px solid transparent',
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
            padding: '8px 12px', borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'color 0.15s',
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
