import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from 'sonner';
import { Loader, Save, Edit2, Trash2 } from 'lucide-react';
import contentService from '@/services/content.service';
import { ContentItem } from '@/types';


// component-level placeholder while fetching or if mock enabled
const defaultContent: ContentItem[] = [
  {
    id: '1',
    title: 'Заголовок головної сторінки',
    key: 'home.title',
    content: 'Welcome to Frostmourne',
    category: 'Homepage'
  },
  {
    id: '2',
    title: 'Підзаголовок головної сторінки',
    key: 'home.subtitle',
    content: 'Experience the legendary Wrath of the Lich King expansion on our premium 3.3.5a server.',
    category: 'Homepage'
  }
];

export default function ContentEditorTab() {
  const { t } = useTranslation();
  const [content, setContent] = useState<ContentItem[]>(defaultContent);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setEditedContent(selectedItem.content);
    }
  }, [selectedItem]);

  // fetch from server when component mounts
  useEffect(() => {
    const load = async () => {
      try {
        const items = await contentService.fetchAll();
        setContent(items.length ? items : defaultContent);
      } catch (err) {
        console.error('Failed to load content', err);
        toast.error('Не вдалося завантажити контент');
      }
    };
    load();
  }, []);

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.category.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedItem || !editedContent.trim()) {
      toast.error('Будь ласка, введіть контент');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const newItem: ContentItem = { ...selectedItem, content: editedContent };
        const created = await contentService.create(newItem);
        setContent([...content, created]);
        setSelectedItem(created);
        setIsNew(false);
      } else {
        const updated = await contentService.update(selectedItem.id, { content: editedContent, title: selectedItem.title, category: selectedItem.category, key: selectedItem.key });
        setContent(content.map(i => (i.id === updated.id ? updated : i)));
        setSelectedItem(updated);
      }
      toast.success('Контент успішно збережено');
    } catch (error) {
      console.error(error);
      toast.error(String(t('common.error')));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (selectedItem) {
      setEditedContent(selectedItem.content);
      // restore metadata from content array in case user changed title/category/key
      const original = content.find(i => i.id === selectedItem.id);
      if (original) {
        setSelectedItem({ ...original });
      }
    }
  };

  const handleNew = () => {
    const blank: ContentItem = { id: Date.now().toString(), title: '', category: '', key: '', content: '' };
    setSelectedItem(blank);
    setEditedContent('');
    setIsNew(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    if (!confirm('Видалити цей елемент?')) return;
    try {
      await contentService.remove(selectedItem.id);
      setContent(content.filter(i => i.id !== selectedItem.id));
      setSelectedItem(null);
      toast.success('Елемент видалено');
    } catch (err) {
      console.error(err);
      toast.error('Не вдалося видалити');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="lg:col-span-1">
          <Card className="card-wow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Edit2 className="w-5 h-5" />
                <span>Елементи контенту</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="filter">Пошук:</Label>
                  <Input
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Шукати контент..."
                    className="mt-2"
                  />
                </div>
                <Button size="sm" onClick={handleNew} className="ml-4">
                  + Новий елемент
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredContent.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedItem(item); setIsNew(false); }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-wow-ice/30 border-l-4 border-l-wow-ice'
                        : 'bg-wow-dark/50 hover:bg-wow-dark/70'
                    }`}
                  >
                    <p className="text-sm font-semibold text-wow-ice">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <Card className="card-wow">
              <CardHeader>
                <div>
                  <CardTitle className="text-xl">{selectedItem.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Категорія: <span className="text-wow-ice font-semibold">{selectedItem.category}</span>
                  </CardDescription>
                  <CardDescription className="mt-1">
                    Ключ: <code className="bg-gray-800 px-2 py-1 rounded text-xs">{selectedItem.key}</code>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Warning */}
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-300">
                    ⚠️ Це зміни видимі для всіх користувачів! Будьте обережні при редагуванні контенту.
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Заголовок:</Label>
                    <Input
                      id="title"
                      value={selectedItem?.title || ''}
                      onChange={e => setSelectedItem(prev => prev ? { ...prev, title: e.target.value } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Категорія:</Label>
                    <Input
                      id="category"
                      value={selectedItem?.category || ''}
                      onChange={e => setSelectedItem(prev => prev ? { ...prev, category: e.target.value } : prev)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key">Ключ:</Label>
                    <Input
                      id="key"
                      value={selectedItem?.key || ''}
                      onChange={e => setSelectedItem(prev => prev ? { ...prev, key: e.target.value } : prev)}
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <Label htmlFor="content">Контент:</Label>
                  <Textarea
                    id="content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Введіть контент..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400">
                    Символів: {editedContent.length}
                  </p>
                </div>
                {/* Original Content */}
                <div className="space-y-2 p-4 bg-gray-800/30 rounded-lg">
                  <Label className="text-sm">Оригінальний контент:</Label>
                  <div className="text-sm text-gray-400 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                    {selectedItem.content}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex-1"
                  >
                    {saving ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {saving ? 'Збереження...' : 'Зберегти'}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Відмінити
                  </Button>
                  {!isNew && (
                    <Button
                      onClick={handleDelete}
                      variant="destructive"
                      className="flex-1 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Видалити
                    </Button>
                  )}
                </div>              </CardContent>
            </Card>
          ) : (
            <Card className="card-wow">
              <CardContent className="pt-6">
                <p className="text-center text-gray-400">
                  Виберіть елемент контенту для редагування
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
