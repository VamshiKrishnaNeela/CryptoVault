import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import CoinCard from '../components/CoinCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  total_volume: number;
}

function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      setCoins(response.data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCoins();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const gainers = coins.filter(coin => coin.price_change_percentage_24h > 0).length;
  const losers = coins.filter(coin => coin.price_change_percentage_24h < 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              CryptoVault
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Track, analyze, and discover the world's leading cryptocurrencies with real-time data and stunning insights.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">
                  ${(totalMarketCap / 1e12).toFixed(2)}T
                </h3>
                <p className="text-slate-300">Total Market Cap</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">{gainers}</h3>
                <p className="text-slate-300">24h Gainers</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <TrendingDown className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">{losers}</h3>
                <p className="text-slate-300">24h Losers</p>
              </motion.div>
            </div>

            {/* Search and Refresh */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Coins Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredCoins.map((coin, index) => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && filteredCoins.length === 0 && searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-slate-400">Try searching for a different cryptocurrency</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;