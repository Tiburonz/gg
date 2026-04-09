import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from 'sonner';
import { Account } from '@/types';
import adminService from '@/services/admin.service';
import { Coins, Search, Loader, Minus } from 'lucide-react';

export default function GrantCoinsTab() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [selectedUser, setSelectedUser] = useState<Account | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRevoke, setIsRevoke] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) {
      toast.error(String(t('admin.enterUsername')));
      return;
    }

    setSearching(true);
    try {
      const user = await adminService.searchUser(username);
      if (user) {
        setSelectedUser(user);
        toast.success(`Знайдено користувача: ${user.username}`);
      } else {
        setSelectedUser(null);
        toast.error(String(t('admin.userNotFound')));
      }
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setSearching(false);
    }
  };

  const handleGrant = async () => {
    if (!selectedUser) {
      toast.error(String(t('admin.selectUserFirst')));
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Введіть коректну кількість монет');
      return;
    }
    if (!reason.trim()) {
      toast.error('Введіть причину');
      return;
    }

    setLoading(true);
    try {
      const finalAmount = isRevoke ? -Math.abs(Number(amount)) : Number(amount);
      await adminService.grantCoins(selectedUser.id, finalAmount, reason);
      toast.success(isRevoke ? 'Монети успішно відібрані' : t('admin.grantCoinsSuccess'));
      setAmount('');
      setReason('');
      setSelectedUser(null);
      setUsername('');
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-wow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="w-5 h-5" />
            <span>{t('admin.grantCoins')}</span>
          </CardTitle>
          <CardDescription>{t('admin.grantCoinsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-4 p-4 bg-wow-dark/50 rounded-lg">
            <Label className="text-sm font-medium">Режим:</Label>
            <div className="flex space-x-2">
              <Button
                variant={!isRevoke ? "default" : "outline"}
                size="sm"
                onClick={() => setIsRevoke(false)}
                className={!isRevoke ? "btn-primary" : ""}
              >
                <Coins className="w-4 h-4 mr-2" />
                Видача монет
              </Button>
              <Button
                variant={isRevoke ? "default" : "outline"}
                size="sm"
                onClick={() => setIsRevoke(true)}
                className={isRevoke ? "btn-danger" : ""}
              >
                <Minus className="w-4 h-4 mr-2" />
                Відібрания монет
              </Button>
            </div>
          </div>

          {/* User Search */}
          <div className="space-y-2">
            <Label htmlFor="username">{t('admin.userName')}</Label>
            <div className="flex space-x-2">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={String(t('admin.enterUsername'))}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={searching || !username}>
                {searching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {t('admin.search')}
              </Button>
            </div>
          </div>

          {/* Selected User Info */}
          {selectedUser && (
            <div className="p-4 bg-wow-ice/10 rounded-lg border border-wow-ice/30">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">{t('admin.userName')}:</span> {selectedUser.username}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">ID:</span> {selectedUser.id}
              </p>
              <p className="text-sm text-wow-gold">
                <span className="font-semibold">{t('admin.currentBalance')}:</span> {selectedUser.balance} {t('admin.coins')}
              </p>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">{t('admin.coinAmount')}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(t('admin.enterAmount'))}
              min="1"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">{t('admin.reason')}</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={String(t('admin.grantReason'))}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button onClick={handleGrant} disabled={!selectedUser || loading} className="w-full btn-primary">
            {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
            {t('admin.grantCoins')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
