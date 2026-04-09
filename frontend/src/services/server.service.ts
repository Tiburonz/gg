import apiService from './api.service';
import { ServerStatus, NewsArticle } from '@/types';

class ServerService {
  private mockServerStatus: ServerStatus = {
    online: true,
    playersOnline: 3847,
    maxPlayers: 5000,
    uptime: 2592000, // 30 days in seconds
    realmName: 'Frostmourne',
    version: '3.3.5a (12340)',
    lastUpdate: new Date().toISOString(),
  };

  private mockNews: NewsArticle[] = [
    {
      id: 1,
      title: 'Icecrown Citadel Now Open!',
      content: 'The gates of Icecrown Citadel have been breached! Gather your strongest allies and face the Lich King in his frozen throne room. Epic loot and legendary achievements await the bravest heroes of Azeroth.',
      excerpt: 'The final raid of Wrath of the Lich King is now available. Face the Lich King!',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/03dd616e-f48a-4be3-9cb8-2e8c1aa58c68.png',
      author: 'Game Master',
      createdAt: '2024-12-20T10:00:00Z',
      category: 'announcement',
      featured: true,
    },
    {
      id: 2,
      title: 'Winter Veil Event Starting Soon',
      content: 'Greatfather Winter is coming to town! Participate in festive activities, earn special rewards, and spread holiday cheer throughout Azeroth. The Winter Veil celebration begins next week!',
      excerpt: 'Join us for the Winter Veil celebration with exclusive rewards and activities.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/33614914-f3ad-4b14-894e-d1a2a06269e1.png',
      author: 'Event Coordinator',
      createdAt: '2024-12-18T14:30:00Z',
      category: 'event',
      featured: true,
    },
    {
      id: 3,
      title: 'Server Maintenance - December 25th',
      content: 'We will be performing scheduled maintenance on December 25th from 03:00 to 05:00 server time. This maintenance will include bug fixes, performance improvements, and preparation for upcoming content.',
      excerpt: 'Scheduled maintenance on Dec 25th, 03:00-05:00 server time.',
      author: 'Technical Team',
      createdAt: '2024-12-15T09:00:00Z',
      category: 'maintenance',
      featured: false,
    },
    {
      id: 4,
      title: 'New Donation Items Available',
      content: 'Check out our updated donation shop! New mounts, pets, and exclusive items have been added. Support the server and get amazing rewards for your characters.',
      excerpt: 'New items added to the donation shop. Check them out now!',
      author: 'Shop Manager',
      createdAt: '2024-12-10T16:20:00Z',
      category: 'update',
      featured: false,
    },
  ];

  async getServerStatus(): Promise<ServerStatus> {
    await apiService.mockDelay(300);

    // Simulate random player count fluctuation
    const fluctuation = Math.floor(Math.random() * 100) - 50;
    this.mockServerStatus.playersOnline = Math.max(
      0,
      Math.min(this.mockServerStatus.maxPlayers, this.mockServerStatus.playersOnline + fluctuation)
    );
    
    this.mockServerStatus.lastUpdate = new Date().toISOString();
    this.mockServerStatus.uptime += 300; // Add 5 minutes

    return { ...this.mockServerStatus };
  }

  async getNews(featured?: boolean): Promise<NewsArticle[]> {
    await apiService.mockDelay(500);

    if (featured !== undefined) {
      return this.mockNews.filter(news => news.featured === featured);
    }

    return [...this.mockNews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getNewsById(id: number): Promise<NewsArticle | null> {
    await apiService.mockDelay(400);

    const news = this.mockNews.find(n => n.id === id);
    return news || null;
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

export default new ServerService();