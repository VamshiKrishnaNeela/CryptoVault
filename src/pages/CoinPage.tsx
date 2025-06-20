import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Volume2, Calendar } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap_rank: number;
  };
  description: {
    en: string;
  };
}

function CoinPage() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(response.data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCoinData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Coin not found</h2>
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Market
            </Link>
          </motion.div>

          {/* Coin Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex items-center gap-6">
                <img
                  src={coin.image.large}
                  alt={coin.name}
                  className="w-24 h-24 rounded-full shadow-2xl"
                />
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{coin.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-xl text-slate-300 uppercase font-semibold">
                      {coin.symbol}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                      Rank #{coin.market_data.market_cap_rank}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-right">
                <div className="text-4xl font-bold text-white mb-2">
                  ${coin.market_data.current_price.usd.toLocaleString()}
                </div>
                <div className={`flex items-center justify-center md:justify-end gap-2 text-lg font-semibold ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Market Cap</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                ${coin.market_data.market_cap.usd.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">24h Volume</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                ${coin.market_data.total_volume.usd.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">24h Range</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Low:</span>
                  <span className="text-red-400 font-semibold">
                    ${coin.market_data.low_24h.usd.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">High:</span>
                  <span className="text-green-400 font-semibold">
                    ${coin.market_data.high_24h.usd.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description */}
          {coin.description.en && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-400" />
                About {coin.name}
              </h3>
              <div
                className="text-slate-300 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: coin.description.en.split('.').slice(0, 3).join('.') + '.'
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoinPage;