import apiService from './api.service';
import { LoginCredentials, RegisterData, AuthResponse, Account } from '@/types';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly ACCOUNT_KEY = 'account_data';

  // Mock user database
  private mockUsers: Map<string, { username: string; email: string; password: string; account: Account }> = new Map([
    ['admin', {
      username: 'admin',
      email: 'admin@frostmourne.com',
      password: 'admin123', // In real app, this would be hashed
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!apiService.isMockEnabled()) {
      const resp = await apiService.post<AuthResponse>('/auth/login', credentials);
      const data = resp.data.data as AuthResponse;
      this.setToken(data.token);
      this.setRefreshToken(data.refreshToken);
      this.setAccount(data.account);
      return data;
    }

    await apiService.mockDelay(800);

    // Mock login logic
    const user = this.mockUsers.get(credentials.username);
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid username or password');
    }

    if (!user.account.emailConfirmed) {
      // Instead of logging in, require confirmation
      throw new Error('Email not confirmed. Please check your inbox.');
    }

    // Generate mock JWT token
    const token = this.generateMockToken(user.account);
    const refreshToken = this.generateMockRefreshToken(user.account);

    // Update last login
    user.account.lastLogin = new Date().toISOString();

    // Store tokens
    this.setToken(token);
    this.setRefreshToken(refreshToken);
    this.setAccount(user.account);

    return {
      token,
      refreshToken,
      account: user.account,
    };
  }

  // store one-time confirmation codes
  private emailConfirmationCodes: Map<string, string> = new Map();

  private generateConfirmationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (!apiService.isMockEnabled()) {
      const resp = await apiService.post<AuthResponse>('/auth/register', data);
      const serverData = resp.data.data as AuthResponse;
      this.setToken(serverData.token);
      this.setRefreshToken(serverData.refreshToken);
      this.setAccount(serverData.account);
      return serverData;
    }

    await apiService.mockDelay(1000);

    // Check if username already exists
    if (this.mockUsers.has(data.username)) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    const emailExists = Array.from(this.mockUsers.values()).some(
      u => u.email === data.email
    );
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Create new account (emailConfirmed=false until verified)
    const newAccount: Account = {
      id: this.mockUsers.size + 1,
      username: data.username,
      email: data.email,
      balance: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
      role: 'user',
      emailConfirmed: false,
    };

    // Store in mock database
    this.mockUsers.set(data.username, {
      username: data.username,
      email: data.email,
      password: data.password,
      account: newAccount,
    });

    // generate and "send" confirmation code
    const code = this.generateConfirmationCode();
    this.emailConfirmationCodes.set(data.username, code);
    console.log(`Mock email sent to ${data.email} with code: ${code}`);

    // Do not automatically log user in. Return tokens but keep emailConfirmed false
    const token = this.generateMockToken(newAccount);
    const refreshToken = this.generateMockRefreshToken(newAccount);

    this.setToken(token);
    this.setRefreshToken(refreshToken);
    this.setAccount(newAccount);

    return {
      token,
      refreshToken,
      account: newAccount,
    };
  }

  async confirmEmail(username: string, code: string): Promise<Account> {
    if (!apiService.isMockEnabled()) {
      const resp = await apiService.post<Account>('/auth/confirm-email', { username, code });
      const updated = resp.data.data as Account;
      const current = this.getAccount();
      if (current && current.username === username) {
        this.setAccount(updated);
      }
      return updated;
    }

    await apiService.mockDelay(500);
    const stored = this.emailConfirmationCodes.get(username);
    if (!stored) {
      throw new Error('No confirmation requested');
    }
    if (stored !== code) {
      throw new Error('Invalid confirmation code');
    }
    const user = this.mockUsers.get(username);
    if (!user) throw new Error('User not found');
    user.account.emailConfirmed = true;
    this.emailConfirmationCodes.delete(username);
    // update stored account if currently logged in
    const current = this.getAccount();
    if (current && current.username === username) {
      this.setAccount(user.account);
    }
    return user.account;
  }

  async resendConfirmation(username: string): Promise<void> {
    if (!apiService.isMockEnabled()) {
      await apiService.post('/auth/resend-code', { username });
      return;
    }

    await apiService.mockDelay(500);
    const user = this.mockUsers.get(username);
    if (!user) throw new Error('User not found');
    const code = this.generateConfirmationCode();
    this.emailConfirmationCodes.set(username, code);
    console.log(`Resent mock email to ${user.email} with code: ${code}`);
  }

  // password reset via email confirmation
  async requestPasswordChange(): Promise<void> {
    if (!apiService.isMockEnabled()) {
      await apiService.post('/account/request-password-change');
      return;
    }
    // for mock we just generate a code and log it
    const account = this.getAccount();
    if (!account) throw new Error('Not logged in');
    const code = this.generateConfirmationCode();
    this.emailConfirmationCodes.set(account.username, code);
    console.log(`Mock password change code for ${account.email}: ${code}`);
  }

  async confirmPasswordChange(code: string, newPassword: string): Promise<void> {
    if (!apiService.isMockEnabled()) {
      await apiService.post('/account/confirm-password-change', { code, newPassword });
      return;
    }
    await apiService.mockDelay(500);
    const account = this.getAccount();
    if (!account) throw new Error('Not logged in');
    const stored = this.emailConfirmationCodes.get(account.username);
    if (stored !== code) throw new Error('Invalid code');
    // update mock password and clear
    const user = this.mockUsers.get(account.username);
    if (user) user.password = newPassword;
    this.emailConfirmationCodes.delete(account.username);
  }
  async logout(): Promise<void> {
    await apiService.mockDelay(300);
    
    this.clearToken();
    this.clearRefreshToken();
    this.clearAccount();
  }

  async refreshToken(): Promise<string> {
    if (!apiService.isMockEnabled()) {
      const resp = await apiService.post<{ token: string }>('/auth/refresh', { refreshToken: this.getRefreshToken() });
      const newToken = resp.data.data?.token;
      if (newToken) {
        this.setToken(newToken);
        return newToken;
      }
      throw new Error('Unable to refresh token');
    }

    await apiService.mockDelay(500);
    
    const account = this.getAccount();
    if (!account) {
      throw new Error('No account found');
    }

    const newToken = this.generateMockToken(account);
    this.setToken(newToken);
    
    return newToken;
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  setAccount(account: Account): void {
    localStorage.setItem(this.ACCOUNT_KEY, JSON.stringify(account));
  }

  getAccount(): Account | null {
    const data = localStorage.getItem(this.ACCOUNT_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearAccount(): void {
    localStorage.removeItem(this.ACCOUNT_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const account = this.getAccount();
    return account?.role === 'admin' || account?.role === 'moderator';
  }

  // Mock JWT token generation
  private generateMockToken(account: Account): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: account.id,
      username: account.username,
      role: account.role,
      iat: Date.now(),
      exp: Date.now() + 3600000, // 1 hour
    }));
    const signature = btoa('mock_signature');
    
    return `${header}.${payload}.${signature}`;
  }

  private generateMockRefreshToken(account: Account): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: account.id,
      username: account.username,
      type: 'refresh',
      iat: Date.now(),
      exp: Date.now() + 2592000000, // 30 days
    }));
    const signature = btoa('mock_refresh_signature');
    
    return `${header}.${payload}.${signature}`;
  }
}

export default new AuthService();