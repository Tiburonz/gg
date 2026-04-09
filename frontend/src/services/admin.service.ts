import axios from 'axios';
import { UserGrant, AdminLog, AdminStats, Account } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock user database (synced with auth.service.ts)
const mockUsers: Map<string, { username: string; email: string; password: string; account: Account }> = new Map([
  ['admin', {
    username: 'admin',
    email: 'admin@frostmourne.com',
    password: 'admin123',
    account: {
      id: 1,
      username: 'admin',
      email: 'admin@frostmourne.com',
      balance: 5000,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      status: 'active',
      role: 'admin',
      emailConfirmed: true,
    }
  }],
  ['aly1162', {
    username: 'aly1162',
    email: 'aly1162@frostmourne.com',
    password: 'dv169nx',
    account: {
      id: 3,
      username: 'aly1162',
      email: 'aly1162@frostmourne.com',
      balance: 10000,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
      role: 'admin',
      emailConfirmed: true,
    }
  }],
  ['testuser', {
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123',
    account: {
      id: 2,
      username: 'testuser',
      email: 'test@example.com',
      balance: 1500,
      createdAt: '2024-06-15T00:00:00Z',
      lastLogin: new Date().toISOString(),
      status: 'active',
      role: 'user',
      emailConfirmed: true,
    }
  }],
]);

class AdminService {
  private api = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Get admin stats (mock data)
  async getStats(): Promise<AdminStats> {
    try {
      // Return mock statistics based on mock user database
      const totalUsers = mockUsers.size;
      const activeUsers = Math.floor(totalUsers * 0.7); // 70% active
      const onlinePlayers = Math.floor(totalUsers * 0.3); // 30% online
      const bannedUsers = 2;
      
      return {
        totalUsers,
        activeUsers,
        bannedUsers,
        totalRevenue: 15000,
        revenueThisMonth: 5200,
        totalTransactions: 342,
        pendingTransactions: 5,
        onlinePlayers,
      };
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      throw error;
    }
  }

  // Get all users
  async getUsers(page: number = 1, pageSize: number = 50): Promise<{ users: Account[]; total: number }> {
    try {
      const response = await this.api.get('/users', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  // Search user by username (using mock database)
  async searchUser(username: string): Promise<Account | null> {
    try {
      // Search in mock user database
      const user = mockUsers.get(username.toLowerCase());
      if (user) {
        return user.account;
      }
      return null;
    } catch (error) {
      console.error('Failed to search user:', error);
      throw error;
    }
  }

  // Grant coins to user (positive for grant, negative for revoke)
  async grantCoins(accountId: number, amount: number, reason: string): Promise<UserGrant> {
    try {
      // For mock database, update user's balance directly
      for (const user of mockUsers.values()) {
        if (user.account.id === accountId) {
          user.account.balance = Math.max(0, user.account.balance + amount); // Prevent negative balance
          return {
            id: Date.now().toString(),
            accountId,
            username: user.username,
            grantType: 'coins',
            amount: Math.abs(amount),
            reason,
            grantedBy: 'admin',
            grantedAt: new Date().toISOString(),
            status: 'completed'
          };
        }
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Failed to grant/revoke coins:', error);
      throw error;
    }
  }

  // Grant item to user
  async grantItem(
    accountId: number,
    itemId: number,
    itemName: string,
    reason: string
  ): Promise<UserGrant> {
    try {
      const response = await this.api.post('/grants/item', {
        accountId,
        itemId,
        itemName,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to grant item:', error);
      throw error;
    }
  }

  // Get all grants
  async getGrants(page: number = 1, pageSize: number = 50): Promise<{ grants: UserGrant[]; total: number }> {
    try {
      const response = await this.api.get('/grants', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch grants:', error);
      throw error;
    }
  }

  // Ban user
  async banUser(accountId: number, reason: string, duration?: number): Promise<void> {
    try {
      await this.api.post('/users/ban', {
        accountId,
        reason,
        duration,
      });
    } catch (error) {
      console.error('Failed to ban user:', error);
      throw error;
    }
  }

  // Unban user
  async unbanUser(accountId: number): Promise<void> {
    try {
      await this.api.post(`/users/${accountId}/unban`);
    } catch (error) {
      console.error('Failed to unban user:', error);
      throw error;
    }
  }

  // Get admin logs
  async getLogs(page: number = 1, pageSize: number = 50): Promise<{ logs: AdminLog[]; total: number }> {
    try {
      const response = await this.api.get('/logs', {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      throw error;
    }
  }

  // Set user role (Admin/Moderator/User)
  async setUserRole(accountId: number, role: 'admin' | 'moderator' | 'user'): Promise<Account> {
    try {
      // Find user by ID in mock database and update role
      for (const user of mockUsers.values()) {
        if (user.account.id === accountId) {
          user.account.role = role;
          return user.account;
        }
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Failed to set user role:', error);
      throw error;
    }
  }

  // Promote user to admin
  async promoteToAdmin(accountId: number): Promise<Account> {
    return this.setUserRole(accountId, 'admin');
  }

  // Promote user to moderator
  async promoteToModerator(accountId: number): Promise<Account> {
    return this.setUserRole(accountId, 'moderator');
  }

  // Demote admin/moderator to user
  async demoteToUser(accountId: number): Promise<Account> {
    return this.setUserRole(accountId, 'user');
  }
}

export default new AdminService();
