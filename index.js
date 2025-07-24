const ccxt = require('ccxt');

//Differnt tickets

const exchanges = [
{ id: 'coinbase', symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'] },
{ id: 'binance', symbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'] },
{ id: 'kraken', symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'] },
{ id: 'bybit', symbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'] },
];

(async () => {

  for (const { id, symbols } of exchanges) {
    const exchangeClass = ccxt[id];
    const exchange = new exchangeClass();

    console.log(`\nPrices from ${exchange.name} (${id})`);

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
        console.log(`${symbol}:Error - ${err.message}`);
      }
    }
  }
})();
