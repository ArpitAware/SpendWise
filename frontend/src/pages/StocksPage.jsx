/**
 * pages/StocksPage.jsx
 * Indian Stock Market — NSE live prices via Yahoo Finance
 * Proxy: corsproxy.io (primary) → allorigins.win (fallback)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import {
  FiRefreshCw, FiSearch, FiArrowUp, FiArrowDown,
  FiStar, FiTrendingUp, FiTrendingDown, FiActivity,
} from 'react-icons/fi';

// ── Stock list ──────────────────────────────────────────────────────────────
const ALL_STOCKS = [
  { symbol:'RELIANCE.NS',   name:'Reliance Industries',  short:'RELIANCE',  sector:'Energy'      },
  { symbol:'TCS.NS',         name:'Tata Consultancy',     short:'TCS',       sector:'IT'          },
  { symbol:'HDFCBANK.NS',   name:'HDFC Bank',             short:'HDFC Bank', sector:'Banking'     },
  { symbol:'INFY.NS',        name:'Infosys',              short:'INFY',      sector:'IT'          },
  { symbol:'ICICIBANK.NS',  name:'ICICI Bank',            short:'ICICI',     sector:'Banking'     },
  { symbol:'HINDUNILVR.NS', name:'Hindustan Unilever',    short:'HUL',       sector:'FMCG'        },
  { symbol:'ITC.NS',         name:'ITC Limited',          short:'ITC',       sector:'FMCG'        },
  { symbol:'SBIN.NS',        name:'State Bank of India',  short:'SBI',       sector:'Banking'     },
  { symbol:'BAJFINANCE.NS',  name:'Bajaj Finance',        short:'BAJFIN',    sector:'Finance'     },
  { symbol:'BHARTIARTL.NS', name:'Bharti Airtel',         short:'AIRTEL',    sector:'Telecom'     },
  { symbol:'WIPRO.NS',       name:'Wipro',                short:'WIPRO',     sector:'IT'          },
  { symbol:'HCLTECH.NS',    name:'HCL Technologies',      short:'HCLTECH',   sector:'IT'          },
  { symbol:'ADANIENT.NS',   name:'Adani Enterprises',     short:'ADANI',     sector:'Conglomerate'},
  { symbol:'MARUTI.NS',     name:'Maruti Suzuki',          short:'MARUTI',    sector:'Auto'        },
  { symbol:'TATAMOTORS.NS', name:'Tata Motors',            short:'TATAMOT',   sector:'Auto'        },
  { symbol:'SUNPHARMA.NS',  name:'Sun Pharmaceutical',    short:'SUNPHARMA', sector:'Pharma'      },
  { symbol:'NTPC.NS',        name:'NTPC Limited',         short:'NTPC',      sector:'Energy'      },
  { symbol:'POWERGRID.NS',  name:'Power Grid Corp',        short:'POWGRID',   sector:'Energy'      },
  { symbol:'ONGC.NS',        name:'ONGC',                 short:'ONGC',      sector:'Energy'      },
  { symbol:'TITAN.NS',       name:'Titan Company',        short:'TITAN',     sector:'Consumer'    },
];

const SECTORS = ['All','IT','Banking','Energy','FMCG','Finance','Auto','Pharma','Telecom','Conglomerate','Consumer'];

const AVATAR_COLORS = [
  'bg-indigo-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500',
  'bg-cyan-500','bg-pink-500','bg-teal-500','bg-orange-500','bg-blue-500',
];

// ── Format large numbers ────────────────────────────────────────────────────
const fmt = (n) => {
  if (!n) return '—';
  if (n >= 1e12) return `₹${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `₹${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e7)  return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5)  return `₹${(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

// ── Parse Yahoo Finance response ────────────────────────────────────────────
const parseYahoo = (data) => {
  try {
    const result = data?.chart?.result?.[0];
    if (!result) return null;
    const quote  = result.indicators?.quote?.[0];
    const closes = (quote?.close  || []).filter(Boolean);
    const highs  = (quote?.high   || []).filter(Boolean);
    const lows   = (quote?.low    || []).filter(Boolean);
    const opens  = (quote?.open   || []).filter(Boolean);
    const vols   = (quote?.volume || []).filter(Boolean);
    if (!closes.length) return null;
    const meta      = result.meta;
    const current   = meta.regularMarketPrice  || closes[closes.length - 1];
    const prevClose = meta.previousClose        || closes[0];
    const change    = current - prevClose;
    const changePct = prevClose ? (change / prevClose) * 100 : 0;
    return {
      price:     current,
      prevClose, change, changePct,
      high:      meta.regularMarketDayHigh || Math.max(...highs),
      low:       meta.regularMarketDayLow  || Math.min(...lows),
      open:      opens[0] || prevClose,
      volume:    vols.reduce((a, b) => a + b, 0),
      mktCap:    meta.marketCap || null,
      sparkline: closes.slice(-20).map((v) => ({ v })),
    };
  } catch { return null; }
};

// ── Fetch with fallback proxies ─────────────────────────────────────────────
const fetchStock = async (symbol) => {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`;

  // Proxy 1: corsproxy.io
  try {
    const res = await fetch(
      `https://corsproxy.io/?${encodeURIComponent(yahooUrl)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) {
      const data = await res.json();
      const r = parseYahoo(data);
      if (r) return r;
    }
  } catch {}

  // Proxy 2: allorigins.win (wraps response in .contents string)
  try {
    const res = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) {
      const json = await res.json();
      const data = JSON.parse(json.contents);
      const r = parseYahoo(data);
      if (r) return r;
    }
  } catch {}

  // Proxy 3: thingproxy
  try {
    const res = await fetch(
      `https://thingproxy.freeboard.io/fetch/${yahooUrl}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) {
      const data = await res.json();
      const r = parseYahoo(data);
      if (r) return r;
    }
  } catch {}

  return null;
};

// ── Sparkline ───────────────────────────────────────────────────────────────
const Sparkline = ({ data, up }) => (
  <ResponsiveContainer width={80} height={36}>
    <LineChart data={data}>
      <Line
        type="monotone" dataKey="v"
        stroke={up ? '#10b981' : '#ef4444'}
        strokeWidth={1.5} dot={false} isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

// ── Market summary card ─────────────────────────────────────────────────────
const SummaryCard = ({ label, value, sub, up }) => (
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
  const [stockData, setStockData]           = useState({});
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [search, setSearch]                 = useState('');
  const [sector, setSector]                 = useState('All');
  const [sortBy, setSortBy]                 = useState('changePct');
  const [sortDir, setSortDir]               = useState('desc');
  const [watchlist, setWatchlist]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('sw_watchlist') || '[]'); } catch { return []; }
  });
  const [showWatchlistOnly, setShowWL]      = useState(false);
  const [lastUpdated, setLastUpdated]       = useState(null);
  const [loadedCount, setLoadedCount]       = useState(0);
  const intervalRef = useRef(null);

  // ── Load all stocks in batches ──────────────────────────────────────────
  const loadStocks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else { setLoading(true); setLoadedCount(0); }

    const BATCH = 4;
    for (let i = 0; i < ALL_STOCKS.length; i += BATCH) {
      const batch = ALL_STOCKS.slice(i, i + BATCH);
      const results = {};
      await Promise.all(
        batch.map(async (s) => {
          const data = await fetchStock(s.symbol);
          if (data) results[s.symbol] = data;
        })
      );
      setStockData(prev => ({ ...prev, ...results }));
      setLoadedCount(prev => prev + batch.length);
      if (i + BATCH < ALL_STOCKS.length) {
        await new Promise(r => setTimeout(r, 250));
      }
    }

    setLastUpdated(
      new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadStocks();
    intervalRef.current = setInterval(() => loadStocks(true), 60000);
    return () => clearInterval(intervalRef.current);
  }, [loadStocks]);

  useEffect(() => {
    localStorage.setItem('sw_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWL = (sym) =>
    setWatchlist(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  // ── Filter + sort ───────────────────────────────────────────────────────
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

  // ── Market summary ──────────────────────────────────────────────────────
  const loaded    = Object.values(stockData);
  const gainers   = loaded.filter(s => s.changePct > 0).length;
  const losers    = loaded.filter(s => s.changePct < 0).length;
  const avgChange = loaded.length
    ? (loaded.reduce((a, s) => a + s.changePct, 0) / loaded.length).toFixed(2)
    : null;

  const SortArrow = ({ field }) =>
    sortBy === field
      ? <span className="text-indigo-400 text-xs ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>
      : <span className="text-gray-600 text-xs ml-0.5">↕</span>;

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
            {loading
              ? `Loading ${loadedCount}/${ALL_STOCKS.length} stocks...`
              : lastUpdated
                ? `Updated ${lastUpdated} · auto-refresh every 60s`
                : 'Fetching data...'}
          </p>
        </div>
        <button
          onClick={() => loadStocks(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 transition disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Loaded"         value={`${loaded.length}/${ALL_STOCKS.length}`} />
        <SummaryCard label="Gainers Today"  value={gainers}   sub={`${gainers} up`}    up={true}  />
        <SummaryCard label="Losers Today"   value={losers}    sub={`${losers} down`}   up={false} />
        <SummaryCard
          label="Avg Move"
          value={avgChange ? `${parseFloat(avgChange) > 0 ? '+' : ''}${avgChange}%` : '—'}
          sub={avgChange ? (parseFloat(avgChange) > 0 ? 'Market up' : 'Market down') : null}
          up={parseFloat(avgChange) > 0}
        />
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
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
          <button
            onClick={() => setShowWL(!showWatchlistOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
              showWatchlistOnly
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300'
            }`}
          >
            <FiStar className={`w-4 h-4 ${showWatchlistOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            Watchlist ({watchlist.length})
          </button>
        </div>
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

      {/* ── Loading progress bar ────────────────────────────────────────── */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading stock data... {loadedCount}/{ALL_STOCKS.length}
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(loadedCount / ALL_STOCKS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">Fetching from NSE via Yahoo Finance</p>
        </div>
      )}

      {/* ── Stock Table ─────────────────────────────────────────────────── */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Table header — desktop */}
          <div className="hidden md:grid px-5 py-3 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px 44px' }}>
            <button onClick={() => handleSort('name')}      className="text-left flex items-center">Company     <SortArrow field="name" /></button>
            <button onClick={() => handleSort('price')}     className="text-right flex items-center justify-end">Price       <SortArrow field="price" /></button>
            <button onClick={() => handleSort('change')}    className="text-right flex items-center justify-end">Change      <SortArrow field="change" /></button>
            <button onClick={() => handleSort('changePct')} className="text-right flex items-center justify-end">% Change    <SortArrow field="changePct" /></button>
            <span className="text-right">Mkt Cap</span>
            <span className="text-center">Trend</span>
            <span />
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-gray-400 text-sm">No stocks match your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map((stock, idx) => {
                const d    = stockData[stock.symbol];
                const up   = d ? d.changePct >= 0 : null;
                const inWL = watchlist.includes(stock.symbol);

                return (
                  <div key={stock.symbol}>
                    {/* Desktop row */}
                    <div
                      className="hidden md:grid px-5 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                      style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px 44px' }}
                    >
                      {/* Company */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0 ${AVATAR_COLORS[idx % 10]}`}>
                          {stock.short.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{stock.short}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{stock.name}</p>
                        </div>
                        <span className="hidden lg:block text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full flex-shrink-0">{stock.sector}</span>
                      </div>

                      {/* Price */}
                      <p className="text-right font-bold text-gray-900 dark:text-white text-sm">
                        {d ? `₹${d.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                      </p>

                      {/* Change ₹ */}
                      <p className={`text-right text-sm font-medium ${up === true ? 'text-emerald-500' : up === false ? 'text-red-500' : 'text-gray-400'}`}>
                        {d ? `${d.change >= 0 ? '+' : ''}${d.change.toFixed(2)}` : '—'}
                      </p>

                      {/* Change % */}
                      <div className="flex justify-end">
                        {d ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            up
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {up ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                            {Math.abs(d.changePct).toFixed(2)}%
                          </span>
                        ) : <span className="text-gray-400 text-xs">Loading...</span>}
                      </div>

                      {/* Market Cap */}
                      <p className="text-right text-xs text-gray-500">{d ? fmt(d.mktCap) : '—'}</p>

                      {/* Sparkline */}
                      <div className="flex justify-center">
                        {d?.sparkline?.length > 2
                          ? <Sparkline data={d.sparkline} up={up} />
                          : <span className="text-gray-600 text-xs">—</span>}
                      </div>

                      {/* Star */}
                      <button
                        onClick={() => toggleWL(stock.symbol)}
                        className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiStar className={`w-4 h-4 transition-colors ${inWL ? 'fill-amber-400 text-amber-400' : 'text-gray-400 hover:text-amber-400'}`} />
                      </button>
                    </div>

                    {/* Mobile card */}
                    <div className="md:hidden flex items-center justify-between px-4 py-4 gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${AVATAR_COLORS[idx % 10]}`}>
                          {stock.short.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{stock.short}</p>
                          <p className="text-xs text-gray-400">{stock.sector}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white text-sm">
                            {d ? `₹${d.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'}
                          </p>
                          {d && (
                            <p className={`text-xs font-semibold ${up ? 'text-emerald-500' : 'text-red-500'}`}>
                              {up ? '+' : ''}{d.changePct.toFixed(2)}%
                            </p>
                          )}
                        </div>
                        <button onClick={() => toggleWL(stock.symbol)}>
                          <FiStar className={`w-4 h-4 ${inWL ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center pb-2">
        Data from Yahoo Finance · 15–20 min delayed · Not financial advice · For educational/portfolio purposes only
      </p>
    </div>
  );
}
