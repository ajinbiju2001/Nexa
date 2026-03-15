'use client';
import { useContext, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Companion from '@/components/Companion';
import CommandPalette from '@/components/CommandPalette';
import { ThemeCtx } from '@/components/ThemeProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeCtx);
  const sidebarWidth = collapsed ? 64 : 220;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Navbar theme={theme} toggleTheme={toggleTheme} sidebarWidth={sidebarWidth} />

      <main style={{
        marginLeft: sidebarWidth, paddingTop: 64,
        minHeight: '100vh', position: 'relative', zIndex: 1,
        transition: 'margin-left 0.3s ease',
      }}>
        <div style={{ padding: '32px 28px' }} className="page-enter">
          {children}
        </div>
      </main>

      <Companion />
      <CommandPalette />
    </div>
  );
}
