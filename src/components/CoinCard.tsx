import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

interface CoinCardProps {
  coin: Coin;
  index: number;
}

function CoinCard({ coin, index }: CoinCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Link to={`/coin/${coin.id}`}>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 rounded-full shadow-lg"
              />
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                  {coin.name}
                </h3>
                <p className="text-slate-400 uppercase text-sm font-semibold">
                  {coin.symbol}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">#{coin.market_cap_rank}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-white mb-2">
              ${coin.current_price.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>

          {/* Market Cap */}
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-1">Market Cap</p>
            <p className="text-white font-semibold">
              ${(coin.market_cap / 1e9).toFixed(2)}B
            </p>
          </div>

          {/* View More Button */}
          <div className="flex items-center justify-between">
            <span className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
              View Details
            </span>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default CoinCard;