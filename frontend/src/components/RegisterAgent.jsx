import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { registerAgent } from '../services/registryClient';
import './RegisterAgent.css';

function parseSkillMarkdown(markdown) {
  const readHeader = (patterns) => {
    for (const pattern of patterns) {
      const match = markdown.match(pattern);
      if (match?.[1]) return match[1].trim();
    }
    return '';
  };

  return {
    name: readHeader([/^[#\s-]*Agent Name\s*:\s*(.+)$/im, /^[#\s-]*Name\s*:\s*(.+)$/im]),
    ticker: readHeader([/^[#\s-]*Ticker\s*:\s*(.+)$/im, /^[#\s-]*Symbol\s*:\s*(.+)$/im]).toUpperCase(),
    description: readHeader([/^[#\s-]*Description\s*:\s*(.+)$/im]),
    uaid: readHeader([/^[#\s-]*UAID\s*:\s*(.+)$/im])
  };
}

export const RegisterAgent = ({ onBack, onRegistered }) => {
  const [mode, setMode] = useState('upload');
  const [manual, setManual] = useState({ name: '', ticker: '', description: '', uaid: '' });
  const [skillMarkdown, setSkillMarkdown] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const parsedSkill = useMemo(() => parseSkillMarkdown(skillMarkdown), [skillMarkdown]);

  const payload = mode === 'upload'
    ? {
      name: parsedSkill.name || manual.name,
      ticker: parsedSkill.ticker || manual.ticker,
      description: parsedSkill.description || manual.description,
      uaid: parsedSkill.uaid || manual.uaid,
      skillMarkdown,
      source: 'skill_upload',
      metadata: { fileName: sourceName || null }
    }
    : {
      ...manual,
      source: 'manual'
    };

  const canSubmit = Boolean(String(payload.name || '').trim() && String(payload.ticker || '').trim());

  const handleFileInput = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setSourceName(file.name);
    setSkillMarkdown(text);
    const parsed = parseSkillMarkdown(text);
    setManual((prev) => ({
      ...prev,
      name: parsed.name || prev.name,
      ticker: parsed.ticker || prev.ticker,
      description: parsed.description || prev.description,
      uaid: parsed.uaid || prev.uaid
    }));
  };

  const submit = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const response = await registerAgent({
        name: String(payload.name || '').trim(),
        ticker: String(payload.ticker || '').trim().toUpperCase(),
        description: String(payload.description || '').trim(),
        uaid: String(payload.uaid || '').trim() || null,
        skillMarkdown: skillMarkdown || '',
        source: payload.source,
        metadata: payload.metadata || {}
      });
      setResult(response);
      onRegistered?.(response);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="register-agent-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="register-container">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </button>

        <header className="register-header">
          <span className="kicker">REGISTER + SCORE</span>
          <h1>Register Your AI Agent</h1>
          <p className="subtitle">Upload SKILL.md or fill in metadata manually. Once registered, your BondCredit score is generated immediately.</p>
        </header>

        <section className="register-form-card">
          <div className="mode-switch" role="tablist" aria-label="Registration mode">
            <button
              className={`mode-btn ${mode === 'upload' ? 'active' : ''}`}
              onClick={() => setMode('upload')}
              type="button"
            >
              Upload SKILL.md
            </button>
            <button
              className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
              type="button"
            >
              Manual Entry
            </button>
          </div>

          {mode === 'upload' && (
            <div className="upload-wrap">
              <label className="field file-field">
                <span>SKILL.md file</span>
                <input type="file" accept=".md,text/markdown" onChange={handleFileInput} />
              </label>
              <p className="muted-text">Parsed fields auto-fill below. You can still edit them before submit.</p>
            </div>
          )}

          <div className="form-grid">
            <label className="field">
              <span>Agent Name *</span>
              <input
                value={manual.name}
                onChange={(e) => setManual((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Volatility Sentinel"
              />
            </label>
            <label className="field">
              <span>Ticker *</span>
              <input
                value={manual.ticker}
                onChange={(e) => setManual((prev) => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                placeholder="VSNT"
                maxLength={8}
              />
            </label>
            <label className="field">
              <span>UAID (optional)</span>
              <input
                value={manual.uaid}
                onChange={(e) => setManual((prev) => ({ ...prev, uaid: e.target.value }))}
                placeholder="uaid:aid:volatility-sentinel"
              />
            </label>
            <label className="field field-wide">
              <span>Description</span>
              <textarea
                value={manual.description}
                onChange={(e) => setManual((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Short summary of your strategy and capabilities"
                rows={3}
              />
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="submit-row">
            <button className="primary-cta" onClick={submit} disabled={isSubmitting || !canSubmit} type="button">
              {isSubmitting ? 'Submitting...' : 'Register Agent'}
            </button>
            <span className="muted-text">Next step: get your score and appear in the dashboard list.</span>
          </div>

          {result?.ok && (
            <div className="score-result">
              <div className="score-result-main">
                <h3>{result.agent.name}</h3>
                <p>{result.agent.ticker} · {result.scoring.source}</p>
              </div>
              <div className="score-pill">
                <strong>{result.scoring.score}</strong>
                <span>/100</span>
              </div>
              <div className="result-dims">
                {Object.entries(result.scoring.dimensions || {}).map(([key, value]) => (
                  <div key={key} className="result-dim-item">
                    <span>{key.toUpperCase()}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <h2 className="guide-heading">Reference Docs</h2>

        <div className="steps-grid">
          <section className="step-card">
            <div className="step-number">01</div>
            <h3>Create SKILL.md</h3>
            <p>Every agent in the BondCredit ecosystem is defined by a <code>SKILL.md</code> file. This file acts as the manifest for your agent's capabilities.</p>
            <div className="code-snippet">
              <pre><code>{`# Agent Name: MyAgent
# Ticker: MYA
# Description: Describe what your agent does.

## Capabilities
- Portfolio Rebalancing
- Risk Assessment`}</code></pre>
            </div>
          </section>

          <section className="step-card">
            <div className="step-number">02</div>
            <h3>Define Metadata</h3>
            <p>Ensure your <code>SKILL.md</code> contains the required metadata headers. These are used to categorize your agent and display its information on the dashboard.</p>
            <ul className="requirements-list">
              <li><strong>Agent Name:</strong> Human-readable name</li>
              <li><strong>Ticker:</strong> 3-5 character unique identifier</li>
              <li><strong>Version:</strong> Current semantic version</li>
            </ul>
          </section>

          <section className="step-card">
            <div className="step-number">03</div>
            <h3>Placement</h3>
            <p>Place your completed <code>SKILL.md</code> file in the <code>.agents/</code> or <code>.skills/</code> directory of your project repository.</p>
            <div className="file-tree">
              <div className="tree-item">📁 my-project/</div>
              <div className="tree-item">  📁 .agents/</div>
              <div className="tree-item highlight">    📄 SKILL.md</div>
              <div className="tree-item">  📄 package.json</div>
            </div>
          </section>

          <section className="step-card">
            <div className="step-number">04</div>
            <h3>Network Broadcast</h3>
            <p>Once your file is in place, the Hedera Agent Kit will broadcast your agent's presence to the network. No manual submission is required.</p>
            <div className="status-badge">
              <span className="pulse-dot"></span>
              Automatic Discovery Enabled
            </div>
          </section>
        </div>

        <footer className="register-footer">
          <div className="help-box">
            <h4>Need Help?</h4>
            <p>Join our developer Discord or check out the full <a href="https://docs.bond.credit" target="_blank" rel="noopener noreferrer">Hedera Agent Kit Documentation</a>.</p>
          </div>
          <button className="primary-cta" onClick={onBack}>I'm Ready, Let's Go</button>
        </footer>
      </div>
    </motion.div>
  );
};
