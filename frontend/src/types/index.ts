// Core entity types for WoW 3.3.5a server website

export interface Account {
  id: number;
  username: string;
  email: string;
  balance: number; // Donation coins
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'banned' | 'suspended';
  banReason?: string;
  banUntil?: string;
  role: 'user' | 'admin' | 'moderator';
  emailConfirmed: boolean; // whether user has verified their email
}

export interface Character {
  guid: number;
  name: string;
  race: number; // 1=Human, 2=Orc, 3=Dwarf, 4=Night Elf, 5=Undead, 6=Tauren, 7=Gnome, 8=Troll, 10=Blood Elf, 11=Draenei
  class: number; // 1=Warrior, 2=Paladin, 3=Hunter, 4=Rogue, 5=Priest, 6=Death Knight, 7=Shaman, 8=Mage, 9=Warlock, 11=Druid
  gender: number; // 0=Male, 1=Female
  level: number;
  money: number; // Copper
  totaltime: number; // Seconds played
  account: number;
  online: boolean;
  zone: number;
  map: number;
  equipmentCache?: string; // Item IDs
  totalKills?: number;
  arenaPoints?: number;
  honorPoints?: number;
}

export interface ShopItem {
  id: number;
  name: string;
  description: string;
  category: 'item' | 'mount' | 'pet' | 'service';
  itemId?: number; // WoW item ID for items/mounts
  serviceType?: 'rename' | 'faction_change' | 'race_change' | 'level_boost';
  price: number; // In donation coins
  image: string;
  stock?: number;
  featured: boolean;
  quality?: 'poor' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Transaction {
  id: string;
  accountId: number;
  amount: number;
  type: 'purchase' | 'deposit' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  itemName?: string;
  characterName?: string;
  createdAt: string;
  completedAt?: string;
  paymentMethod?: 'paypal' | 'stripe' | 'crypto';
  transactionHash?: string;
}

export interface ServerStatus {
  online: boolean;
  playersOnline: number;
  maxPlayers: number;
  uptime: number; // seconds
  realmName: string;
  version: string;
  lastUpdate: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  author: string;
  createdAt: string;
  category: 'announcement' | 'update' | 'event' | 'maintenance';
  featured: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  characterName: string;
  characterGuid: number;
  race: number;
  class: number;
  level: number;
  score: number; // Arena rating, achievement points, etc.
  guildName?: string;
  faction: 'alliance' | 'horde';
}

export interface Guild {
  id: number;
  name: string;
  leaderName: string;
  memberCount: number;
  level: number;
  faction: 'alliance' | 'horde';
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalTransactions: number;
  pendingTransactions: number;
  onlinePlayers: number;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  account: Account;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Shop cart
export interface CartItem {
  item: ShopItem;
  quantity: number;
  selectedCharacter?: Character;
}

// Payment
export interface PaymentRequest {
  items: CartItem[];
  paymentMethod: 'paypal' | 'stripe' | 'crypto';
  totalAmount: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

// WoW game constants
export const RACES = {
  1: { name: 'Human', faction: 'alliance' },
  2: { name: 'Orc', faction: 'horde' },
  3: { name: 'Dwarf', faction: 'alliance' },
  4: { name: 'Night Elf', faction: 'alliance' },
  5: { name: 'Undead', faction: 'horde' },
  6: { name: 'Tauren', faction: 'horde' },
  7: { name: 'Gnome', faction: 'alliance' },
  8: { name: 'Troll', faction: 'horde' },
  10: { name: 'Blood Elf', faction: 'horde' },
  11: { name: 'Draenei', faction: 'alliance' },
} as const;

export const CLASSES = {
  1: { name: 'Warrior', color: '#C79C6E' },
  2: { name: 'Paladin', color: '#F58CBA' },
  3: { name: 'Hunter', color: '#ABD473' },
  4: { name: 'Rogue', color: '#FFF569' },
  5: { name: 'Priest', color: '#FFFFFF' },
  6: { name: 'Death Knight', color: '#C41F3B' },
  7: { name: 'Shaman', color: '#0070DE' },
  8: { name: 'Mage', color: '#69CCF0' },
  9: { name: 'Warlock', color: '#9482C9' },
  11: { name: 'Druid', color: '#FF7D0A' },
} as const;

// Admin types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalTransactions: number;
  pendingTransactions: number;
  onlinePlayers: number;
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  key: string;
  content: string;
}

export interface UserGrant {
  id?: string;
  accountId: number;
  username: string;
  grantType: 'coins' | 'item' | 'mount';
  amount: number;
  itemId?: number;
  itemName?: string;
  reason: string;
  grantedBy: string;
  grantedAt: string;
  status: 'pending' | 'completed' | 'rejected';
}

export interface AdminLog {
  id: string;
  adminId: number;
  action: string;
  targetUser?: number;
  targetUsername?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}