import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonView from './components/SkeletonView';
import { Upload, Play, Info, Activity, Target, TrendingUp, Award, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function App() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState(null);

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
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', letterSpacing: '0.05em' }}>EVIDENCE-BASED BIOMECHANICAL ANALYSIS</p>
        </div>
      </header>

      {!jobId && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', border: '2px dashed #1e293b', borderRadius: '1.5rem', padding: '6rem 2rem' }}>
          <Upload size={64} color="#3b82f6" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Upload Backflip Video</h3>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: '2rem', color: '#94a3b8' }}
          />
          <button
            onClick={handleUpload}
            style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '1.125rem', padding: '1rem 3rem', borderRadius: '1rem', border: 'none', cursor: 'pointer' }}
          >
            START ANALYSIS
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
          <div style={{ width: '4rem', height: '4rem', border: '4px solid #1e293b', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem auto' }}></div>
          <h2 style={{ fontSize: '1.75rem' }}>Analyzing Biometrics...</h2>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {status === 'completed' && result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: '#000', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid #1f2937' }}>
              <SkeletonView
                frameData={result.skeleton_data[currentFrame]}
                comData={result.com_trajectory[currentFrame]}
                trajectory={result.com_trajectory}
              />
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: '#0a0a0a' }}>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: '#3b82f6', border: 'none', borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={24} color="white" />
                </button>
                <div style={{ flexGrow: 1 }}>
                    <input type="range" min="0" max={result.skeleton_data.length - 1} value={currentFrame} onChange={(e) => setCurrentFrame(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
                </div>
              </div>
            </div>

            {/* Performance Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {Object.entries(result.scores).map(([name, score]) => (
                    <div key={name} style={{ backgroundColor: '#111827', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #1f2937', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase' }}>{name}</p>
                        <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: score > 80 ? '#10b981' : score > 50 ? '#fbbf24' : '#ef4444' }}>{score}</p>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', width: '100%', height: '2.5rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
                {result.phases.map((p, i) => (
                  <div key={i} style={{ width: `${((p.end - p.start) / result.skeleton_data.length) * 100}%`, backgroundColor: i === 0 ? '#1d4ed8' : i === 1 ? '#7c3aed' : i === 2 ? '#db2777' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Explainable Insights */}
            <div style={{ backgroundColor: '#111827', padding: '1.75rem', borderRadius: '1.5rem', border: '1px solid #1f2937' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#fbbf24' }}>
                <Info style={{ marginRight: '0.75rem' }} size={24} /> Explainable Feedback
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {result.insights.map((insight, i) => (
                  <div key={i} style={{ backgroundColor: '#1f2937', borderRadius: '1rem', overflow: 'hidden' }}>
                    <div
                        onClick={() => setExpandedInsight(expandedInsight === i ? null : i)}
                        style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${insight.type === 'error' ? '#ef4444' : '#10b981'}` }}
                    >
                        <span style={{ fontWeight: 'bold' }}>{insight.message}</span>
                        {expandedInsight === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    {expandedInsight === i && (
                        <div style={{ padding: '1rem', backgroundColor: '#111827', fontSize: '0.875rem', borderTop: '1px solid #374151' }}>
                            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>{insight.detail}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 'bold' }}>MEASUREMENT</p>
                                    <p style={{ color: '#fff' }}>{insight.evidence.measurement}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 'bold' }}>THRESHOLD</p>
                                    <p style={{ color: '#fff' }}>{insight.evidence.threshold}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 'bold' }}>CALCULATION METHOD</p>
                                    <p style={{ color: '#fff' }}>{insight.evidence.method}</p>
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Elite Comparison */}
            <div style={{ backgroundColor: '#0f172a', padding: '1.75rem', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#60a5fa' }}>
                    <Award style={{ marginRight: '0.75rem' }} size={24} /> Elite Comparison
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {result.comparison.map((c, i) => (
                        <div key={i} style={{ padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                <span style={{ color: '#94a3b8' }}>{c.metric}</span>
                                <span style={{ color: c.status === 'Elite' ? '#10b981' : '#fbbf24' }}>{c.status}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                <span>YOU: {c.user}</span>
                                <span>ELITE: {c.elite}</span>
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
