import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonView from './components/SkeletonView';
import { Upload, Play, Info, Activity } from 'lucide-react';

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
    <div id="app-container" style={{ minHeight: '100vh', backgroundColor: 'black', color: 'white', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: '#3b82f6' }}>
          Movement Intelligence Platform
        </h1>
        <p style={{ color: '#999' }}>Prototype v0.1 | End-to-End Analysis</p>
      </header>

      {!jobId && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #444', borderRadius: '1rem', padding: '5rem' }}>
          <Upload size={48} color="#3b82f6" style={{ marginBottom: '1rem' }} />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: '1.5rem', color: '#999' }}
          />
          <button
            onClick={handleUpload}
            style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
          >
            Analyze Movement
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <p style={{ fontSize: '1.25rem' }}>Processing your movement... extracted 3D data coming soon.</p>
        </div>
      )}

      {status === 'completed' && result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#111', borderRadius: '1rem', overflow: 'hidden' }}>
              <SkeletonView frameData={result.skeleton_data[currentFrame]} />
              <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#222' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: '#2563eb', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Play size={20} color="white" />
                </button>
                <input
                  type="range"
                  min="0"
                  max={result.skeleton_data.length - 1}
                  value={currentFrame}
                  onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                  style={{ flexGrow: 1 }}
                />
                <span style={{ fontFamily: 'monospace' }}>{currentFrame} / {result.skeleton_data.length - 1}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1rem 0' }}>
                <Activity style={{ marginRight: '0.5rem', color: '#4ade80' }} size={20} /> Movement Phases
              </h2>
              <div style={{ display: 'flex', width: '100%', height: '2rem', borderRadius: '9999px', overflow: 'hidden' }}>
                {result.phases.map((p, i) => (
                  <div
                    key={i}
                    style={{
                        width: `${((p.end - p.start) / result.skeleton_data.length) * 100}%`,
                        backgroundColor: i === 0 ? '#3b82f6' : i === 1 ? '#a855f7' : '#ec4899',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold'
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #333' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1rem 0', color: '#fbbf24' }}>
                <Info style={{ marginRight: '0.5rem' }} size={20} /> Coaching Insights
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {result.insights.map((insight, i) => (
                  <div key={i} style={{ borderLeft: '2px solid #444', paddingLeft: '1rem' }}>
                    <p style={{ fontWeight: 'bold', color: '#60a5fa', margin: '0 0 0.5rem 0' }}>{insight.phase}</p>
                    <ul style={{ fontSize: '0.875rem', color: '#ccc', paddingLeft: '1.25rem', margin: 0 }}>
                      {insight.cues.map((cue, ci) => <li key={ci}>{cue}</li>)}
                    </ul>
                    <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.5rem' }}>Watch for: {insight.mistakes.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #333' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#4ade80' }}>Knowledge Graph</h2>
              <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '1rem' }}>Related Movements</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {result.related_movements.map((rel, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#222', borderRadius: '0.5rem' }}>
                    <span style={{ flexGrow: 1 }}>{rel.name}</span>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#333', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', color: '#ccc' }}>{rel.relationship}</span>
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
