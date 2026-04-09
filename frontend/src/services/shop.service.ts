import apiService from './api.service';
import { ShopItem, PaginatedResponse } from '@/types';

class ShopService {
  // Mock shop items database
  private mockItems: ShopItem[] = [
    {
      id: 1,
      name: 'Invincible\'s Reins',
      description: 'The legendary mount of the Lich King himself. Summons and dismisses a rideable Invincible.',
      category: 'mount',
      itemId: 50818,
      price: 500,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/b8f59575-87a1-4f1c-a951-46a792f81cef.png',
      featured: true,
      quality: 'legendary',
    },
    {
      id: 2,
      name: 'Shadowmourne',
      description: 'A legendary two-handed axe forged from saronite and the souls of the damned.',
      category: 'item',
      itemId: 49623,
      price: 1000,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/0526d825-ed9d-48fb-998d-aeac84e465bb.png',
      featured: true,
      quality: 'legendary',
    },
    {
      id: 3,
      name: 'Frostwyrm Mount',
      description: 'A fearsome undead dragon mount. Requires level 80.',
      category: 'mount',
      itemId: 54729,
      price: 350,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/b8f59575-87a1-4f1c-a951-46a792f81cef.png',
      featured: true,
      quality: 'epic',
    },
    {
      id: 4,
      name: 'Character Rename',
      description: 'Change your character\'s name. Choose wisely!',
      category: 'service',
      serviceType: 'rename',
      price: 50,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/a6d11c11-935a-455c-92fd-bf7321393f94.png',
      featured: false,
      quality: 'rare',
    },
    {
      id: 5,
      name: 'Faction Change',
      description: 'Switch your character from Alliance to Horde or vice versa.',
      category: 'service',
      serviceType: 'faction_change',
      price: 150,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/a6d11c11-935a-455c-92fd-bf7321393f94.png',
      featured: false,
      quality: 'epic',
    },
    {
      id: 6,
      name: 'Race Change',
      description: 'Change your character\'s race while keeping your class and progress.',
      category: 'service',
      serviceType: 'race_change',
      price: 120,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/a6d11c11-935a-455c-92fd-bf7321393f94.png',
      featured: false,
      quality: 'epic',
    },
    {
      id: 7,
      name: 'Frostmourne Replica',
      description: 'A replica of the cursed runeblade Frostmourne.',
      category: 'item',
      itemId: 50415,
      price: 800,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/0526d825-ed9d-48fb-998d-aeac84e465bb.png',
      featured: true,
      quality: 'legendary',
    },
    {
      id: 8,
      name: 'Celestial Steed',
      description: 'A majestic celestial mount that scales with your riding skill.',
      category: 'mount',
      itemId: 54811,
      price: 250,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/b8f59575-87a1-4f1c-a951-46a792f81cef.png',
      featured: false,
      quality: 'epic',
    },
    {
      id: 9,
      name: 'Tier 10 Full Set',
      description: 'Complete Tier 10 armor set for your class.',
      category: 'item',
      price: 600,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/0526d825-ed9d-48fb-998d-aeac84e465bb.png',
      featured: false,
      quality: 'epic',
    },
    {
      id: 10,
      name: 'Level 80 Boost',
      description: 'Instantly boost one character to level 80.',
      category: 'service',
      serviceType: 'level_boost',
      price: 300,
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/898817/2026-01-12/a6d11c11-935a-455c-92fd-bf7321393f94.png',
      featured: true,
      quality: 'legendary',
    },
  ];

  async getShopItems(
    category?: string,
    page: number = 1,
    pageSize: number = 12
  ): Promise<PaginatedResponse<ShopItem>> {
    await apiService.mockDelay(500);

    let filteredItems = this.mockItems;

    if (category && category !== 'all') {
      filteredItems = this.mockItems.filter(item => item.category === category);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredItems.length / pageSize),
    };
  }

  async getItemById(id: number): Promise<ShopItem | null> {
    await apiService.mockDelay(300);

    const item = this.mockItems.find(item => item.id === id);
    return item || null;
  }

  async getFeaturedItems(): Promise<ShopItem[]> {
    await apiService.mockDelay(400);

    return this.mockItems.filter(item => item.featured);
  }

  async searchItems(query: string): Promise<ShopItem[]> {
    await apiService.mockDelay(600);

    const lowerQuery = query.toLowerCase();
    return this.mockItems.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Admin methods
  async createItem(item: Omit<ShopItem, 'id'>): Promise<ShopItem> {
    await apiService.mockDelay(500);

    const newItem: ShopItem = {
      ...item,
      id: Math.max(...this.mockItems.map(i => i.id)) + 1,
    };

    this.mockItems.push(newItem);
    return newItem;
  }

  async updateItem(id: number, updates: Partial<ShopItem>): Promise<ShopItem> {
    await apiService.mockDelay(500);

    const index = this.mockItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }

    this.mockItems[index] = { ...this.mockItems[index], ...updates };
    return this.mockItems[index];
  }

  async deleteItem(id: number): Promise<void> {
    await apiService.mockDelay(400);

    const index = this.mockItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }

    this.mockItems.splice(index, 1);
  }
}

export default new ShopService();