import apiService from './api.service';
import { ContentItem } from '@/types';

class ContentService {
  async fetchAll(): Promise<ContentItem[]> {
    if (apiService.isMockEnabled()) {
      // return static defaults if mocking
      return []; // consumer should handle fallback
    }
    const resp = await apiService.get<ContentItem[]>('/content');
    return resp.data.data || [];
  }

  async create(item: ContentItem): Promise<ContentItem> {
    if (apiService.isMockEnabled()) {
      // not used when mock enabled
      return item;
    }
    const { title, category, key, content } = item;
    const resp = await apiService.post<ContentItem>('/content', { title, category, key, content });
    return resp.data.data as ContentItem;
  }

  async update(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    if (apiService.isMockEnabled()) {
      return { ...updates, id } as ContentItem;
    }
    const resp = await apiService.put<ContentItem>(`/content/${id}`, updates);
    return resp.data.data as ContentItem;
  }

  async remove(id: string): Promise<void> {
    if (apiService.isMockEnabled()) {
      return;
    }
    await apiService.delete(`/content/${id}`);
  }
}

export default new ContentService();