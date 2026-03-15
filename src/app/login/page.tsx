'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import BrandMark from '@/components/BrandMark';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Glow orbs */}
      <div className="glow-orb" style={{ width: 500, height: 500, background: '#6366f1', top: -100, left: -100 }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: '#a855f7', bottom: -80, right: -80 }} />
      <div className="glow-orb" style={{ width: 200, height: 200, background: '#06b6d4', top: '40%', right: '20%' }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <BrandMark size={40} iconSize={20} radius={10} />
            <span className="font-display gradient-text" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
              NEXA
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Content Studio
          </div>
        </div>

        {/* Card */}
        <div className="glass-static" style={{ borderRadius: 20, padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Sign in to your content studio
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                EMAIL ADDRESS
              </label>
              <input
                className="nexa-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="nexa-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: 12, color: 'var(--accent-1)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="btn-gradient"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 12,
                fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: 24, padding: '16px', borderRadius: 12,
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <Sparkles size={14} color="var(--accent-1)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                Welcome to Nexa Content Studio
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Your AI-powered content factory.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <a href="#" style={{ color: 'var(--accent-1)', textDecoration: 'none', fontWeight: 500 }}>
            Start free trial
          </a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
