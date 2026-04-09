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
import { Gift, Search, Loader, Trash2 } from 'lucide-react';

export default function GrantItemTab() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
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
    if (!itemId || isNaN(Number(itemId))) {
      toast.error('Введіть коректний ID предмета');
      return;
    }
    if (!itemName.trim()) {
      toast.error('Введіть назву предмета');
      return;
    }
    if (!reason.trim()) {
      toast.error('Введіть причину видачі');
      return;
    }

    setLoading(true);
    try {
      const finalItemId = isRevoke ? -Math.abs(Number(itemId)) : Number(itemId);
      await adminService.grantItem(selectedUser.id, finalItemId, itemName, reason);
      toast.success(isRevoke ? 'Предмет успішно відібраний' : t('admin.grantItemSuccess'));
      setItemId('');
      setItemName('');
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
            <Gift className="w-5 h-5" />
            <span>{t('admin.grantItems')}</span>
          </CardTitle>
          <CardDescription>{t('admin.grantItemsDesc')}</CardDescription>
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
                <Gift className="w-4 h-4 mr-2" />
                Видача предметів
              </Button>
              <Button
                variant={isRevoke ? "default" : "outline"}
                size="sm"
                onClick={() => setIsRevoke(true)}
                className={isRevoke ? "btn-danger" : ""}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Відібрання предметів
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
            </div>
          )}

          {/* Item ID */}
          <div className="space-y-2">
            <Label htmlFor="itemId">{t('admin.itemId')}</Label>
            <Input
              id="itemId"
              type="number"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder={String(t('admin.enterItemId'))}
              min="1"
            />
          </div>

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="itemName">{t('admin.itemName')}</Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={String(t('admin.enterItemName'))}
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
            {t('admin.grantItems')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
