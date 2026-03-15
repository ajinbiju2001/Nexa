'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Download, Play, Search, Loader, TriangleAlert } from 'lucide-react';

type VideoItem = {
  id: string;
  title: string;
  category: string;
  channel?: string;
  created_date: string;
  video_path: string | null;
  thumbnail_path: string | null;
  status?: string;
  warnings?: string[];
};

export default function LibraryPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
  const assetBaseUrl = apiBaseUrl.replace(/\/api$/, '');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadVideos = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiBaseUrl}/videos`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || payload.message || 'Failed to load videos.');
        }

        if (!cancelled) {
          setVideos(payload.videos || []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load videos.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  const cats = useMemo(() => ['All', ...Array.from(new Set(videos.map(video => video.category).filter(Boolean)))], [videos]);
  const channels = useMemo(() => ['All', ...Array.from(new Set(videos.map(video => video.channel || 'Unassigned')))], [videos]);

  const filtered = useMemo(() => {
    return videos.filter(video => {
      const matchSearch = video.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All' || video.category === catFilter;
      const channel = video.channel || 'Unassigned';
      const matchChan = channelFilter === 'All' || channel === channelFilter;
      return matchSearch && matchCat && matchChan;
    });
  }, [videos, search, catFilter, channelFilter]);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Video Library</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{videos.length} saved projects</p>
      </div>

      <div className="glass-static" style={{ borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)', flex: 1, fontFamily: 'DM Sans, sans-serif' }}
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                border: '1px solid var(--border)',
                background: catFilter === c ? 'var(--accent-1)' : 'transparent',
                color: catFilter === c ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <select className="nexa-select" value={channelFilter} onChange={e => setChannelFilter(e.target.value)}>
          {channels.map(channel => <option key={channel}>{channel}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="glass-static" style={{ borderRadius: 14, padding: '28px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}>
          <Loader size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
          Loading your saved videos...
        </div>
      ) : error ? (
        <div className="glass-static" style={{ borderRadius: 14, padding: '20px', border: '1px solid rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.08)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <TriangleAlert size={16} color="var(--accent-danger)" style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: 4 }}>Library failed to load</div>
            <div style={{ fontSize: 13 }}>{error}</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>No videos found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Generate a project from the Create page to see it here.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(video => {
            const createdDate = new Date(video.created_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div key={video.id} className="glass card-lift" style={{ borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ height: 220, background: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(15,23,42,0.8))', position: 'relative' }}>
                  {video.thumbnail_path ? (
                    <img
                      src={`${assetBaseUrl}${video.thumbnail_path}`}
                      alt={video.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : null}
                  {video.video_path ? (
                    <a
                      href={`${assetBaseUrl}${video.video_path}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.2)', textDecoration: 'none' }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={18} color="#020617" fill="#020617" />
                      </div>
                    </a>
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, background: 'rgba(2,6,23,0.18)' }}>
                      FFmpeg required for MP4 rendering
                    </div>
                  )}
                  <span className="badge" style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15,23,42,0.7)', color: '#fff' }}>
                    {video.category}
                  </span>
                </div>

                <div style={{ padding: '14px' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.4, color: 'var(--text-primary)' }}>{video.title}</h4>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                    {video.channel || 'Unassigned'} · {createdDate}
                  </div>

                  {video.warnings?.length ? (
                    <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 12 }}>
                      {video.warnings[0]}
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', gap: 8 }}>
                    {video.video_path ? (
                      <a
                        href={`${assetBaseUrl}${video.video_path}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12 }}
                      >
                        <Play size={12} />
                        Watch
                      </a>
                    ) : (
                      <div style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px dashed var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12 }}>
                        Pending Render
                      </div>
                    )}

                    {video.video_path ? (
                      <a
                        href={`${assetBaseUrl}${video.video_path}`}
                        download
                        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12 }}
                      >
                        <Download size={12} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
