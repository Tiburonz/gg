import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from 'sonner';
import { Account } from '@/types';
import adminService from '@/services/admin.service';
import { Shield, Search, Loader, Crown } from 'lucide-react';

export default function ManageAdminsTab() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const [selectedUser, setSelectedUser] = useState<Account | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setSelectedRole(user.role as 'admin' | 'moderator' | 'user');
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

  const handleSetRole = async () => {
    if (!selectedUser) {
      toast.error(String(t('admin.selectUserFirst')));
      return;
    }

    setLoading(true);
    try {
      await adminService.setUserRole(selectedUser.id, selectedRole);
      toast.success(`Роль користувача ${selectedUser.username} змінена на ${selectedRole}`);
      setUsername('');
      setSelectedUser(null);
      setSelectedRole('user');
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-wow border-l-4 border-l-wow-gold">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-wow-gold" />
            <span>Управління адміністраторами</span>
          </CardTitle>
          <CardDescription>
            Як головний адміністратор, ви можете видавати та забирати ролі администратора та модератора. Ця функція доступна тільки вам.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              ⚠️ Будьте обережні при виданні ролей! Адміністратори мають повний доступ до системи.
            </p>
          </div>

          {/* User Search */}
          <div className="space-y-2">
            <Label htmlFor="admin-username">{t('admin.userName')}</Label>
            <div className="flex space-x-2">
              <Input
                id="admin-username"
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
                <span className="font-semibold">Email:</span> {selectedUser.email}
              </p>
              <p className="text-sm text-wow-gold">
                <span className="font-semibold">Поточна роль:</span> {selectedUser.role}
              </p>
            </div>
          )}

          {/* Role Selection */}
          {selectedUser && (
            <div className="space-y-2">
              <Label htmlFor="role-select">Нова роль</Label>
              <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as 'admin' | 'moderator' | 'user')}>
                <SelectTrigger id="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <span className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-wow-gold" />
                      Адміністратор
                    </span>
                  </SelectItem>
                  <SelectItem value="moderator">
                    <span className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Модератор
                    </span>
                  </SelectItem>
                  <SelectItem value="user">
                    Звичайний користувач
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                {selectedRole === 'admin' && 'Адміністратор має повний доступ до всіх систем'}
                {selectedRole === 'moderator' && 'Модератор може модерувати контент та користувачів'}
                {selectedRole === 'user' && 'Звичайний користувач без спеціальних привілеїв'}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSetRole} 
            disabled={!selectedUser || selectedUser.role === selectedRole || loading} 
            className="w-full btn-primary"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
            Призначити роль
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
