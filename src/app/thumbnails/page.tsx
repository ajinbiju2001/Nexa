'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Wand2, Download, Loader, Sparkles } from 'lucide-react';

const styles = ['YouTube Thumbnail', 'Cartoon Style', 'Tech Style', 'Cinematic'];

const thumbColors = [
  { bg: 'linear-gradient(135deg, #1e0a3c, #6366f1)', emoji: '🤖', label: 'Futuristic AI Robot' },
  { bg: 'linear-gradient(135deg, #0a1e2e, #06b6d4)', emoji: '🌌', label: 'Space Exploration' },
  { bg: 'linear-gradient(135deg, #1e1e0a, #f59e0b)', emoji: '⚡', label: 'Energy Revolution' },
  { bg: 'linear-gradient(135deg, #0a1e0a, #10b981)', emoji: '🌱', label: 'Green Tech Future' },
];

export default function ThumbnailsPage() {
  const [prompt, setPrompt] = useState('');
  const [thumbStyle, setThumbStyle] = useState('YouTube Thumbnail');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<typeof thumbColors>([]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerated(thumbColors);
    setGenerating(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Thumbnail Generator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Generate stunning AI-powered thumbnails for your videos</p>
      </div>

      {/* Generator form */}
      <div className="glass-static" style={{ borderRadius: 16, padding: '28px', marginBottom: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>DESCRIBE YOUR THUMBNAIL</label>
          <textarea
            className="nexa-input"
            rows={3}
            placeholder='e.g. "Futuristic AI robot controlling the world, dramatic lighting, red and blue tones"'
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            style={{ resize: 'none', lineHeight: 1.5 }}
          />
          {!prompt && (
            <button onClick={() => setPrompt('Futuristic AI robot controlling the world')} style={{ marginTop: 6, fontSize: 11, color: 'var(--accent-1)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: 0 }}>
              Try: "Futuristic AI robot controlling the world"
            </button>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>THUMBNAIL STYLE</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {styles.map(s => (
              <button key={s} onClick={() => setThumbStyle(s)} style={{
                padding: '8px 16px', borderRadius: 9, border: '1px solid var(--border)',
                background: thumbStyle === s ? 'var(--accent-1)' : 'transparent',
                color: thumbStyle === s ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt || generating}
          className="btn-gradient"
          style={{
            padding: '13px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8,
            opacity: (!prompt || generating) ? 0.6 : 1, cursor: (!prompt || generating) ? 'not-allowed' : 'pointer',
          }}
        >
          {generating ? <><Loader size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Generating...</> : <><Wand2 size={15} /> Generate Thumbnails</>}
        </button>
      </div>

      {/* Results */}
      {generated.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sparkles size={16} color="var(--accent-1)" />
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Generated Thumbnails</h2>
            <span className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-1)' }}>4 results</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {generated.map((t, i) => (
              <div key={i} className="glass card-lift" style={{ borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ height: 160, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 50 }}>{t.emoji}</span>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                    {t.label}
                  </div>
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>1280 × 720 px</span>
                  <button style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
