const ccxt = require('ccxt');

// Different tickers and rate limits per second
const exchanges = [
  { id: 'coinbase', symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'], rateLimitPerSec: 3 },
  { id: 'binance', symbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'], rateLimitPerSec: 20 },
  { id: 'kraken', symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'], rateLimitPerSec: 5 },
  { id: 'bybit', symbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'], rateLimitPerSec: 50 },
];

// extract unique tokens 
function getUniqueTokens(symbols) {
  const tokens = new Set();
  symbols.forEach(symbol => {
    const [base, quote] = symbol.split('/');
    tokens.add(base);
    tokens.add(quote);
  });
  return Array.from(tokens);
}

(async () => {

  for (const { id, symbols, rateLimitPerSec } of exchanges) {
    const exchangeClass = ccxt[id];
    const exchange = new exchangeClass();

    // Calculate max requests
    const tokens = getUniqueTokens(symbols);
    const totalTokens = tokens.length;
    const maxReqPerTokenPerSec = rateLimitPerSec / totalTokens;
    const maxReqPerTokenPerMin = maxReqPerTokenPerSec * 60;
    const maxReqTotalPerMin = rateLimitPerSec * 60;

    console.log(`\nPrices from ${exchange.name} (${id})`);
    console.log(`Rate Limit: ${rateLimitPerSec} req/sec | ${maxReqTotalPerMin} req/min`);
    console.log(`Max Requests Per Token: ${maxReqPerTokenPerSec.toFixed(2)} req/sec, ${maxReqPerTokenPerMin.toFixed(0)} req/min`);
    console.log(`Max Total Requests Per Minute: ${maxReqTotalPerMin}`);

    try {
      await exchange.loadMarkets();
    } catch (err) {
      console.error(`Failed to load markets for ${id}:`, err.message);
      continue;
    }

    for (const symbol of symbols) {
      try {
        if (!(symbol in exchange.markets)) {
          console.log(`${symbol}: Not available on ${id}`);
          continue;
        }

        const ticker = await exchange.fetchTicker(symbol);
        console.log(`${symbol}: $${ticker.last}`);
      } catch (err) {
        console.log(`${symbol}: Error - ${err.message}`);
      }
    }
  }
})();
