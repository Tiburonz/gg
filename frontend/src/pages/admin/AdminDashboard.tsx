import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GrantCoinsTab from './GrantCoinsTab';
import ManageUsersTab from './ManageUsersTab';
import ManageAdminsTab from './ManageAdminsTab';
import ContentEditorTab from './ContentEditorTab';
import NewsEditorTab from './NewsEditorTab';
import adminService from '@/services/admin.service';
import { AdminStats } from '@/types';
import { DollarSign, Users, Gift, AlertCircle, Crown, FileText, Newspaper } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { account } = useAuthStore();
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const isMainAdmin = account?.username === 'aly1162';
  const isAdmin = account?.role === 'admin';

  // Check if user is admin
  useEffect(() => {
    if (!account || (account.role !== 'admin' && account.role !== 'moderator')) {
      toast.error('Доступ заборонений. Тільки адміністратори можуть відкривати цю сторінку.');
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        toast.error('Помилка при завантаженні статистики');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [account, navigate]);

  if (!account || (account.role !== 'admin' && account.role !== 'moderator')) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Панель адміністратора</h1>
          <p className="text-gray-400">Керуйте сервером та гравцями</p>
          <p className="text-sm text-wow-ice mt-2">Адміністратор: <span className="font-semibold">{account.username}</span></p>
        </div>

        {/* Stats Grid */}
        {stats && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-wow ice-glow-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Всього користувачів</CardTitle>
                <Users className="w-5 h-5 text-wow-ice" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">{stats.activeUsers} активних</p>
              </CardContent>
            </Card>

            <Card className="card-wow ice-glow-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Онлайн</CardTitle>
                <Gift className="w-5 h-5 text-wow-ice" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.onlinePlayers.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">Гравців онлайн</p>
              </CardContent>
            </Card>

            <Card className="card-wow ice-glow-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Транзакції</CardTitle>
                <DollarSign className="w-5 h-5 text-wow-ice" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">{stats.pendingTransactions} очікуючих</p>
              </CardContent>
            </Card>

            <Card className="card-wow ice-glow-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Заблокованих</CardTitle>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.bannedUsers}</div>
                <p className="text-xs text-gray-400 mt-1">користувачів</p>
              </CardContent>
            </Card>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {/* Tabs */}
        {!loading && (
          <Tabs defaultValue="grants" className="w-full">
            <TabsList className={`grid w-full ${isMainAdmin ? 'grid-cols-6' : isAdmin ? 'grid-cols-5' : 'grid-cols-4'} bg-wow-dark/50`}>
              <TabsTrigger value="grants">Видача монет</TabsTrigger>
              <TabsTrigger value="items">Видача предметів</TabsTrigger>
              <TabsTrigger value="users">Керування користувачами</TabsTrigger>
              {isMainAdmin && (
                <TabsTrigger value="admins" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>Адміністратори</span>
                </TabsTrigger>
              )}
              {isAdmin && (
                <>
                  <TabsTrigger value="news" className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4" />
                    <span>Новини</span>
                  </TabsTrigger>
                  <TabsTrigger value="editor" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Вміст</span>
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="grants" className="mt-6">
              <GrantCoinsTab />
            </TabsContent>

            <TabsContent value="items" className="mt-6">
              <ManageUsersTab />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-wow-dark to-wow-dark/50 rounded-lg border border-wow-ice/20">
                <p className="text-center text-gray-400">Функціональність керування користувачами буде незабаром</p>
              </div>
            </TabsContent>

            {isMainAdmin && (
              <TabsContent value="admins" className="mt-6">
                <ManageAdminsTab />
              </TabsContent>
            )}
            {isAdmin && (
              <>
                <TabsContent value="news" className="mt-6">
                  <NewsEditorTab />
                </TabsContent>

                <TabsContent value="editor" className="mt-6">
                  <ContentEditorTab />
                </TabsContent>
              </>
            )}
          </Tabs>
        )}
      </div>
    </Layout>
  );
}