import React, { useState } from 'react';
import './FinancePage.css'; // Import your CSS file

interface Stock {
  ticker: string;
  price: number;
  data: number[]; // Price history data
}

const FinancePage: React.FC = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [inputTicker, setInputTicker] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);

  const handleAddTicker = () => {
    if (inputTicker && !tickers.includes(inputTicker.toUpperCase())) {
      setTickers([...tickers, inputTicker.toUpperCase()]);
      // Fetch stock data for the new ticker
      // Placeholder data for demonstration
      setStocks([
        ...stocks,
        {
          ticker: inputTicker.toUpperCase(),
          price: 150.0,
          data: [140, 145, 150, 155, 150], // Sample price history
        },
      ]);
      setInputTicker('');
    }
  };

  return (
    <section className="finance-page">
      <h2>Finance Dashboard</h2>
      <div className="ticker-input">
        <input
          type="text"
          value={inputTicker}
          onChange={(e) => setInputTicker(e.target.value)}
          placeholder="Enter ticker symbol"
        />
        <button onClick={handleAddTicker}>Add Ticker</button>
      </div>
      <div className="stocks-container">
        {stocks.map((stock) => (
          <div key={stock.ticker} className="stock-card">
            <h3>{stock.ticker}</h3>
            <p>Latest Price: ${stock.price.toFixed(2)}</p>
            {/* Implement a chart component for price history */}
            {/* Implement news section for the company */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FinancePage;
