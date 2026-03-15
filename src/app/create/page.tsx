'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Lightbulb, PenLine, Film, Zap, ChevronRight, Eye, Loader, CheckCircle, Download, Library } from 'lucide-react';

const modes = [
  {
    id: 'ai',
    icon: Lightbulb,
    title: 'AI Idea Generator',
    desc: 'Let AI generate viral ideas for you',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    placeholder: 'Enter a topic (e.g. "AI tools", "productivity tips")',
    example: 'AI tools',
  },
  {
    id: 'custom',
    icon: PenLine,
    title: 'Create From My Idea',
    desc: 'Paste your own idea and generate instantly',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    placeholder: 'Paste your idea (e.g. "3 AI tools that feel illegal to use")',
    example: '3 AI tools that feel illegal to use',
  },
  {
    id: 'cartoon',
    icon: Film,
    title: 'Cartoon Story Generator',
    desc: 'Turn story ideas into animated cartoon videos',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.1)',
    placeholder: 'Enter a story idea (e.g. "A lazy lion learns to work hard")',
    example: 'A lazy lion learns the value of hard work',
  },
  {
    id: 'bulk',
    icon: Zap,
    title: 'Bulk Shorts Generator',
    desc: 'Generate multiple shorts at once',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    placeholder: 'Enter a topic to generate multiple shorts',
    example: 'AI tools',
  },
];

const ideas = [
  '5 AI tools that will replace your job',
  '3 ChatGPT tricks nobody talks about',
  'How AI is changing the world in 2025',
  'The future of AI in 60 seconds',
];

export default function CreatePage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
  const assetBaseUrl = apiBaseUrl.replace(/\/api$/, '');
  const [selectedMode, setSelectedMode] = useState('ai');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('60');
  const [voice, setVoice] = useState('female');
  const [style, setStyle] = useState('stock');
  const [count, setCount] = useState('3');
  const [channel, setChannel] = useState('AI Tools Shorts');
  const [generating, setGenerating] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const [done, setDone] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [scriptError, setScriptError] = useState('');
  const [scriptWarning, setScriptWarning] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<null | {
    title: string;
    script?: string;
    video_path: string | null;
    thumbnail_path: string | null;
    status: string;
    warnings?: string[];
  }>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const mode = modes.find(m => m.id === selectedMode)!;
  const ModeIcon = mode.icon;

  useEffect(() => {
    let cancelled = false;

    const checkApi = async () => {
      try {
        const response = await fetch(`${apiBaseUrl.replace(/\/api$/, '')}/health`);
        if (!cancelled) {
          setApiStatus(response.ok ? 'online' : 'offline');
        }
      } catch (_error) {
        if (!cancelled) {
          setApiStatus('offline');
        }
      }
    };

    checkApi();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  const handleGenerate = async () => {
    if (!topic) return;

    setGenerating(true);
    setDone(false);
    setScriptError('');
    setScriptWarning('');
    setGeneratedScript('');
    setGeneratedVideo(null);

    try {
      const response = await fetch(`${apiBaseUrl}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoIdea: topic,
          title: topic,
          style,
          voice,
          channel,
          mode: selectedMode,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || payload.message || 'Failed to generate script.');
      }

      setGeneratedScript(payload.video?.script || '');
      setScriptWarning((payload.video?.warnings || []).join(' '));
      setGeneratedVideo(payload.video || null);
      setDone(true);
    } catch (error) {
      if (error instanceof TypeError) {
        setScriptError('Backend server is not reachable. Start the backend with "npm run backend:start" and make sure it is running on port 4000.');
      } else {
        setScriptError(error instanceof Error ? error.message : 'Failed to generate video.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleGetIdeas = async () => {
    setShowIdeas(true);
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create Video</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Choose a generation mode and let AI do the magic ✨</p>
        </div>

        <div className="glass-static" style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 20, border: apiStatus === 'offline' ? '1px solid rgba(244,63,94,0.24)' : '1px solid rgba(34,197,194,0.24)', background: apiStatus === 'offline' ? 'rgba(244,63,94,0.08)' : 'rgba(34,197,194,0.06)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: apiStatus === 'offline' ? 'var(--accent-danger)' : 'var(--accent-1)', marginBottom: 4 }}>
            {apiStatus === 'checking' && 'Checking backend connection...'}
            {apiStatus === 'online' && 'Backend connected'}
            {apiStatus === 'offline' && 'Backend offline'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {apiStatus === 'offline'
              ? 'Start the API server with "npm run backend:start". You can use OpenAI, Ollama, or Nexa free mode in .env.'
              : 'Script generation runs through the backend and can use OpenAI, Ollama, or Nexa free mode.'}
          </div>
        </div>

        {/* Mode cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 28 }}>
          {modes.map(m => {
            const Icon = m.icon;
            const active = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMode(m.id);
                  setTopic('');
                  setShowIdeas(false);
                  setDone(false);
                  setGeneratedScript('');
                  setScriptError('');
                  setScriptWarning('');
                  setGeneratedVideo(null);
                }}
                className={`mode-card glass ${active ? 'selected' : ''}`}
                style={{
                  borderRadius: 14, padding: '18px 20px', textAlign: 'left',
                  border: `1px solid ${active ? 'var(--accent-1)' : 'var(--border)'}`,
                  background: active ? 'rgba(99,102,241,0.08)' : 'var(--bg-card)',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={m.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.desc}</div>
                </div>
                {active && <ChevronRight size={16} color="var(--accent-1)" />}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="glass-static" style={{ borderRadius: 16, padding: '28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: mode.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModeIcon size={18} color={mode.color} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{mode.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{mode.desc}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Topic input */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                TOPIC / IDEA *
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea
                  className="nexa-input"
                  placeholder={mode.placeholder}
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  rows={2}
                  style={{ resize: 'none', flex: 1, lineHeight: 1.5 }}
                />
                {selectedMode === 'ai' && (
                  <button onClick={handleGetIdeas} style={{
                    padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)',
                    background: 'var(--bg-card)', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                    color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', flexShrink: 0,
                    alignSelf: 'flex-start',
                  }}>
                    Get Ideas
                  </button>
                )}
              </div>
              {!topic && (
                <button onClick={() => setTopic(mode.example)} style={{ marginTop: 6, fontSize: 11, color: 'var(--accent-1)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: 0 }}>
                  Try: "{mode.example}"
                </button>
              )}
            </div>

            {/* AI ideas */}
            {showIdeas && (
              <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '14px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-1)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lightbulb size={13} /> AI GENERATED IDEAS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ideas.map(idea => (
                    <button key={idea} onClick={() => { setTopic(idea); setShowIdeas(false); }} style={{
                      textAlign: 'left', padding: '9px 12px', borderRadius: 8,
                      border: '1px solid rgba(99,102,241,0.15)', background: 'var(--bg-card)',
                      cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)',
                      fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.15)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
                    >
                      <ChevronRight size={13} color="var(--accent-1)" />
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Settings row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>DURATION</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['30', '60'].map(d => (
                    <button key={d} onClick={() => setDuration(d)} style={{
                      flex: 1, padding: '9px', borderRadius: 8, border: '1px solid var(--border)',
                      background: duration === d ? 'var(--accent-1)' : 'transparent',
                      color: duration === d ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                    }}>
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>VOICE</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ v: 'male', label: '♂ Male' }, { v: 'female', label: '♀ Female' }].map(({ v, label }) => (
                    <button key={v} onClick={() => setVoice(v)} style={{
                      flex: 1, padding: '9px', borderRadius: 8, border: '1px solid var(--border)',
                      background: voice === v ? 'var(--accent-1)' : 'transparent',
                      color: voice === v ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                    }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>STYLE</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ v: 'stock', label: 'Stock' }, { v: 'cartoon', label: 'Cartoon' }].map(({ v, label }) => (
                    <button key={v} onClick={() => setStyle(v)} style={{
                      flex: 1, padding: '9px', borderRadius: 8, border: '1px solid var(--border)',
                      background: style === v ? 'var(--accent-1)' : 'transparent',
                      color: style === v ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                    }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMode === 'bulk' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>COUNT</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['1', '3', '5'].map(n => (
                      <button key={n} onClick={() => setCount(n)} style={{
                        flex: 1, padding: '9px', borderRadius: 8, border: '1px solid var(--border)',
                        background: count === n ? 'var(--accent-1)' : 'transparent',
                        color: count === n ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                      }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>CHANNEL</label>
                <select className="nexa-select" value={channel} onChange={e => setChannel(e.target.value)} style={{ width: '100%' }}>
                  <option>AI Tools Shorts</option>
                  <option>Tech Facts</option>
                  <option>Cartoon Stories</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button
                onClick={handleGenerate}
                disabled={!topic || generating}
                className="btn-gradient"
                style={{
                  flex: 1, padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                  fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: (!topic || generating) ? 0.6 : 1, cursor: (!topic || generating) ? 'not-allowed' : 'pointer',
                }}
              >
                {generating ? (
                  <>
                    <Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
                    Generating {selectedMode === 'bulk' ? `${count} videos` : 'video'}...
                  </>
                ) : done ? (
                  <>
                    <CheckCircle size={16} /> Video Ready!
                  </>
                ) : (
                  <>
                    <Zap size={16} fill="white" />
                    Generate {selectedMode === 'bulk' ? `${count} Shorts` : 'Video'}
                  </>
                )}
              </button>
              <button
                disabled={!generatedScript}
                style={{
                padding: '13px 20px', borderRadius: 12, border: '1px solid var(--border)',
                background: 'transparent', cursor: generatedScript ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 500,
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'DM Sans, sans-serif',
                opacity: generatedScript ? 1 : 0.6,
              }}
              >
                <Eye size={15} /> Preview Script
              </button>
            </div>
          </div>
        </div>

        {scriptError && (
          <div className="glass-static" style={{ borderRadius: 14, padding: '16px 18px', marginBottom: 20, border: '1px solid rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-danger)', marginBottom: 4 }}>Script generation failed</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{scriptError}</div>
          </div>
        )}

        {scriptWarning && !scriptError && (
          <div className="glass-static" style={{ borderRadius: 14, padding: '16px 18px', marginBottom: 20, border: '1px solid rgba(245,158,11,0.24)', background: 'rgba(245,158,11,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 4 }}>Script generated in fallback mode</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{scriptWarning}</div>
          </div>
        )}

        {generatedScript && (
          <div className="glass-static" style={{ borderRadius: 14, padding: '20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div>
                <div className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Generated Script</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {generatedVideo?.status === 'ready'
                    ? 'Saved with your new generated video project.'
                    : scriptWarning
                      ? 'Script preview from the local fallback pipeline.'
                      : 'Script preview from the backend generation pipeline.'}
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(34,197,194,0.14)', color: 'var(--accent-1)' }}>
                {generatedVideo?.status === 'ready' ? 'Video Ready' : 'Script Ready'}
              </span>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
              {generatedScript}
            </div>
          </div>
        )}

        {generatedVideo && (
          <div className="glass-static" style={{ borderRadius: 14, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div>
                <div className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Generated Project</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {generatedVideo.status === 'ready'
                    ? 'Your video, thumbnail, and metadata were saved to the library.'
                    : 'The project was saved, but local rendering still needs FFmpeg for a final MP4.'}
                </div>
              </div>
              <Link href="/library" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent-1)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                <Library size={14} />
                Open Library
              </Link>
            </div>
            {generatedVideo.thumbnail_path && (
              <img
                src={`${assetBaseUrl}${generatedVideo.thumbnail_path}`}
                alt={generatedVideo.title}
                style={{ width: 180, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 14 }}
              />
            )}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {generatedVideo.video_path && (
                <a
                  href={`${assetBaseUrl}${generatedVideo.video_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gradient"
                  style={{ padding: '12px 16px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                >
                  <Eye size={15} />
                  Watch Video
                </a>
              )}
              {generatedVideo.video_path && (
                <a
                  href={`${assetBaseUrl}${generatedVideo.video_path}`}
                  download
                  style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  <Download size={15} />
                  Download
                </a>
              )}
            </div>
          </div>
        )}

        {/* Progress */}
        {generating && (
          <div className="glass-static" style={{ borderRadius: 14, padding: '20px' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader size={15} color="var(--accent-1)" style={{ animation: 'spin 0.7s linear infinite' }} />
              Building your local AI video project...
            </div>
            {['Writing script', 'Generating thumbnail', 'Creating narration', 'Rendering video'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i === 0 ? <CheckCircle size={12} color="var(--accent-success)" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 1 ? 'var(--accent-1)' : 'var(--border)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: i <= 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</div>
                  {i === 1 && (
                    <div className="progress-bar" style={{ marginTop: 5 }}>
                      <div className="progress-fill" style={{ width: '45%', animation: 'none' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
