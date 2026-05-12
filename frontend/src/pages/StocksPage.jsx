/**
 * pages/StocksPage.jsx
 * Full Indian stock market page — NSE stocks with live prices,
 * search, sector filter, watchlist, sparkline mini-charts
 * API: Yahoo Finance via allorigins.win (free, no key needed)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  FiRefreshCw, FiSearch, FiArrowUp, FiArrowDown,
  FiStar, FiTrendingUp, FiTrendingDown, FiActivity,
  FiFilter, FiInfo,
} from 'react-icons/fi';

// ── Full stock list with sectors ────────────────────────────────────────────
const ALL_STOCKS = [
  // Large Cap / Index
  { symbol:'RELIANCE.NS',  name:'Reliance Industries',  short:'RELIANCE',  sector:'Energy'      },
  { symbol:'TCS.NS',        name:'Tata Consultancy',     short:'TCS',       sector:'IT'          },
  { symbol:'HDFCBANK.NS',  name:'HDFC Bank',             short:'HDFC Bank', sector:'Banking'     },
  { symbol:'INFY.NS',       name:'Infosys',              short:'INFY',      sector:'IT'          },
  { symbol:'ICICIBANK.NS', name:'ICICI Bank',            short:'ICICI',     sector:'Banking'     },
  { symbol:'HINDUNILVR.NS',name:'Hindustan Unilever',    short:'HUL',       sector:'FMCG'        },
  { symbol:'ITC.NS',        name:'ITC Limited',          short:'ITC',       sector:'FMCG'        },
  { symbol:'SBIN.NS',       name:'State Bank of India',  short:'SBI',       sector:'Banking'     },
  { symbol:'BAJFINANCE.NS', name:'Bajaj Finance',        short:'BAJFIN',    sector:'Finance'     },
  { symbol:'BHARTIARTL.NS',name:'Bharti Airtel',         short:'AIRTEL',    sector:'Telecom'     },
  { symbol:'WIPRO.NS',      name:'Wipro',                short:'WIPRO',     sector:'IT'          },
  { symbol:'HCLTECH.NS',   name:'HCL Technologies',      short:'HCLTECH',   sector:'IT'          },
  { symbol:'ADANIENT.NS',  name:'Adani Enterprises',     short:'ADANI',     sector:'Conglomerate'},
  { symbol:'MARUTI.NS',    name:'Maruti Suzuki',          short:'MARUTI',    sector:'Auto'        },
  { symbol:'TATAMOTORS.NS',name:'Tata Motors',            short:'TATAMOT',   sector:'Auto'        },
  { symbol:'SUNPHARMA.NS', name:'Sun Pharmaceutical',    short:'SUNPHARMA', sector:'Pharma'      },
  { symbol:'NTPC.NS',       name:'NTPC Limited',         short:'NTPC',      sector:'Energy'      },
  { symbol:'POWERGRID.NS', name:'Power Grid Corp',        short:'POWGRID',   sector:'Energy'      },
  { symbol:'ONGC.NS',       name:'ONGC',                 short:'ONGC',      sector:'Energy'      },
  { symbol:'TITAN.NS',      name:'Titan Company',        short:'TITAN',     sector:'Consumer'    },
];

const SECTORS = ['All', 'IT', 'Banking', 'Energy', 'FMCG', 'Finance', 'Auto', 'Pharma', 'Telecom', 'Conglomerate', 'Consumer'];

// ── Fetch one stock from Yahoo Finance ─────────────────────────────────────
const fetchStock = async (symbol) => {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`;
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxy, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const json = await res.json();
    const data = JSON.parse(json.contents);
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const quote    = result.indicators?.quote?.[0];
    const closes   = quote?.close?.filter(Boolean) || [];
    const opens    = quote?.open?.filter(Boolean)  || [];
    const highs    = quote?.high?.filter(Boolean)  || [];
    const lows     = quote?.low?.filter(Boolean)   || [];
    const volumes  = quote?.volume?.filter(Boolean)|| [];
    const meta     = result.meta;

    if (!closes.length) return null;

    const current  = meta.regularMarketPrice || closes[closes.length - 1];
    const prevClose= meta.previousClose || closes[0];
    const change   = current - prevClose;
    const changePct= (change / prevClose) * 100;

    // Build sparkline data (last 20 points)
    const sparkline = closes.slice(-20).map((v, i) => ({ v }));

    return {
      price:     current,
      prevClose: prevClose,
      change,
      changePct,
      high:      meta.regularMarketDayHigh || Math.max(...highs),
      low:       meta.regularMarketDayLow  || Math.min(...lows),
      open:      opens[0] || prevClose,
      volume:    volumes.reduce((a, b) => a + b, 0),
      mktCap:    meta.marketCap,
      sparkline,
    };
  } catch {
    return null;
  }
};

// Format volume/market cap compactly
const fmt = (n) => {
  if (!n) return '—';
  if (n >= 1e12) return `₹${(n/1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `₹${(n/1e9).toFixed(2)}B`;
  if (n >= 1e7)  return `₹${(n/1e7).toFixed(2)}Cr`;
  if (n >= 1e5)  return `₹${(n/1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

// ── Sparkline mini chart ────────────────────────────────────────────────────
const Sparkline = ({ data, up }) => (
  <ResponsiveContainer width={80} height={36}>
    <LineChart data={data}>
      <Line
        type="monotone"
        dataKey="v"
        stroke={up ? '#10b981' : '#ef4444'}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
      <Tooltip
        contentStyle={{ display: 'none' }}
        wrapperStyle={{ display: 'none' }}
      />
    </LineChart>
  </ResponsiveContainer>
);

// ── Market summary header card ──────────────────────────────────────────────
const MarketCard = ({ label, value, sub, up }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-xl font-black text-gray-900 dark:text-white">{value}</p>
    {sub && (
      <p className={`text-xs font-semibold mt-0.5 flex items-center gap-1 ${up ? 'text-emerald-500' : 'text-red-500'}`}>
        {up ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
        {sub}
      </p>
    )}
  </div>
);

export default function StocksPage() {
  const [stockData, setStockData]     = useState({});
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch]           = useState('');
  const [sector, setSector]           = useState('All');
  const [sortBy, setSortBy]           = useState('changePct');
  const [sortDir, setSortDir]         = useState('desc');
  const [watchlist, setWatchlist]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist') || '[]'); } catch { return []; }
  });
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // ── Load all stocks in parallel batches ──────────────────────────────────
  const loadStocks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setLoadingMore(true); else setLoading(true);

    const BATCH = 5; // Load 5 at a time to avoid rate limiting
    const results = {};

    for (let i = 0; i < ALL_STOCKS.length; i += BATCH) {
      const batch = ALL_STOCKS.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async (s) => {
          const data = await fetchStock(s.symbol);
          if (data) results[s.symbol] = data;
        })
      );
      // Small delay between batches to avoid rate limit
      if (i + BATCH < ALL_STOCKS.length) {
        await new Promise(r => setTimeout(r, 300));
      }
      // Update progressively as each batch comes in
      setStockData(prev => ({ ...prev, ...results }));
    }

    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
    setLoading(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    loadStocks();
    intervalRef.current = setInterval(() => loadStocks(true), 60000);
    return () => clearInterval(intervalRef.current);
  }, [loadStocks]);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = ALL_STOCKS
    .filter(s => {
      if (showWatchlistOnly && !watchlist.includes(s.symbol)) return false;
      if (sector !== 'All' && s.sector !== sector) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.short.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const da = stockData[a.symbol];
      const db = stockData[b.symbol];
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      const va = da[sortBy] ?? 0;
      const vb = db[sortBy] ?? 0;
      return sortDir === 'asc' ? va - vb : vb - va;
    });

  // ── Market summary stats ──────────────────────────────────────────────────
  const loaded = Object.values(stockData);
  const gainers = loaded.filter(s => s.changePct > 0).length;
  const losers  = loaded.filter(s => s.changePct < 0).length;
  const avgChange = loaded.length
    ? (loaded.reduce((a, s) => a + s.changePct, 0) / loaded.length).toFixed(2)
    : null;

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-600 text-xs">↕</span>;
    return <span className="text-indigo-400 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📈 Indian Stock Market
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              NSE Live
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {lastUpdated ? `Last updated: ${lastUpdated} · Auto-refreshes every 60s` : 'Loading market data...'}
          </p>
        </div>
        <button
          onClick={() => loadStocks(true)}
          disabled={loadingMore}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 transition disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Market Summary Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MarketCard label="Stocks Tracked"   value={`${loaded.length}/${ALL_STOCKS.length}`} />
        <MarketCard label="Gainers Today"    value={gainers}  sub={`${gainers} stocks up`}       up={true}  />
        <MarketCard label="Losers Today"     value={losers}   sub={`${losers} stocks down`}       up={false} />
        <MarketCard
          label="Avg Market Move"
          value={avgChange ? `${avgChange > 0 ? '+' : ''}${avgChange}%` : '—'}
          sub={avgChange ? (parseFloat(avgChange) > 0 ? 'Market up today' : 'Market down today') : null}
          up={parseFloat(avgChange) > 0}
        />
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Watchlist toggle */}
          <button
            onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
              showWatchlistOnly
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiStar className={`w-4 h-4 ${showWatchlistOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            Watchlist ({watchlist.length})
          </button>
        </div>
        {/* Sector filter pills */}
        <div className="flex flex-wrap gap-2">
          {SECTORS.map(s => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                sector === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stock Table ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px_44px] gap-2 px-5 py-3 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <button onClick={() => handleSort('name')}    className="text-left flex items-center gap-1">Company <SortIcon field="name" /></button>
          <button onClick={() => handleSort('price')}   className="text-right flex items-center justify-end gap-1">Price <SortIcon field="price" /></button>
          <button onClick={() => handleSort('change')}  className="text-right flex items-center justify-end gap-1">Change <SortIcon field="change" /></button>
          <button onClick={() => handleSort('changePct')} className="text-right flex items-center justify-end gap-1">% Change <SortIcon field="changePct" /></button>
          <span className="text-right">Mkt Cap</span>
          <span className="text-center">7d Chart</span>
          <span />
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
              <p className="text-sm text-gray-400">Fetching live market data...</p>
              <p className="text-xs text-gray-500">Loading {ALL_STOCKS.length} stocks from NSE</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="text-gray-400 text-sm">No stocks match your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {filtered.map((stock, idx) => {
              const d   = stockData[stock.symbol];
              const up  = d ? d.changePct >= 0 : null;
              const inWL = watchlist.includes(stock.symbol);

              return (
                <div
                  key={stock.symbol}
                  className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px_44px] gap-2 px-5 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                >
                  {/* Company */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0 ${
                      ['bg-indigo-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500',
                       'bg-cyan-500','bg-pink-500','bg-teal-500','bg-orange-500','bg-blue-500'][idx % 10]
                    }`}>
                      {stock.short.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{stock.short}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[160px]">{stock.name}</p>
                    </div>
                    <span className="hidden lg:block text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{stock.sector}</span>
                  </div>

                  {/* Price */}
                  <p className="text-right font-bold text-gray-900 dark:text-white text-sm">
                    {d ? `₹${d.price.toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 })}` : '—'}
                  </p>

                  {/* Change ₹ */}
                  <p className={`text-right text-sm font-medium ${up === true ? 'text-emerald-500' : up === false ? 'text-red-500' : 'text-gray-400'}`}>
                    {d ? `${d.change >= 0 ? '+' : ''}${d.change.toFixed(2)}` : '—'}
                  </p>

                  {/* Change % */}
                  <div className="flex justify-end">
                    {d ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        up ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                           : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {up ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                        {Math.abs(d.changePct).toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </div>

                  {/* Market Cap */}
                  <p className="text-right text-xs text-gray-500">{d ? fmt(d.mktCap) : '—'}</p>

                  {/* Sparkline */}
                  <div className="flex justify-center">
                    {d?.sparkline?.length > 2 ? (
                      <Sparkline data={d.sparkline} up={up} />
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </div>

                  {/* Watchlist star */}
                  <button
                    onClick={() => toggleWatchlist(stock.symbol)}
                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title={inWL ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <FiStar className={`w-4 h-4 transition-colors ${inWL ? 'fill-amber-400 text-amber-400' : 'text-gray-400 hover:text-amber-400'}`} />
                  </button>
                </div>
              );
            })}

            {/* Mobile cards */}
            {filtered.map((stock, idx) => {
              const d  = stockData[stock.symbol];
              const up = d ? d.changePct >= 0 : null;
              const inWL = watchlist.includes(stock.symbol);

              return (
                <div key={`m-${stock.symbol}`} className="md:hidden flex items-center justify-between px-4 py-4 gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${
                      ['bg-indigo-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500',
                       'bg-cyan-500','bg-pink-500','bg-teal-500','bg-orange-500','bg-blue-500'][idx % 10]
                    }`}>
                      {stock.short.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{stock.short}</p>
                      <p className="text-xs text-gray-400">{stock.sector}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {d ? `₹${d.price.toLocaleString('en-IN', { maximumFractionDigits:0 })}` : '—'}
                      </p>
                      {d && (
                        <p className={`text-xs font-semibold ${up ? 'text-emerald-500' : 'text-red-500'}`}>
                          {up ? '+' : ''}{d.changePct.toFixed(2)}%
                        </p>
                      )}
                    </div>
                    <button onClick={() => toggleWatchlist(stock.symbol)}>
                      <FiStar className={`w-4 h-4 ${inWL ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center pb-2">
        Data from Yahoo Finance · 15–20 min delayed · Not financial advice · For educational/portfolio purposes only
      </p>
    </div>
  );
}
