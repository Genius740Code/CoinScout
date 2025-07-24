const ccxt = require('ccxt');

(async () => {
  const coinbase = new ccxt.coinbase(); 

  const symbols = ['BTC/USD', 'ETH/USD', 'SOL/USD'];

  for (const symbol of symbols) {
    try {
      const ticker = await coinbase.fetchTicker(symbol);
      console.log(`${symbol} price: $${ticker.last}`);
    } catch (err) {
      console.error(`Failed to fetch ${symbol}:`, err.message);
    }
  }
})();
