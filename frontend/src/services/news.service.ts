import apiService from './api.service';
import { NewsArticle } from '@/types';

class NewsService {
  async fetchAll(): Promise<NewsArticle[]> {
    if (apiService.isMockEnabled()) {
      return [];
    }
    const resp = await apiService.get<NewsArticle[]>('/news');
    return resp.data.data || [];
  }

  async create(article: Partial<NewsArticle>): Promise<NewsArticle> {
    if (apiService.isMockEnabled()) {
      return article as NewsArticle;
    }
    const resp = await apiService.post<NewsArticle>('/news', article);
    return resp.data.data as NewsArticle;
  }

  async update(id: number, updates: Partial<NewsArticle>): Promise<NewsArticle> {
    if (apiService.isMockEnabled()) {
      return { ...updates, id } as NewsArticle;
    }
    const resp = await apiService.put<NewsArticle>(`/news/${id}`, updates);
    return resp.data.data as NewsArticle;
  }

  async remove(id: number): Promise<void> {
    if (apiService.isMockEnabled()) {
      return;
    }
    await apiService.delete(`/news/${id}`);
  }
}

export default new NewsService();