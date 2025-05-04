'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, PieChart, Info, Settings } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { soneium_scs } from '@/config';
import { stake, getStakedAmount } from '@/services/stakingPool';
import { useAccount, useWalletClient } from 'wagmi';
import { Address, createWalletClient, custom, http } from 'viem';
import { getASTRBalance, getASTRAllowance, approveASTR } from '@/services/astr';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Datos mockeados
const MOCK_APR = 12.5;
const MOCK_STAKED_AMOUNT = 1000;
const MOCK_PERFORMANCE_DATA = {
  '1w': [
    { day: 'Lun', totalApr: 15.0, userApr: 3.0, publicApr: 12.0 },
    { day: 'Mar', totalApr: 25.0, userApr: 5.0, publicApr: 20.0 },
    { day: 'Mie', totalApr: 18.0, userApr: 3.6, publicApr: 14.4 },
    { day: 'Jue', totalApr: 32.0, userApr: 6.4, publicApr: 25.6 },
    { day: 'Vie', totalApr: 22.0, userApr: 4.4, publicApr: 17.6 },
    { day: 'Sab', totalApr: 28.0, userApr: 5.6, publicApr: 22.4 },
    { day: 'Dom', totalApr: 20.0, userApr: 4.0, publicApr: 16.0 },
  ],
  '1m': [
    { day: 'Sem 1', totalApr: 15.0, userApr: 3.0, publicApr: 12.0 },
    { day: 'Sem 2', totalApr: 35.0, userApr: 7.0, publicApr: 28.0 },
    { day: 'Sem 3', totalApr: 22.0, userApr: 4.4, publicApr: 17.6 },
    { day: 'Sem 4', totalApr: 40.0, userApr: 8.0, publicApr: 32.0 },
  ],
  '3m': [
    { day: 'Mes 1', totalApr: 15.0, userApr: 3.0, publicApr: 12.0 },
    { day: 'Mes 2', totalApr: 45.0, userApr: 9.0, publicApr: 36.0 },
    { day: 'Mes 3', totalApr: 30.0, userApr: 6.0, publicApr: 24.0 },
  ],
};

const DEFAULT_YIELD_DISTRIBUTION = {
  user: 20,
  public: 80,
};

const MAX_USER_SHARE = 80;

const formatChartData = (data: (typeof MOCK_PERFORMANCE_DATA)['1w']) => {
  return data.map((item) => ({
    day: item.day,
    totalApr: item.totalApr,
    userApr: item.userApr,
    publicApr: item.publicApr,
  }));
};

export function Liquidity() {
  const [amount, setAmount] = useState<string>('');
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [isStaked, setIsStaked] = useState<boolean>(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1w' | '1m' | '3m'>('1w');
  const [yieldDistribution, setYieldDistribution] = useState(DEFAULT_YIELD_DISTRIBUTION);
  const [showYieldSettings, setShowYieldSettings] = useState(false);
  const [tempYieldDistribution, setTempYieldDistribution] = useState(DEFAULT_YIELD_DISTRIBUTION);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { data: astrBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['astrBalance', address],
    queryFn: () =>
      address ? getASTRBalance(address) : Promise.resolve(BigInt(0)),
    enabled: !!address,
  });

  const { data: allowance, refetch: refetchAllowance } = useQuery({
    queryKey: ['astrAllowance', address],
    queryFn: () =>
      address ? getASTRAllowance(address) : Promise.resolve(BigInt(0)),
    enabled: !!address,
  });

  const { data: userStakedAmount, isLoading: isLoadingUserStaked } = useQuery({
    queryKey: ['userStakedAmount', address],
    queryFn: () =>
      address ? getStakedAmount(address) : Promise.resolve(BigInt(0)),
    enabled: !!address,
  });

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: async () => {
      if (!walletClient || !address) {
        throw new Error('Wallet not available');
      }

      const amountBigInt = BigInt(amount) * BigInt(1e18);
      return await approveASTR(amountBigInt, address, walletClient);
    },
    onSuccess: (hash) => {
      toast('Approval successful');
      setShowApprovalModal(false);
      setShowStakeModal(true);
      refetchAllowance();
      queryClient.refetchQueries({ queryKey: ['astrAllowance', address] });
    },
    onError: (error) => {
      toast.error('Approval failed');
    },
  });

  const { mutate: stakeASTR, isPending: isStaking } = useMutation({
    mutationFn: async () => {
      if (!walletClient) {
        throw new Error('Wallet client not available');
      }

      if (!address) {
        throw new Error('Address not available');
      }

      if (!amount || isNaN(Number(amount))) {
        throw new Error('Invalid amount');
      }

      const amountBigInt = BigInt(amount) * BigInt(1e18);
      if (astrBalance && amountBigInt > astrBalance) {
        throw new Error('Insufficient balance');
      }

      try {
        const hash = await stake(amountBigInt, address, walletClient);
        setStakedAmount((prev) => prev + Number(amount));
        setIsStaked(true);
        setAmount('');
        return hash;
      } catch (error) {
        console.error('Error staking:', error);
        throw error;
      }
    },
    onSuccess: (hash) => {
      toast('Stake successful');
      setShowStakeModal(false);
      queryClient.refetchQueries({ queryKey: ['astrBalance', address] });
    },
    onError: (error) => {
      toast.error('Stake failed');
    },
  });

  const handleStake = () => {
    if (amount && !isNaN(Number(amount))) {
      const amountBigInt = BigInt(amount) * BigInt(1e18);
      if (allowance && amountBigInt <= allowance) {
        setShowStakeModal(true);
      } else {
        setShowApprovalModal(true);
      }
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
      public: 100 - userShare,
    });
  };

  const saveYieldSettings = () => {
    setYieldDistribution(tempYieldDistribution);
    setShowYieldSettings(false);
  };

  return (
    <div className='min-h-screen p-8 bg-background'>
      <div className='container mx-auto max-w-6xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Liquidity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className='border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300'>
              <CardHeader className='border-b border-purple-500/10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Coins className='w-6 h-6 text-purple-500' />
                    <CardTitle className='text-foreground'>
                      Stake ASTR
                    </CardTitle>
                  </div>
                  <div className='flex items-center space-x-1 text-sm text-purple-300'>
                    <Info className='w-4 h-4' />
                    <span>Neemo Finance</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                <div className='space-y-4'>
                  {/* Current ASTR Balance */}
                  <div className='flex justify-between items-center p-4 bg-purple-500/5 rounded-lg mb-4'>
                    <div className='flex items-center space-x-2'>
                      <Coins className='w-5 h-5 text-purple-500' />
                      <span className='text-foreground'>ASTR Balance</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {isLoadingBalance ? (
                        <div className='h-4 w-16 bg-purple-500/10 rounded animate-pulse' />
                      ) : (
                        <span className='text-purple-500 font-bold'>
                          {astrBalance
                            ? (Number(astrBalance) / 1e18).toFixed(2)
                            : '0.00'}{' '}
                          ASTR
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col space-y-2'>
                    <label className='text-sm text-purple-300'>
                      Amount to Stake (ASTR)
                    </label>
                    <div className='flex space-x-2'>
                      <Input
                        type='number'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder='Enter ASTR amount'
                        className='border-purple-500/30 focus:border-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        className='text-purple-500 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer'
                        onClick={() => {
                          if (astrBalance) {
                            setAmount((Number(astrBalance) / 1e18).toFixed(2));
                          }
                        }}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  {/* Yield Distribution Settings */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-purple-300'>
                        Yield Distribution
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-purple-500 hover:bg-purple-500/10 cursor-pointer'
                        onClick={() => setShowYieldSettings(!showYieldSettings)}
                      >
                        <Settings className='w-4 h-4 mr-2' />
                        Configure
                      </Button>
                    </div>

                    {showYieldSettings ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='space-y-4 p-4 bg-purple-500/5 rounded-lg'
                      >
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                              <label className='text-sm text-foreground'>
                                Your Share
                              </label>
                              <span className='text-sm text-purple-500'>
                                {tempYieldDistribution.user}%
                              </span>
                            </div>
                            <Slider
                              value={[tempYieldDistribution.user]}
                              onValueChange={handleYieldChange}
                              max={MAX_USER_SHARE}
                              step={1}
                              className='[&_[role=slider]]:bg-purple-500'
                            />
                            <div className='text-xs text-purple-300 text-right'>
                              Máximo {MAX_USER_SHARE}%
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                              <label className='text-sm text-foreground'>
                                Public Goods Pool
                              </label>
                              <span className='text-sm text-purple-500'>
                                {tempYieldDistribution.public}%
                              </span>
                            </div>
                            <Slider
                              value={[tempYieldDistribution.public]}
                              onValueChange={(value) =>
                                handleYieldChange([100 - value[0]])
                              }
                              max={100 - MAX_USER_SHARE}
                              step={1}
                              className='[&_[role=slider]]:bg-purple-500'
                            />
                          </div>
                        </div>
                        <Button
                          onClick={saveYieldSettings}
                          className='w-full bg-purple-500/90 hover:bg-purple-500'
                        >
                          Save Distribution
                        </Button>
                      </motion.div>
                    ) : (
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-foreground'>Your Share</span>
                          <span className='text-purple-500'>
                            {yieldDistribution.user}%
                          </span>
                        </div>
                        <Progress
                          value={yieldDistribution.user}
                          className='h-2 bg-purple-500/10'
                        />
                        <div className='flex justify-between text-sm'>
                          <span className='text-foreground'>
                            Public Goods Pool
                          </span>
                          <span className='text-purple-500'>
                            {yieldDistribution.public}%
                          </span>
                        </div>
                        <Progress
                          value={yieldDistribution.public}
                          className='h-2 bg-purple-500/10'
                        />
                      </div>
                    )}
                  </div>

                  <div className='flex space-x-4'>
                    <Button
                      onClick={handleStake}
                      className='bg-purple-500/90 hover:bg-purple-500 border border-purple-400/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer'
                    >
                      Stake ASTR
                    </Button>
                    <Button
                      onClick={handleWithdraw}
                      disabled={!isStaked}
                      className={`transition-all duration-300 ${
                        isStaked
                          ? 'bg-purple-500/90 hover:bg-purple-500 border border-purple-400/50 hover:scale-[1.02] cursor-pointer'
                          : 'bg-gray-400/50 cursor-not-allowed'
                      }`}
                    >
                      Withdraw ASTR
                    </Button>
                  </div>
                </div>
                <div className='border-t border-purple-500/10 pt-4 space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-foreground'>Your Staked Amount</span>
                    <span className='text-purple-500 font-bold'>
                      {isLoadingUserStaked ? (
                        <div className='h-4 w-16 bg-purple-500/10 rounded animate-pulse' />
                      ) : (
                        `${(Number(userStakedAmount || 0) / 1e18).toFixed(2)} ASTR`
                      )}
                    </span>
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
            <Card className='border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-background/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-300'>
              <CardHeader className='border-b border-purple-500/10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <TrendingUp className='w-6 h-6 text-purple-500' />
                    <CardTitle className='text-foreground'>
                      Staking Analytics
                    </CardTitle>
                  </div>
                  <div className='flex space-x-2'>
                    {['1w', '1m', '3m'].map((timeframe) => (
                      <Button
                        key={timeframe}
                        variant='ghost'
                        size='sm'
                        className={`text-xs ${
                          selectedTimeframe === timeframe
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'text-purple-300'
                        }`}
                        onClick={() =>
                          setSelectedTimeframe(timeframe as '1w' | '1m' | '3m')
                        }
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-foreground'>Current APR</span>
                    <span className='text-purple-500 font-bold'>
                      {MOCK_APR}%
                    </span>
                  </div>

                  {/* Gráfica de rendimiento */}
                  <div className='h-64'>
                    <AreaChart
                      width={500}
                      height={250}
                      data={formatChartData(
                        MOCK_PERFORMANCE_DATA[selectedTimeframe]
                      )}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id='totalGradient'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor='rgb(34, 197, 94)'
                            stopOpacity={0.8}
                          />
                          <stop
                            offset='95%'
                            stopColor='rgb(34, 197, 94)'
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id='userGradient'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor='rgb(168, 85, 247)'
                            stopOpacity={0.8}
                          />
                          <stop
                            offset='95%'
                            stopColor='rgb(168, 85, 247)'
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id='publicGradient'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor='rgb(59, 130, 246)'
                            stopOpacity={0.8}
                          />
                          <stop
                            offset='95%'
                            stopColor='rgb(59, 130, 246)'
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray='2 2'
                        vertical={false}
                        stroke='rgba(168, 85, 247, 0.1)'
                        strokeWidth={0.5}
                      />
                      <XAxis
                        dataKey='day'
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgb(168, 85, 247)', fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgb(168, 85, 247)', fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className='bg-purple-500/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg'>
                                <div className='font-semibold mb-1'>
                                  {label}
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                  <span>Total APR: {payload[0].value}%</span>
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                  <span>User APR: {payload[1].value}%</span>
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                  <span>Public APR: {payload[2].value}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='totalApr'
                        stackId='1'
                        stroke='rgb(34, 197, 94)'
                        fill='url(#totalGradient)'
                        fillOpacity={0.4}
                      />
                      <Area
                        type='monotone'
                        dataKey='userApr'
                        stackId='1'
                        stroke='rgb(168, 85, 247)'
                        fill='url(#userGradient)'
                        fillOpacity={0.4}
                      />
                      <Area
                        type='monotone'
                        dataKey='publicApr'
                        stackId='1'
                        stroke='rgb(59, 130, 246)'
                        fill='url(#publicGradient)'
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </div>

                  {/* Distribución del Yield */}
                  <div className='space-y-2'>
                    <span className='text-sm text-purple-300'>
                      Current Yield Distribution
                    </span>
                    <div className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-foreground'>Your Rewards</span>
                        <span className='text-purple-500'>
                          {yieldDistribution.user}%
                        </span>
                      </div>
                      <Progress
                        value={yieldDistribution.user}
                        className='h-2 bg-purple-500/10'
                      />
                      <div className='flex justify-between text-sm'>
                        <span className='text-foreground'>
                          Public Goods Pool
                        </span>
                        <span className='text-purple-500'>
                          {yieldDistribution.public}%
                        </span>
                      </div>
                      <Progress
                        value={yieldDistribution.public}
                        className='h-2 bg-purple-500/10'
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve ASTR</DialogTitle>
            <DialogDescription>
              You need to approve the staking contract to stake your ASTR.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setShowApprovalModal(false)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              onClick={() => approve()}
              disabled={isApproving}
              className='cursor-pointer'
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stake Modal */}
      <Dialog open={showStakeModal} onOpenChange={setShowStakeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stake</DialogTitle>
            <DialogDescription>
              Are you sure you want to stake {amount} ASTR?
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setShowStakeModal(false)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              onClick={() => stakeASTR()}
              disabled={isStaking}
              className='cursor-pointer'
            >
              {isStaking ? 'Staking...' : 'Confirm Stake'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
