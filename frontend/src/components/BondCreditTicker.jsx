import React from 'react';

const TickerItem = ({ symbol, price, change, isPositive }) => (
  <div className="flex items-center gap-2 px-6 py-2 border-r border-bondcredit-border">
    <span className="text-mono font-bold text-bondcredit-white">{symbol}</span>
    <span className="text-mono text-bondcredit-s1">{price}</span>
    <span className={`text-mono text-xs font-medium ${isPositive ? 'text-bondcredit-green' : 'text-bondcredit-red'}`}>
      {isPositive ? '▲' : '▼'} {change}
    </span>
  </div>
);

const BondCreditTicker = () => {
  const items = [
    { symbol: 'BTC', price: '$94,432.12', change: '2.4%', isPositive: true },
    { symbol: 'ETH', price: '$3,124.55', change: '1.2%', isPositive: false },
    { symbol: 'HBAR', price: '$0.1452', change: '5.8%', isPositive: true },
    { symbol: 'USDC', price: '$1.00', change: '0.01%', isPositive: true },
    { symbol: 'MAMO', price: '$0.124', change: '15.2%', isPositive: true },
    { symbol: 'GIZA', price: '$1.205', change: '5.5%', isPositive: true },
  ];

  // Duplicate items for seamless loop
  const displayItems = [...items, ...items];

  return (
    <div className="ticker-wrap overflow-hidden">
      <div className="animate-scroll flex whitespace-nowrap">
        {displayItems.map((item, idx) => (
          <TickerItem key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default BondCreditTicker;
