import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonView from './components/SkeletonView';
import { Upload, Play, Info, Activity, Target, TrendingUp, Award } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function App() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData);
      setJobId(res.data.job_id);
      setStatus('processing');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  useEffect(() => {
    let interval;
    if (jobId && status === 'processing') {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/status/${jobId}`);
          if (res.data.status === 'completed') {
            setResult(res.data.result);
            setStatus('completed');
            clearInterval(interval);
          } else if (res.data.status === 'failed') {
            setStatus('failed');
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Error checking status:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, status]);

  useEffect(() => {
    let interval;
    if (isPlaying && result) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % result.skeleton_data.length);
      }, 33);
    }
    return () => clearInterval(interval);
  }, [isPlaying, result]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#e5e7eb', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #1f2937', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #3b82f6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BACKFLIP AI COACH
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', letterSpacing: '0.05em' }}>PRECISION BIOMECHANICAL ANALYSIS</p>
        </div>
        {status === 'completed' && (
            <div style={{ backgroundColor: '#111827', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #374151' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#9ca3af' }}>Analysis Status</p>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>COMPLETED</p>
            </div>
        )}
      </header>

      {!jobId && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', border: '2px dashed #1e293b', borderRadius: '1.5rem', padding: '6rem 2rem', transition: 'all 0.3s ease' }}>
          <Upload size={64} color="#3b82f6" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Upload Backflip Video</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem', textAlign: 'center' }}>For best results, use a side-view video with the athlete centered.</p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: '2rem', color: '#94a3b8' }}
          />
          <button
            onClick={handleUpload}
            style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '1.125rem', padding: '1rem 3rem', borderRadius: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)' }}
          >
            START ANALYSIS
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
          <div style={{ width: '4rem', height: '4rem', border: '4px solid #1e293b', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem auto' }}></div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Extracting Biometrics</h2>
          <p style={{ color: '#64748b' }}>Running neural pose estimation and calculating angular velocities...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {status === 'completed' && result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Main Visualizer */}
            <div style={{ backgroundColor: '#000', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid #1f2937', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <SkeletonView
                frameData={result.skeleton_data[currentFrame]}
                comData={result.com_trajectory[currentFrame]}
                trajectory={result.com_trajectory}
              />
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: '#0a0a0a' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: '#3b82f6', border: 'none', borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <Play size={24} color="white" />
                </button>
                <div style={{ flexGrow: 1 }}>
                    <input
                      type="range"
                      min="0"
                      max={result.skeleton_data.length - 1}
                      value={currentFrame}
                      onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#3b82f6' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#4b5563', fontFamily: 'monospace' }}>
                        <span>FRAME {currentFrame}</span>
                        <span>{result.skeleton_data.length - 1}</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #1f2937' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#60a5fa', marginBottom: '0.75rem' }}>
                        <Target size={20} style={{ marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>MAX TUCK</span>
                    </div>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{Math.round(result.metrics.max_knee_flexion)}°</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Knee-Chest Angle</p>
                </div>
                <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #1f2937' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#a78bfa', marginBottom: '0.75rem' }}>
                        <TrendingUp size={20} style={{ marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>PEAK HEIGHT</span>
                    </div>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{Math.round(result.metrics.peak_height_norm * 100)}%</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Normalized vertical lift</p>
                </div>
                <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #1f2937' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#f472b6', marginBottom: '0.75rem' }}>
                        <Activity size={20} style={{ marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>AIRTIME</span>
                    </div>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{Math.round((result.phases[2].end - result.phases[1].start) / result.metrics.estimated_fps * 1000)}ms</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Flight duration</p>
                </div>
            </div>

            {/* Timeline */}
            <div style={{ backgroundColor: '#111827', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #1f2937' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>
                <Activity style={{ marginRight: '0.75rem', color: '#10b981' }} size={24} /> Movement Phases
              </h2>
              <div style={{ display: 'flex', width: '100%', height: '3rem', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)' }}>
                {result.phases.map((p, i) => (
                  <div
                    key={i}
                    style={{
                        width: `${((p.end - p.start) / result.skeleton_data.length) * 100}%`,
                        backgroundColor: i === 0 ? '#1d4ed8' : i === 1 ? '#7c3aed' : i === 2 ? '#db2777' : '#059669',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Comparison Engine */}
            <div style={{ backgroundColor: '#0f172a', padding: '1.75rem', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#60a5fa' }}>
                    <Award style={{ marginRight: '0.75rem' }} size={24} /> Elite Comparison
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {result.comparison.map((c, i) => (
                        <div key={i} style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>{c.metric}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: c.status === 'Elite' ? '#10b981' : c.status === 'Good' ? '#fbbf24' : '#ef4444' }}>{c.status}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flexGrow: 1, height: '4px', backgroundColor: '#334155', borderRadius: '2px' }}>
                                    <div style={{ width: `${Math.min(100, (c.user / (c.elite * 2)) * 100)}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
                                </div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', width: '40px', textAlign: 'right' }}>{Math.round(c.user)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coaching Insights */}
            <div style={{ backgroundColor: '#111827', padding: '1.75rem', borderRadius: '1.5rem', border: '1px solid #1f2937' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#fbbf24' }}>
                <Info style={{ marginRight: '0.75rem' }} size={24} /> Actionable Feedback
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {result.insights.map((insight, i) => (
                  <div key={i} style={{ borderLeft: `4px solid ${insight.type === 'error' ? '#ef4444' : insight.type === 'warning' ? '#fbbf24' : '#10b981'}`, paddingLeft: '1.25rem' }}>
                    <p style={{ fontWeight: '800', color: '#f3f4f6', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{insight.message}</p>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>{insight.detail}</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', display: 'inline-block', backgroundColor: '#1f2937', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', color: '#6b7280', fontWeight: 'bold' }}>
                        PHASE: {insight.phase.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
