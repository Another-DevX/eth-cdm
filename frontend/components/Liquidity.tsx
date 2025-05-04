"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, PieChart, Info, Settings } from "lucide-react";

// Datos mockeados
const MOCK_APR = 12.5;
const MOCK_STAKED_AMOUNT = 1000;
const MOCK_PERFORMANCE_DATA = {
  '1w': [
    { day: "Lun", totalApr: 15.0, userApr: 3.0, publicApr: 12.0 },
    { day: "Mar", totalApr: 25.0, userApr: 5.0, publicApr: 20.0 },
    { day: "Mie", totalApr: 18.0, userApr: 3.6, publicApr: 14.4 },
    { day: "Jue", totalApr: 32.0, userApr: 6.4, publicApr: 25.6 },
    { day: "Vie", totalApr: 22.0, userApr: 4.4, publicApr: 17.6 },
    { day: "Sab", totalApr: 28.0, userApr: 5.6, publicApr: 22.4 },
    { day: "Dom", totalApr: 20.0, userApr: 4.0, publicApr: 16.0 },
  ],
  '1m': [
    { day: "Sem 1", totalApr: 15.0, userApr: 3.0, publicApr: 12.0 },
    { day: "Sem 2", totalApr: 35.0, userApr: 7.0, publicApr: 28.0 },
    { day: "Sem 3", totalApr: 22.0, userApr: 4.4, publicApr: 17.6 },
    { day: "Sem 4", totalApr: 40.0, userApr: 8.0, publicApr: 32.0 },
  ],
  '3m': [
    { day: "Mes 1", totalApr: 15.0, userApr: 3.0, publicApr: 12.0 },
    { day: "Mes 2", totalApr: 45.0, userApr: 9.0, publicApr: 36.0 },
    { day: "Mes 3", totalApr: 30.0, userApr: 6.0, publicApr: 24.0 },
  ]
};

const DEFAULT_YIELD_DISTRIBUTION = {
  user: 20,
  public: 80,
};

const MAX_USER_SHARE = 80;

export function Liquidity() {
  const [amount, setAmount] = useState<string>("");
  const [stakedAmount, setStakedAmount] = useState<number>(MOCK_STAKED_AMOUNT);
  const [isStaked, setIsStaked] = useState<boolean>(true);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1w' | '1m' | '3m'>('1w');
  const [yieldDistribution, setYieldDistribution] = useState(DEFAULT_YIELD_DISTRIBUTION);
  const [showYieldSettings, setShowYieldSettings] = useState(false);
  const [tempYieldDistribution, setTempYieldDistribution] = useState(DEFAULT_YIELD_DISTRIBUTION);

  const handleStake = () => {
    if (amount && !isNaN(Number(amount))) {
      setStakedAmount(prev => prev + Number(amount));
      setIsStaked(true);
      setAmount("");
    }
  };

  const handleWithdraw = () => {
    setStakedAmount(0);
    setIsStaked(false);
  };

  const handleYieldChange = (value: number[]) => {
    const userShare = Math.min(value[0], MAX_USER_SHARE);
    setTempYieldDistribution({
      user: userShare,
      public: 100 - userShare
    });
  };

  const saveYieldSettings = () => {
    setYieldDistribution(tempYieldDistribution);
    setShowYieldSettings(false);
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sección de Liquidez */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300">
              <CardHeader className="border-b border-purple-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-6 h-6 text-purple-500" />
                    <CardTitle className="text-foreground">Stake ASTR</CardTitle>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-purple-300">
                    <Info className="w-4 h-4" />
                    <span>Neemo Finance</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm text-purple-300">Amount to Stake (ASTR)</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter ASTR amount"
                      className="border-purple-500/30 focus:border-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Configuración del Yield */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-300">Yield Distribution</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-500 hover:bg-purple-500/10"
                        onClick={() => setShowYieldSettings(!showYieldSettings)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                    
                    {showYieldSettings ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 p-4 bg-purple-500/5 rounded-lg"
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-sm text-foreground">Your Share</label>
                              <span className="text-sm text-purple-500">{tempYieldDistribution.user}%</span>
                            </div>
                            <Slider
                              value={[tempYieldDistribution.user]}
                              onValueChange={handleYieldChange}
                              max={MAX_USER_SHARE}
                              step={1}
                              className="[&_[role=slider]]:bg-purple-500"
                            />
                            <div className="text-xs text-purple-300 text-right">
                              Máximo {MAX_USER_SHARE}%
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-sm text-foreground">Public Goods Pool</label>
                              <span className="text-sm text-purple-500">{tempYieldDistribution.public}%</span>
                            </div>
                            <Slider
                              value={[tempYieldDistribution.public]}
                              onValueChange={(value) => handleYieldChange([100 - value[0]])}
                              max={100 - MAX_USER_SHARE}
                              step={1}
                              className="[&_[role=slider]]:bg-purple-500"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={saveYieldSettings}
                          className="w-full bg-purple-500/90 hover:bg-purple-500"
                        >
                          Save Distribution
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">Your Share</span>
                          <span className="text-purple-500">{yieldDistribution.user}%</span>
                        </div>
                        <Progress value={yieldDistribution.user} className="h-2 bg-purple-500/10" />
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">Public Goods Pool</span>
                          <span className="text-purple-500">{yieldDistribution.public}%</span>
                        </div>
                        <Progress value={yieldDistribution.public} className="h-2 bg-purple-500/10" />
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleStake}
                      className="bg-purple-500/90 hover:bg-purple-500 border border-purple-400/50 hover:scale-[1.02] transition-all duration-300"
                    >
                      Stake ASTR
                    </Button>
                    <Button
                      onClick={handleWithdraw}
                      disabled={!isStaked}
                      className={`transition-all duration-300 ${
                        isStaked
                          ? "bg-purple-500/90 hover:bg-purple-500 border border-purple-400/50 hover:scale-[1.02]"
                          : "bg-gray-400/50 cursor-not-allowed"
                      }`}
                    >
                      Withdraw ASTR
                    </Button>
                  </div>
                </div>
                <div className="border-t border-purple-500/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Currently Staked</span>
                    <span className="text-purple-500 font-bold">{stakedAmount} ASTR</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información del Staking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300">
              <CardHeader className="border-b border-purple-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                    <CardTitle className="text-foreground">Staking Analytics</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    {['1w', '1m', '3m'].map((timeframe) => (
                      <Button
                        key={timeframe}
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${
                          selectedTimeframe === timeframe
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'text-purple-300'
                        }`}
                        onClick={() => setSelectedTimeframe(timeframe as '1w' | '1m' | '3m')}
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Current APR</span>
                    <span className="text-purple-500 font-bold">{MOCK_APR}%</span>
                  </div>
                  
                  {/* Gráfica de rendimiento interactiva */}
                  <div className="space-y-2">
                    <span className="text-sm text-purple-300">Performance Over Time</span>
                    <div className="h-40 relative">
                      <svg className="w-full h-full">
                        {MOCK_PERFORMANCE_DATA[selectedTimeframe].map((data, index, array) => {
                          const x = (index / (array.length - 1)) * 100;
                          const totalY = 100 - (data.totalApr / 50) * 100;
                          const userY = 100 - (data.userApr / 50) * 100;
                          const publicY = 100 - (data.publicApr / 50) * 100;
                          
                          return (
                            <g key={index}>
                              {index > 0 && (
                                <>
                                  <line
                                    x1={`${(index - 1) / (array.length - 1) * 100}%`}
                                    y1={`${100 - (array[index - 1].totalApr / 50) * 100}%`}
                                    x2={`${x}%`}
                                    y2={`${totalY}%`}
                                    className="stroke-green-500 stroke-2"
                                  />
                                  <line
                                    x1={`${(index - 1) / (array.length - 1) * 100}%`}
                                    y1={`${100 - (array[index - 1].userApr / 50) * 100}%`}
                                    x2={`${x}%`}
                                    y2={`${userY}%`}
                                    className="stroke-purple-500 stroke-2"
                                  />
                                  <line
                                    x1={`${(index - 1) / (array.length - 1) * 100}%`}
                                    y1={`${100 - (array[index - 1].publicApr / 50) * 100}%`}
                                    x2={`${x}%`}
                                    y2={`${publicY}%`}
                                    className="stroke-blue-500 stroke-2"
                                  />
                                </>
                              )}
                              <circle
                                cx={`${x}%`}
                                cy={`${totalY}%`}
                                r="4"
                                className="fill-green-500 cursor-pointer"
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                              />
                              <circle
                                cx={`${x}%`}
                                cy={`${userY}%`}
                                r="4"
                                className="fill-purple-500 cursor-pointer"
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                              />
                              <circle
                                cx={`${x}%`}
                                cy={`${publicY}%`}
                                r="4"
                                className="fill-blue-500 cursor-pointer"
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                              />
                            </g>
                          );
                        })}
                      </svg>
                      <AnimatePresence>
                        {hoveredBar !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-purple-500/90 text-white text-xs px-2 py-1 rounded"
                          >
                            <div>Total APR: {MOCK_PERFORMANCE_DATA[selectedTimeframe][hoveredBar].totalApr}%</div>
                            <div>User APR: {MOCK_PERFORMANCE_DATA[selectedTimeframe][hoveredBar].userApr}%</div>
                            <div>Public APR: {MOCK_PERFORMANCE_DATA[selectedTimeframe][hoveredBar].publicApr}%</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex justify-between text-xs text-purple-300">
                      <span>{MOCK_PERFORMANCE_DATA[selectedTimeframe][0].day}</span>
                      <span>{MOCK_PERFORMANCE_DATA[selectedTimeframe][MOCK_PERFORMANCE_DATA[selectedTimeframe].length - 1].day}</span>
                    </div>
                    <div className="flex justify-center space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-purple-300">Total APR</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                        <span className="text-purple-300">User APR (20%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        <span className="text-purple-300">Public APR (80%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Distribución del Yield */}
                  <div className="space-y-2">
                    <span className="text-sm text-purple-300">Current Yield Distribution</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Your Rewards</span>
                        <span className="text-purple-500">{yieldDistribution.user}%</span>
                      </div>
                      <Progress value={yieldDistribution.user} className="h-2 bg-purple-500/10" />
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Public Goods Pool</span>
                        <span className="text-purple-500">{yieldDistribution.public}%</span>
                      </div>
                      <Progress value={yieldDistribution.public} className="h-2 bg-purple-500/10" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 