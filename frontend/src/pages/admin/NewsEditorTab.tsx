import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { NewsArticle } from '@/types';
import { Newspaper, Plus, Edit2, Trash2, Save, X, Loader } from 'lucide-react';
import newsService from '@/services/news.service';

const defaultArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'Сервер офіційно запущений!',
    content: 'Ласкаво просимо на Frostmourne WoW сервер! Починаємо нову епоху в WoW.',
    excerpt: 'Офіційне відкриття сервера',
    image: 'https://via.placeholder.com/400x300?text=Launch',
    author: 'Admin',
    createdAt: new Date().toISOString(),
    category: 'announcement',
    featured: true,
  },
  {
    id: 2,
    title: 'Оновлення: Виправлення багів',
    content: 'В цьому оновленні ми виправили кілька важливих багів та поліпшили продуктивність.',
    excerpt: 'Новий патч 1.0.1 випущений',
    author: 'Admin',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    category: 'update',
    featured: false,
  },
];

export default function NewsEditorTab() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>(defaultArticles);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    image: string;
    category: 'announcement' | 'update' | 'event' | 'maintenance';
    featured: boolean;
  }>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'announcement',
    featured: false,
  });

  useEffect(() => {
    if (selectedArticle) {
      setFormData({
        title: selectedArticle.title,
        content: selectedArticle.content,
        excerpt: selectedArticle.excerpt,
        image: selectedArticle.image || '',
        category: selectedArticle.category,
        featured: selectedArticle.featured,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        category: 'announcement',
        featured: false,
      });
    }
  }, [selectedArticle]);

  // load from API
  useEffect(() => {
    const loadNews = async () => {
      try {
        const list = await newsService.fetchAll();
        setArticles(list.length ? list : defaultArticles);
      } catch (err) {
        console.error('failed to load news', err);
        toast.error('Не вдалося завантажити новини');
      }
    };
    loadNews();
  }, []);

  const filteredArticles = articles.filter(
    article =>
      article.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      article.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
      toast.error('Заповніть всі поля');
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        const payload: Partial<NewsArticle> = {
          ...formData,
          author: 'Admin',
          createdAt: new Date().toISOString(),
        };
        const created = await newsService.create(payload);
        setArticles([created, ...articles]);
        toast.success('Новину створено');
        setIsCreating(false);
        setSelectedArticle(null);
      } else if (selectedArticle) {
        const updated = await newsService.update(selectedArticle.id, {
          ...formData,
          author: 'Admin',
        });
        setArticles(
          articles.map(a => (a.id === updated.id ? updated : a))
        );
        toast.success('Новину оновлено');
        setSelectedArticle(null);
      }
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю новину?')) {
      return;
    }

    try {
      await newsService.remove(id);
      setArticles(articles.filter(a => a.id !== id));
      toast.success('Новину видалено');
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
      }
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Newspaper className="w-5 h-5" />
          <span>Редактор новин</span>
        </h3>
        <Button
          onClick={() => {
            setIsCreating(true);
            setSelectedArticle(null);
          }}
          className="btn-primary"
          disabled={selectedArticle !== null || isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          Нова новина
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles List */}
        <div className="lg:col-span-1">
          <Card className="card-wow">
            <CardHeader>
              <CardTitle className="text-lg">Новини</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Пошук..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredArticles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSelectedArticle(article);
                      setIsCreating(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedArticle?.id === article.id
                        ? 'bg-wow-ice/30 border-l-4 border-l-wow-ice'
                        : 'bg-wow-dark/50 hover:bg-wow-dark/70'
                    }`}
                  >
                    <p className="text-sm font-semibold text-wow-ice truncate">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{article.category}</p>
                    {article.featured && <span className="text-xs text-yellow-400">⭐ Featured</span>}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {selectedArticle || isCreating ? (
            <Card className="card-wow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit2 className="w-5 h-5" />
                  <span>{isCreating ? 'Нова новина' : 'Редагування новини'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок:</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Введіть заголовок..."
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Короткий опис:</Label>
                  <Input
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Введіть короткий опис..."
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Вміст:</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Введіть вміст новини..."
                    rows={6}
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image">URL зображення:</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Категорія:</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val as 'announcement' | 'update' | 'event' | 'maintenance' })}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Оголошення</SelectItem>
                      <SelectItem value="update">Оновлення</SelectItem>
                      <SelectItem value="event">Подія</SelectItem>
                      <SelectItem value="maintenance">Технічне обслуговування</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2 p-3 bg-wow-dark/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="featured" className="mb-0">⭐ Рекомендована новина</Label>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex-1"
                  >
                    {isSaving ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? 'Збереження...' : 'Зберегти'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Відмінити
                  </Button>
                  {selectedArticle && (
                    <Button
                      onClick={() => handleDelete(selectedArticle.id)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-wow">
              <CardContent className="pt-6">
                <p className="text-center text-gray-400">
                  Виберіть новину для редагування або створіть нову
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
