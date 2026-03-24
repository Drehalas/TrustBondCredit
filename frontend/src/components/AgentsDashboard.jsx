import React, { useState } from 'react';
import './AgentsDashboard.css';

const agentsData = [
  {
    name: 'ZyFi',
    ticker: 'ZYFI',
    color: 'rgb(168, 85, 247)',
    score: 81,
    trend: '↑',
    trendColor: 'rgb(34, 197, 94)',
    totalApy: '10.17%',
    nativeApy: '10.17%',
    volume: '$16K',
    yield: '$57.58',
    txns: 8,
    grade: 'A',
    dims: { perf: 91, risk: 66, stab: 78, sent: 82, prov: 89 }
  },
  {
    name: 'Giza',
    ticker: 'ARMA',
    color: 'rgb(188, 237, 98)',
    score: 80,
    trend: '→',
    trendColor: 'var(--bondcredit-s2)',
    totalApy: '14.30%',
    nativeApy: '5.27%',
    volume: '$97K',
    yield: '$79.92',
    txns: 48,
    grade: 'A',
    dims: { perf: 82, risk: 71, stab: 88, sent: 76, prov: 84 }
  },
  {
    name: 'Mamo',
    ticker: 'MAMO',
    color: 'rgb(0, 209, 128)',
    score: 82,
    trend: '↑',
    trendColor: 'rgb(34, 197, 94)',
    totalApy: '5.21%',
    nativeApy: '4.77%',
    volume: '$221K',
    yield: '$30.00',
    txns: 110,
    grade: 'A',
    dims: { perf: 79, risk: 84, stab: 81, sent: 88, prov: 77 }
  },
  {
    name: 'SurfLiquid',
    ticker: 'SURF',
    color: 'rgb(249, 115, 22)',
    score: 67,
    trend: '↓',
    trendColor: 'rgb(239, 68, 68)',
    totalApy: '16.49%',
    nativeApy: '5.91%',
    volume: '$8K',
    yield: '$91.50',
    txns: 5,
    grade: 'B-',
    dims: { perf: 74, risk: 58, stab: 69, sent: 65, prov: 72 }
  },
  {
    name: 'Sail',
    ticker: 'SAIL',
    color: 'rgb(74, 144, 184)',
    score: 69,
    trend: '→',
    trendColor: 'var(--bondcredit-s2)',
    totalApy: '6.41%',
    nativeApy: '6.39%',
    volume: '$419K',
    yield: '$36.75',
    txns: 399,
    grade: 'B-',
    dims: { perf: 68, risk: 62, stab: 74, sent: 71, prov: 80 }
  }
];

export const AgentsDashboard = ({ onRegisterClick }) => {
  const [activeTab, setActiveTab] = useState('ZyFi');
  const [search, setSearch] = useState('');

  // Find the active agent object based on activeTab name
  const activeAgent = agentsData.find(agent => agent.name === activeTab) || agentsData[0];

  const filteredAgents = agentsData.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="agents-dashboard-container col-span-full">
      <h2 className="sh2">Agent Credit Scores</h2>
      <div className="agent-search-wrap">
        <div className="agent-search-inner">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="5.5" cy="5.5" r="4" stroke="#71717a" strokeWidth="1.4"></circle>
            <line x1="8.7" y1="8.7" x2="13" y2="13" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round"></line>
          </svg>
          <input
            className="agent-search"
            placeholder="Search agents by name or ticker…"
            spellcheck="false"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="agent-search-count">{filteredAgents.length} of {agentsData.length} agents</span>
          <button className="btn-register-agent" onClick={onRegisterClick}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: '6px' }}>
              <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Register Agent
          </button>
        </div>
      </div>

      <div className="agents-grid-5">
        {filteredAgents.map(agent => (
          <div
            key={agent.name}
            className={`agent-card-5 ${activeAgent.name === agent.name ? 'active' : ''}`}
            onClick={() => setActiveAgent(agent)}
          >
            <div className="card-header" style={{ padding: '0px', border: 'none' }}>
              <div className="card-header-left">
                <div className="card-dot" style={{ background: agent.color }}></div>
                <span className="card-name">{agent.name}</span>
              </div>
              <div className="card-header-right">
                <span
                  className="ticker-badge"
                  style={{
                    color: agent.color,
                    background: agent.color.replace('rgb', 'rgba').replace(')', ', 0.12)'),
                    border: `1px solid ${agent.color.replace('rgb', 'rgba').replace(')', ', 0.25)')}`
                  }}
                >
                  {agent.ticker}
                </span>
                <span className={`grade-badge grade-${agent.grade.toLowerCase().replace('-', '')}`}>
                  {agent.grade}
                </span>
              </div>
            </div>

            <div className="bond-score-display" style={{ padding: '4px 0px' }}>
              <div className="bond-score-label">BOND SCORE</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <div className="bond-score-number">{agent.score}</div>
                <span style={{ fontSize: '18px', color: agent.trendColor }}>{agent.trend}</span>
              </div>
            </div>

            <div className="card-apy-row">
              <div className="card-apy-item">
                <span className="card-apy-label">Total APY</span>
                <span className="card-apy-val" style={{ color: agent.color }}>{agent.totalApy}</span>
              </div>
              <div className="card-apy-divider"></div>
              <div className="card-apy-item">
                <span className="card-apy-label">Native APY</span>
                <span className="card-apy-val">{agent.nativeApy}</span>
              </div>
            </div>

            <div className="card-apy-row">
              <div className="card-apy-item">
                <span className="card-apy-label">Volume</span>
                <span className="card-apy-val">{agent.volume}</span>
              </div>
              <div className="card-apy-divider"></div>
              <div className="card-apy-item">
                <span className="card-apy-label">Yield</span>
                <span className="card-apy-val" style={{ color: 'rgb(34, 197, 94)' }}>{agent.yield}</span>
              </div>
              <div className="card-apy-divider"></div>
              <div className="card-apy-item">
                <span className="card-apy-label">Txns</span>
                <span className="card-apy-val">{agent.txns}</span>
              </div>
            </div>

            <div className="dim-bars" style={{ padding: '0px' }}>
              {Object.entries(agent.dims).map(([label, val]) => (
                <div key={label} className="dim-row">
                  <span className="dim-label">{label.toUpperCase()}</span>
                  <div className="dim-track">
                    <div className="dim-fill" style={{ width: `${val}%`, background: agent.color }}></div>
                  </div>
                  <span className="dim-val">{val}</span>
                </div>
              ))}
            </div>
            <div className="card-hint">View Report →</div>
          </div>
        ))}
      </div>

      <div className="agent-report">
        <div className="agent-tabs">
          {agentsData.map(agent => (
            <button
              key={agent.name}
              className={`agent-tab ${activeAgent.name === agent.name ? 'active' : ''}`}
              style={{ borderBottomColor: activeAgent.name === agent.name ? agent.color : 'transparent' }}
              onClick={() => setActiveAgent(agent)}
            >
              <span className="agent-tab-dot" style={{ background: agent.color }}></span>
              {agent.name}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
