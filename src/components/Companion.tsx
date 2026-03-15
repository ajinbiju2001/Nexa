'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BrandMark from '@/components/BrandMark';

type Msg = { role: 'user' | 'bot'; text: string };

const botResponses: Record<string, { text: string; action?: string }> = {
  'go to video generator': { text: "Sure! Navigating to the video generator now 🎬", action: '/create' },
  'create video': { text: "Opening the video creator for you! 🚀", action: '/create' },
  'open video library': { text: "Taking you to the video library! 📚", action: '/library' },
  'library': { text: "Here's your video library! 📚", action: '/library' },
  'thumbnail': { text: "Opening the thumbnail generator! 🖼️", action: '/thumbnails' },
  'channels': { text: "Here are your channels! 📺", action: '/channels' },
  'dashboard': { text: "Going back to dashboard! 🏠", action: '/dashboard' },
  'how do i generate shorts': { text: "To generate shorts:\n1. Click 'Create Video' in sidebar\n2. Choose your mode (AI Idea, Your Idea, Cartoon, or Bulk)\n3. Fill in your topic and settings\n4. Hit 'Generate Video'! ⚡" },
  'default': { text: "I'm Nexa Companion! I can help you navigate, generate content, or answer questions. Try saying 'Create video' or 'Open library'! ✨" },
};

export default function Companion() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'bot', text: "Hey! I'm Nexa Companion 👋 I can navigate the dashboard, help generate content, or answer any questions. What would you like to do?" }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });
  const router = useRouter();
  const viewportWidth = mounted ? window.innerWidth : 0;
  const viewportHeight = mounted ? window.innerHeight : 0;
  const buttonSize = viewportWidth <= 768 ? 58 : 68;
  const panelWidth = viewportWidth <= 768 ? Math.max(viewportWidth - 32, 280) : 340;
  const panelLeft = mounted
    ? Math.min(Math.max(position.x - panelWidth + buttonSize, 16), Math.max(viewportWidth - panelWidth - 16, 16))
    : 16;
  const panelTop = mounted
    ? Math.min(Math.max(position.y - 440, 16), Math.max(viewportHeight - 392 - 24, 16))
    : 16;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  useEffect(() => {
    const syncPosition = () => {
      const margin = 20;
      setPosition((current) => {
        if (!mounted) {
          return {
            x: window.innerWidth - buttonSize - margin,
            y: window.innerHeight - buttonSize - margin,
          };
        }

        return {
          x: Math.min(Math.max(current.x, margin), window.innerWidth - buttonSize - margin),
          y: Math.min(Math.max(current.y, margin), window.innerHeight - buttonSize - margin),
        };
      });
      setMounted(true);
    };

    syncPosition();
    window.addEventListener('resize', syncPosition);
    return () => window.removeEventListener('resize', syncPosition);
  }, [mounted]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const key = Object.keys(botResponses).find(k => userMsg.toLowerCase().includes(k)) || 'default';
    const resp = botResponses[key];

    setTyping(false);
    setMsgs(m => [...m, { role: 'bot', text: resp.text }]);
    if (resp.action) {
      await new Promise(r => setTimeout(r, 600));
      router.push(resp.action);
      setOpen(false);
    }
  };

  const clampPosition = (x: number, y: number) => {
    const margin = 12;

    return {
      x: Math.min(Math.max(x, margin), window.innerWidth - (window.innerWidth <= 768 ? 58 : 68) - margin),
      y: Math.min(Math.max(y, margin), window.innerHeight - (window.innerWidth <= 768 ? 58 : 68) - margin),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setDragging(true);
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      dragRef.current.moved = true;
    }

    const next = clampPosition(dragRef.current.originX + deltaX, dragRef.current.originY + deltaY);
    setPosition(next);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const wasMoved = dragRef.current.moved;
    setDragging(false);
    dragRef.current.active = false;
    dragRef.current.pointerId = -1;
    if (!wasMoved) {
      setOpen((current) => !current);
    }
  };

  return (
    <>
      {open && (
        <div className="chat-panel" style={{ right: 'auto', left: panelLeft, top: panelTop, bottom: 'auto', width: panelWidth }}>
          <div className="panel-solid" style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 70px rgba(2,12,16,0.34)' }}>
            {/* Header */}
            <div style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, rgba(27,179,171,0.22), rgba(244,162,97,0.16))',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BrandMark size={36} iconSize={16} radius={12} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Nexa Companion</div>
                <div style={{ fontSize: 11, color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                  Online
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ height: 300, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role === 'user' ? 'linear-gradient(135deg, #1bb3ab, #0f766e)' : 'var(--bg-card)',
                    border: m.role === 'bot' ? '1px solid var(--border)' : 'none',
                    color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                    fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-line',
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', gap: 5, padding: '10px 13px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', width: 'fit-content' }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input
                className="nexa-input"
                placeholder='Ask anything or say "Create video"...'
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}
              />
              <button onClick={send} className="btn-gradient" style={{ borderRadius: 8, padding: '8px 12px', flexShrink: 0 }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className={`assistant-btn${dragging ? ' assistant-btn--dragging' : ''}${open ? ' assistant-btn--active' : ''}`}
        aria-label={open ? 'Close Nexa AI assistant' : 'Open Nexa AI assistant'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ left: position.x, top: position.y, visibility: mounted ? 'visible' : 'hidden' }}
      >
        <span className="assistant-btn__halo assistant-btn__halo--one" />
        <span className="assistant-btn__halo assistant-btn__halo--two" />
        <span className="assistant-btn__core">
          <BrandMark size={40} iconSize={18} radius={14} />
        </span>
      </button>
    </>
  );
}
