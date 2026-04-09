import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/use-translation';
import characterService from '@/services/character.service';
import donationService from '@/services/donation.service';
import authService from '@/services/auth.service';
import { Character, Transaction } from '@/types';
import { User, Coins, History, Shield, Clock, Sword, Loader } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Account() {
  const navigate = useNavigate();
  const { account } = useAuthStore();
  const { t } = useTranslation();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositLoading, setDepositLoading] = useState(false);
  const [pwdStep, setPwdStep] = useState<'idle'|'requested'|'confirming'>('idle');
  const [pwdCode, setPwdCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!account) return;
      
      try {
        const [charsData, transData] = await Promise.all([
          characterService.getCharactersByAccount(account.id),
          donationService.getTransactionHistory(account.id),
        ]);
        setCharacters(charsData);
        setTransactions(transData);
      } catch (error) {
        console.error('Failed to fetch account data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  const handleDeposit = async () => {
    if (!account || depositAmount <= 0) return;
    setDepositLoading(true);
    try {
      const tx = await donationService.addBalance(account.id, depositAmount, 'manual');
      // update local balance
      const updated = { ...account, balance: account.balance + depositAmount };
      useAuthStore.getState().setAccount(updated);
      // insert transaction into list for immediate feedback
      setTransactions(prev => [tx, ...prev]);
      setDepositAmount(0);
      toast.success('Баланс поповнено');
    } catch (err) {
      console.error(err);
      toast.error('Не вдалося поповнити');
    } finally {
      setDepositLoading(false);
    }
  };

  const requestPasswordChange = async () => {
    try {
      await authService.requestPasswordChange();
      toast.success('Код надіслано на вашу електронну адресу (в консолі)');
      setPwdStep('requested');
    } catch (err) {
      toast.error('Не вдалося запросити зміни пароля');
    }
  };

  const confirmPasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Паролі не співпадають');
      return;
    }
    try {
      await authService.confirmPasswordChange(pwdCode, newPassword);
      toast.success('Пароль успішно змінено');
      setPwdStep('idle');
      setPwdCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Помилка зміни пароля');
    }
  };

  if (!account) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Account Header */}
        <div className="glass rounded-xl p-8 mb-8 border border-wow-ice/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-wow-ice to-wow-ice-light rounded-xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">{account.username}</h1>
                <p className="text-gray-400">{account.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-400">
                    Joined {formatDate(account.createdAt)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    account.status === 'active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {account.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-1">Donation Balance</p>
              <p className="text-4xl font-bold text-wow-gold flex items-center justify-end">
                <Coins className="w-8 h-8 mr-2" />
                {account.balance}
              </p>
              <div className="mt-2 flex items-center justify-end space-x-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="грн"
                  value={depositAmount || ''}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-24"
                />
                <Button size="sm" onClick={handleDeposit} disabled={depositLoading || depositAmount <= 0}>
                  {depositLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Поповнити'}
                </Button>
              </div>
              {(account.role === 'admin' || account.role === 'moderator') && (
                <Button 
                  onClick={() => navigate('/admin')} 
                  className="mt-4 btn-primary"
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {t('account.adminPanel')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="characters" className="space-y-6">
          <TabsList className="bg-wow-slate border border-wow-ice/20">
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Characters Tab */}
          <TabsContent value="characters">
            {loading ? (
              <LoadingSpinner />
            ) : characters.length === 0 ? (
              <Card className="card-wow">
                <CardContent className="py-12 text-center">
                  <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No characters found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {characters.map((char) => (
                  <Card key={char.guid} className="card-wow ice-glow-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle 
                            className="text-2xl"
                            style={{ color: characterService.getClassColor(char.class) }}
                          >
                            {char.name}
                          </CardTitle>
                          <CardDescription>
                            Level {char.level} {characterService.getRaceName(char.race)}{' '}
                            {characterService.getClassName(char.class)}
                          </CardDescription>
                        </div>
                        {char.online && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                            Online
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 flex items-center">
                            <Coins className="w-4 h-4 mr-2 text-wow-gold" />
                            Gold
                          </span>
                          <span className="text-white font-semibold">
                            {characterService.formatMoney(char.money).gold}g{' '}
                            {characterService.formatMoney(char.money).silver}s{' '}
                            {characterService.formatMoney(char.money).copper}c
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-wow-ice" />
                            Played
                          </span>
                          <span className="text-white font-semibold">
                            {characterService.formatPlaytime(char.totaltime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 flex items-center">
                            <Sword className="w-4 h-4 mr-2 text-red-400" />
                            Kills
                          </span>
                          <span className="text-white font-semibold">
                            {formatNumber(char.totalKills || 0)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            {loading ? (
              <LoadingSpinner />
            ) : transactions.length === 0 ? (
              <Card className="card-wow">
                <CardContent className="py-12 text-center">
                  <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No transactions yet</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-wow">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent donation and purchase history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-wow-dark/50 rounded-lg border border-wow-ice/10"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              transaction.type === 'purchase' 
                                ? 'bg-blue-500/20 text-blue-400'
                                : transaction.type === 'deposit'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {transaction.type}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              transaction.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                          <p className="text-white font-semibold mt-2">
                            {transaction.itemName || 'Balance Deposit'}
                          </p>
                          {transaction.characterName && (
                            <p className="text-sm text-gray-400">
                              Character: {transaction.characterName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-wow-gold">
                            {transaction.amount} Coins
                          </p>
                          {transaction.paymentMethod && (
                            <p className="text-xs text-gray-400 mt-1">
                              via {transaction.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="card-wow">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                  {pwdStep === 'idle' && (
                    <Button onClick={requestPasswordChange} className="btn-primary">
                      Request Code
                    </Button>
                  )}
                  {pwdStep !== 'idle' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Код"
                        value={pwdCode}
                        onChange={e => setPwdCode(e.target.value)}
                        className="w-full"
                      />
                      <Input
                        type="password"
                        placeholder="Новий пароль"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full"
                      />
                      <Input
                        type="password"
                        placeholder="Підтвердіть пароль"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full"
                      />
                      <Button onClick={confirmPasswordChange} className="btn-primary">
                        Змінити пароль
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Email Preferences</h3>
                  <Button className="btn-secondary">Manage Email Settings</Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                  <Button className="btn-secondary">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}